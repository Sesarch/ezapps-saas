'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Item {
  id: string
  name: string
  sku: string | null
  item_type: string
  current_stock: number
}

interface BomItem {
  id: string
  item_id: string
  quantity_needed: number
  items?: Item
}

interface NewItemRow {
  tempId: string
  item_id: string
  quantity: number
}

interface ProductPanelProps {
  productId: string
  variantId: string
  productTitle: string
  variantTitle: string | null
  onClose: () => void
  onUpdate: () => void
}

export default function ProductPanel({
  productId,
  variantId,
  productTitle,
  variantTitle,
  onClose,
  onUpdate
}: ProductPanelProps) {
  const [existingItems, setExistingItems] = useState<BomItem[]>([])
  const [availableItems, setAvailableItems] = useState<Item[]>([])
  const [newRows, setNewRows] = useState<NewItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch existing BOM items for this product/variant
      const { data: bomData } = await supabase
        .from('bom_items')
        .select(`
          *,
          items (
            id,
            name,
            sku,
            item_type,
            current_stock
          )
        `)
        .eq('user_id', user.id)
        .eq('shopify_product_id', productId)
        .eq('shopify_variant_id', variantId)

      setExistingItems(bomData || [])

      // Fetch all available items
      const { data: itemsData } = await supabase
        .from('items')
        .select('id, name, sku, item_type, current_stock')
        .eq('user_id', user.id)
        .order('name')

      setAvailableItems(itemsData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  function addNewRow() {
    setNewRows([...newRows, {
      tempId: `new-${Date.now()}`,
      item_id: '',
      quantity: 1
    }])
  }

  function updateNewRow(tempId: string, field: 'item_id' | 'quantity', value: string | number) {
    setNewRows(newRows.map(row => 
      row.tempId === tempId ? { ...row, [field]: value } : row
    ))
  }

  function removeNewRow(tempId: string) {
    setNewRows(newRows.filter(row => row.tempId !== tempId))
  }

  async function deleteExistingItem(bomItemId: string) {
    if (!confirm('Remove this item from BOM?')) return

    try {
      await supabase.from('bom_items').delete().eq('id', bomItemId)
      setExistingItems(existingItems.filter(item => item.id !== bomItemId))
      onUpdate()
    } catch (err) {
      console.error('Error deleting item:', err)
      alert('Failed to delete item')
    }
  }

  async function updateQuantity(bomItemId: string, newQuantity: number) {
    try {
      await supabase
        .from('bom_items')
        .update({ quantity_needed: newQuantity })
        .eq('id', bomItemId)

      setExistingItems(existingItems.map(item =>
        item.id === bomItemId ? { ...item, quantity_needed: newQuantity } : item
      ))
      onUpdate()
    } catch (err) {
      console.error('Error updating quantity:', err)
      alert('Failed to update quantity')
    }
  }

  async function saveNewItems() {
    const validRows = newRows.filter(row => row.item_id && row.quantity > 0)
    
    if (validRows.length === 0) {
      onClose()
      return
    }

    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!store) throw new Error('No store found')

      const itemsToInsert = validRows.map(row => {
        const item = availableItems.find(i => i.id === row.item_id)
        return {
          user_id: user.id,
          store_id: store.id,
          shopify_product_id: productId,
          shopify_variant_id: variantId,
          product_title: productTitle,
          variant_title: variantTitle,
          item_id: row.item_id,
          quantity_needed: row.quantity
        }
      })

      const { error } = await supabase
        .from('bom_items')
        .insert(itemsToInsert)

      if (error) throw error

      onUpdate()
      onClose()
    } catch (err) {
      console.error('Error saving items:', err)
      alert('Failed to save items')
    } finally {
      setSaving(false)
    }
  }

  const getItemIcon = (type: string) => {
    const icons: Record<string, string> = {
      part: '🔧',
      component: '⚙️',
      assembly: '📦',
      box: '📦',
      packaging: '📦',
      label: '🏷️'
    }
    return icons[type.toLowerCase()] || '📦'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-end z-50">
      <div className="bg-white w-full sm:w-[600px] h-full sm:h-[90vh] sm:rounded-l-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{productTitle}</h2>
              {variantTitle && variantTitle !== 'Default Title' && (
                <p className="text-sm text-gray-500 mt-1">Variant: {variantTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Existing BOM Items */}
              {existingItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Current BOM Items ({existingItems.length})
                  </h3>
                  <div className="space-y-2">
                    {existingItems.map(bomItem => (
                      <div key={bomItem.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-2xl">
                              {getItemIcon(bomItem.items?.item_type || '')}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{bomItem.items?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">
                                SKU: {bomItem.items?.sku || '-'} • Stock: {bomItem.items?.current_stock || 0}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Qty:</span>
                              <input
                                type="number"
                                value={bomItem.quantity_needed}
                                onChange={(e) => updateQuantity(bomItem.id, parseInt(e.target.value) || 1)}
                                className="w-20 px-2 py-1 border border-gray-200 rounded text-center"
                                min="1"
                              />
                            </div>
                            <button
                              onClick={() => deleteExistingItem(bomItem.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Add New Items
                </h3>
                
                <div className="space-y-2">
                  {newRows.map(row => (
                    <div key={row.tempId} className="flex items-center gap-2">
                      <select
                        value={row.item_id}
                        onChange={(e) => updateNewRow(row.tempId, 'item_id', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select item...</option>
                        {availableItems.map(item => (
                          <option key={item.id} value={item.id}>
                            {getItemIcon(item.item_type)} {item.name} ({item.current_stock} in stock)
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => updateNewRow(row.tempId, 'quantity', parseInt(e.target.value) || 1)}
                        placeholder="Qty"
                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
                        min="1"
                      />
                      <button
                        onClick={() => removeNewRow(row.tempId)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addNewRow}
                  className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
                >
                  + Add Item Row
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {newRows.length > 0 && (
            <button
              onClick={saveNewItems}
              disabled={saving}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : `Save ${newRows.filter(r => r.item_id).length} New Items`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
