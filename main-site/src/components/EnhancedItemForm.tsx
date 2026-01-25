'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ItemTypeManager from './ItemTypeManager'

interface ItemType {
  id: string
  name: string
  icon: string
  color: string
}

interface Unit {
  id: string
  name: string
  display_name: string | null
  category: string
}

interface EnhancedItemFormProps {
  onClose: () => void
  onSuccess: () => void
  editItem?: any
}

export default function EnhancedItemForm({ onClose, onSuccess, editItem }: EnhancedItemFormProps) {
  const [name, setName] = useState(editItem?.name || '')
  const [sku, setSku] = useState(editItem?.sku || '')
  const [itemType, setItemType] = useState(editItem?.item_type || '')
  const [unit, setUnit] = useState(editItem?.unit || 'pcs')
  const [currentStock, setCurrentStock] = useState(editItem?.current_stock || 0)
  const [minStock, setMinStock] = useState(editItem?.min_stock || 0)
  const [description, setDescription] = useState(editItem?.description || '')
  
  const [itemTypes, setItemTypes] = useState<ItemType[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [showTypeManager, setShowTypeManager] = useState(false)
  const [showCustomUnit, setShowCustomUnit] = useState(false)
  const [customUnit, setCustomUnit] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchItemTypes()
    fetchUnits()
  }, [])

  async function fetchItemTypes() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('item_types')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) throw error

      // If no types, initialize defaults
      if (!data || data.length === 0) {
        const defaultTypes = [
          { name: 'Part', icon: '🔧', color: '#10B981' },
          { name: 'Component', icon: '⚙️', color: '#3B82F6' },
          { name: 'Assembly', icon: '📦', color: '#8B5CF6' }
        ]

        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) return

        for (const type of defaultTypes) {
          await supabase.from('item_types').insert({
            user_id: currentUser.id,
            ...type,
            is_system: true
          })
        }

        // Fetch again
        const { data: newData } = await supabase
          .from('item_types')
          .select('*')
          .eq('user_id', currentUser.id)
        setItemTypes(newData || [])
      } else {
        setItemTypes(data)
      }
    } catch (err) {
      console.error('Error fetching types:', err)
    }
  }

  async function fetchUnits() {
    const { data } = await supabase
      .from('units')
      .select('*')
      .order('category')
      .order('name')
    
    setUnits(data || [])
  }

  async function handleSubmit() {
    if (!name.trim() || !itemType || !unit) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const itemData = {
        user_id: user.id,
        name: name.trim(),
        sku: sku.trim() || null,
        item_type: itemType,
        unit,
        current_stock: currentStock,
        min_stock: minStock,
        description: description.trim() || null
      }

      if (editItem) {
        const { error } = await supabase
          .from('items')
          .update(itemData)
          .eq('id', editItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('items')
          .insert(itemData)
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error saving item:', err)
      alert(err.message || 'Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  const groupedUnits = units.reduce((acc, unit) => {
    if (!acc[unit.category]) {
      acc[unit.category] = []
    }
    acc[unit.category].push(unit)
    return acc
  }, {} as Record<string, Unit[]>)

  const categoryNames: Record<string, string> = {
    quantity: '📦 Quantity',
    weight: '⚖️ Weight',
    length: '📏 Length',
    volume: '🧪 Volume',
    area: '📐 Area',
    other: '📋 Other'
  }

  function handleCustomUnit() {
    if (customUnit.trim()) {
      setUnit(customUnit.trim())
      setShowCustomUnit(false)
      setCustomUnit('')
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900">
              {editItem ? 'Edit Item' : 'Create New Item'}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., LED Strip 5m"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g., LED-5M-RGB"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Categorization */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Categorization</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Type *
                </label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select type...</option>
                  {itemTypes.map(type => (
                    <option key={type.id} value={type.name.toLowerCase()}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowTypeManager(true)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
                >
                  + Create Custom Type
                </button>
              </div>
            </div>

            {/* Stock Management */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Stock Management</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  {showCustomUnit ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        placeholder="Enter custom unit..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCustomUnit}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomUnit(false)}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <select
                      value={unit}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setShowCustomUnit(true)
                        } else {
                          setUnit(e.target.value)
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {Object.entries(groupedUnits).map(([category, categoryUnits]) => (
                        <optgroup key={category} label={categoryNames[category] || category}>
                          {categoryUnits.map(u => (
                            <option key={u.id} value={u.name}>
                              {u.name} ({u.display_name})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="__custom__">✏️ Custom unit...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !name.trim() || !itemType || !unit}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editItem ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      </div>

      {/* Type Manager Modal */}
      {showTypeManager && (
        <ItemTypeManager
          onClose={() => setShowTypeManager(false)}
          onTypeCreated={() => {
            fetchItemTypes()
            setShowTypeManager(false)
          }}
        />
      )}
    </>
  )
}
