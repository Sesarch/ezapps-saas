'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import ItemTypeManager from './ItemTypeManager'

interface ItemType {
  id: string
  name: string
  icon: string
  color: string
  is_system: boolean
}

interface Unit {
  id: string
  name: string
  display_name: string
  category: string
}

interface EnhancedItemFormProps {
  onClose: () => void
  onSuccess: () => void
  editItem?: any
}

export default function EnhancedItemForm({ onClose, onSuccess, editItem }: EnhancedItemFormProps) {
  const [formData, setFormData] = useState({
    name: editItem?.name || '',
    sku: editItem?.sku || '',
    description: editItem?.description || '',
    item_type: editItem?.item_type || 'part',
    unit_abbreviation: editItem?.unit_abbreviation || 'pcs',
    current_stock: editItem?.current_stock || 0,
    min_stock: editItem?.min_stock || 0,
  })

  const [itemTypes, setItemTypes] = useState<ItemType[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [showTypeManager, setShowTypeManager] = useState(false)
  const [showCustomUnit, setShowCustomUnit] = useState(false)
  const [customUnit, setCustomUnit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadItemTypes()
    loadUnits()
  }, [])

  async function loadItemTypes() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch custom types
      const { data, error } = await supabase
        .from('item_types')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) {
        console.error('Error loading item types:', error)
        // Use fallback types if database query fails
        setItemTypes([
          { id: '1', name: 'part', icon: '🔧', color: 'orange', is_system: true },
          { id: '2', name: 'component', icon: '⚙️', color: 'purple', is_system: true },
          { id: '3', name: 'assembly', icon: '📦', color: 'indigo', is_system: true },
        ])
        return
      }

      if (!data || data.length === 0) {
        // Initialize default types
        await initializeDefaultTypes(user.id)
      } else {
        setItemTypes(data)
      }
    } catch (err) {
      console.error('Failed to load item types:', err)
      // Use fallback
      setItemTypes([
        { id: '1', name: 'part', icon: '🔧', color: 'orange', is_system: true },
        { id: '2', name: 'component', icon: '⚙️', color: 'purple', is_system: true },
        { id: '3', name: 'assembly', icon: '📦', color: 'indigo', is_system: true },
      ])
    }
  }

  async function initializeDefaultTypes(userId: string) {
    const defaultTypes = [
      { user_id: userId, name: 'part', icon: '🔧', color: 'orange', is_system: true },
      { user_id: userId, name: 'component', icon: '⚙️', color: 'purple', is_system: true },
      { user_id: userId, name: 'assembly', icon: '📦', color: 'indigo', is_system: true },
    ]

    const { data, error } = await supabase
      .from('item_types')
      .insert(defaultTypes)
      .select()

    if (!error && data) {
      setItemTypes(data)
    } else {
      // Fallback to local types
      setItemTypes(defaultTypes.map((t, i) => ({ ...t, id: String(i + 1) })))
    }
  }

  async function loadUnits() {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('category, name')

      if (error) {
        console.error('Error loading units:', error)
        // Use fallback units
        setUnits([
          { id: '1', name: 'pcs', display_name: 'pieces', category: 'quantity' },
          { id: '2', name: 'box', display_name: 'boxes', category: 'quantity' },
          { id: '3', name: 'kg', display_name: 'kilograms', category: 'weight' },
        ])
        return
      }

      setUnits(data || [])
    } catch (err) {
      console.error('Failed to load units:', err)
      setUnits([
        { id: '1', name: 'pcs', display_name: 'pieces', category: 'quantity' },
        { id: '2', name: 'box', display_name: 'boxes', category: 'quantity' },
        { id: '3', name: 'kg', display_name: 'kilograms', category: 'weight' },
      ])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const itemData = {
        ...formData,
        user_id: user.id,
        store_id: 'default', // Update if you have store context
      }

      if (editItem) {
        // Update existing item
        const { error } = await supabase
          .from('items')
          .update(itemData)
          .eq('id', editItem.id)

        if (error) throw error
      } else {
        // Create new item
        const { error } = await supabase
          .from('items')
          .insert([itemData])

        if (error) throw error
      }

      onSuccess()
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCustomUnit() {
    if (!customUnit.trim()) return

    setFormData({ ...formData, unit_abbreviation: customUnit.trim() })
    setShowCustomUnit(false)
    setCustomUnit('')
  }

  // Group units by category
  const groupedUnits = units.reduce((acc, unit) => {
    if (!acc[unit.category]) {
      acc[unit.category] = []
    }
    acc[unit.category].push(unit)
    return acc
  }, {} as Record<string, Unit[]>)

  const categoryIcons: Record<string, string> = {
    quantity: '📦',
    weight: '⚖️',
    length: '📏',
    volume: '🧪',
    area: '📐',
    other: '📋',
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {editItem ? 'Edit Item' : 'Create New Item'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Steel Bolt M8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., BOLT-M8-001"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Optional description..."
                />
              </div>
            </div>

            {/* Categorization */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorization</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type *
                </label>
                <select
                  value={formData.item_type}
                  onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {itemTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={() => setShowTypeManager(true)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  + Create Custom Type
                </button>
              </div>
            </div>

            {/* Stock Management */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Management</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                {!showCustomUnit ? (
                  <select
                    value={formData.unit_abbreviation}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomUnit(true)
                      } else {
                        setFormData({ ...formData, unit_abbreviation: e.target.value })
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(groupedUnits).map(([category, categoryUnits]) => (
                      <optgroup 
                        key={category} 
                        label={`${categoryIcons[category] || '📋'} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                      >
                        {categoryUnits.map((unit) => (
                          <option key={unit.id} value={unit.name}>
                            {unit.name} ({unit.display_name})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="custom">✏️ Custom unit...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      placeholder="Enter unit abbreviation"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUnit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomUnit(false)
                        setCustomUnit('')
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={formData.current_stock}
                    onChange={(e) => setFormData({ ...formData, current_stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : editItem ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Item Type Manager Modal */}
      {showTypeManager && (
        <ItemTypeManager
          onClose={() => setShowTypeManager(false)}
          onSuccess={() => {
            setShowTypeManager(false)
            loadItemTypes() // Reload types
          }}
        />
      )}
    </>
  )
}
