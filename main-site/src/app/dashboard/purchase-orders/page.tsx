'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Supplier {
  id: string
  name: string
  email: string | null
}

interface Part {
  id: string
  name: string
  sku: string | null
  in_stock: number
  unit: string
}

interface PoItem {
  id: string
  part_id: string
  quantity_ordered: number
  quantity_received: number
  cost_per_unit: number
  part?: Part
}

interface PurchaseOrder {
  id: string
  po_number: string
  status: string
  total_cost: number
  notes: string | null
  created_at: string
  sent_at: string | null
  expected_at: string | null
  received_at: string | null
  supplier_id: string | null
  supplier?: Supplier
  po_items?: PoItem[]
}

interface Store {
  id: string
  store_name: string
}

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [parts, setParts] = useState<Part[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  // Form state
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [poItems, setPoItems] = useState<{ part_id: string; quantity: number; cost: number }[]>([])
  const [notes, setNotes] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchStore()
  }, [])

  useEffect(() => {
    if (store) {
      fetchPurchaseOrders()
      fetchSuppliers()
      fetchParts()
    }
  }, [store])

  async function fetchStore() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      if (stores && stores.length > 0) {
        setStore(stores[0])
      } else {
        setError('Please connect a store first')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error fetching store:', err)
      setLoading(false)
    }
  }

  async function fetchPurchaseOrders() {
    if (!store) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*, supplier:suppliers(*), po_items(*, part:parts(*))')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPurchaseOrders(data || [])
    } catch (err) {
      console.error('Error fetching POs:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSuppliers() {
    if (!store) return
    const { data } = await supabase
      .from('suppliers')
      .select('*')
      .eq('store_id', store.id)
      .order('name')
    setSuppliers(data || [])
  }

  async function fetchParts() {
    if (!store) return
    const { data } = await supabase
      .from('parts')
      .select('*')
      .eq('store_id', store.id)
      .order('name')
    setParts(data || [])
  }

  async function createPurchaseOrder() {
    if (!store || !selectedSupplier || poItems.length === 0) {
      alert('Please select supplier and add at least one part')
      return
    }

    try {
      const totalCost = poItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0)
      const poNumber = `PO-${Date.now().toString().slice(-8)}`

      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          store_id: store.id,
          supplier_id: selectedSupplier,
          po_number: poNumber,
          status: 'draft',
          total_cost: totalCost,
          notes: notes || null
        })
        .select()
        .single()

      if (poError) throw poError

      // Add PO items
      for (const item of poItems) {
        await supabase.from('po_items').insert({
          po_id: po.id,
          part_id: item.part_id,
          quantity_ordered: item.quantity,
          quantity_received: 0,
          cost_per_unit: item.cost
        })
      }

      closeModal()
      fetchPurchaseOrders()
    } catch (err) {
      console.error('Error creating PO:', err)
      alert('Failed to create purchase order')
    }
  }

  async function updatePoStatus(poId: string, newStatus: string) {
    try {
      const updates: Record<string, string | null> = { status: newStatus }
      
      if (newStatus === 'sent') updates.sent_at = new Date().toISOString()
      if (newStatus === 'received') updates.received_at = new Date().toISOString()

      await supabase
        .from('purchase_orders')
        .update(updates)
        .eq('id', poId)

      // If received, update part stock
      if (newStatus === 'received') {
        const po = purchaseOrders.find(p => p.id === poId)
        if (po?.po_items) {
          for (const item of po.po_items) {
            const part = parts.find(p => p.id === item.part_id)
            if (part) {
              await supabase
                .from('parts')
                .update({ 
                  in_stock: part.in_stock + item.quantity_ordered,
                  updated_at: new Date().toISOString()
                })
                .eq('id', part.id)

              // Update quantity received
              await supabase
                .from('po_items')
                .update({ quantity_received: item.quantity_ordered })
                .eq('id', item.id)
            }
          }
        }
      }

      fetchPurchaseOrders()
      fetchParts()
    } catch (err) {
      console.error('Error updating PO:', err)
    }
  }

  async function deletePo(id: string) {
    if (!confirm('Delete this purchase order?')) return
    try {
      await supabase.from('purchase_orders').delete().eq('id', id)
      fetchPurchaseOrders()
    } catch (err) {
      console.error('Error deleting PO:', err)
    }
  }

  function addPoItem() {
    setPoItems([...poItems, { part_id: '', quantity: 1, cost: 0 }])
  }

  function removePoItem(index: number) {
    setPoItems(poItems.filter((_, i) => i !== index))
  }

  function updatePoItem(index: number, field: string, value: string | number) {
    const updated = [...poItems]
    updated[index] = { ...updated[index], [field]: value }
    setPoItems(updated)
  }

  function openModal() {
    setSelectedSupplier('')
    setPoItems([{ part_id: '', quantity: 1, cost: 0 }])
    setNotes('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
  }

  const filteredPOs = purchaseOrders.filter(po => {
    if (filter === 'all') return true
    return po.status === filter
  })

  const statusCounts = {
    draft: purchaseOrders.filter(p => p.status === 'draft').length,
    sent: purchaseOrders.filter(p => p.status === 'sent').length,
    received: purchaseOrders.filter(p => p.status === 'received').length,
  }

  if (loading && !store) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !store) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          {error}. <a href="/dashboard/stores" className="underline">Go to Stores</a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="text-gray-600 mt-1">Order parts from your suppliers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total POs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{purchaseOrders.length}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Draft</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">{statusCounts.draft}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sent/Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{statusCounts.sent}</p>
            </div>
            <div className="text-3xl">📤</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Received</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{statusCounts.received}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'draft', 'sent', 'received'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={openModal}
            disabled={suppliers.length === 0 || parts.length === 0}
            className="flex items-center px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium disabled:opacity-50"
          >
            <span className="mr-2">+</span> Create PO
          </button>
        </div>
        {(suppliers.length === 0 || parts.length === 0) && (
          <p className="text-yellow-600 text-sm mt-2">
            ⚠️ Add suppliers and parts first. 
            <a href="/dashboard/suppliers" className="underline ml-1">Suppliers</a> | 
            <a href="/dashboard/parts" className="underline ml-1">Parts</a>
          </p>
        )}
      </div>

      {/* PO List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredPOs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders</h3>
            <p className="text-gray-500">Create your first PO to order parts from suppliers</p>
          </div>
        ) : (
          filteredPOs.map(po => (
            <div key={po.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{po.po_number}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        po.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        po.status === 'sent' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">Supplier: {po.supplier?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(po.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${po.total_cost?.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{po.po_items?.length || 0} items</p>
                  </div>
                </div>

                {/* Items */}
                {po.po_items && po.po_items.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="text-left pb-2">Part</th>
                          <th className="text-center pb-2">Qty</th>
                          <th className="text-right pb-2">Cost</th>
                          <th className="text-right pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {po.po_items.map(item => (
                          <tr key={item.id}>
                            <td className="py-2">{item.part?.name || 'Unknown'}</td>
                            <td className="py-2 text-center">{item.quantity_ordered}</td>
                            <td className="py-2 text-right">${item.cost_per_unit?.toFixed(2)}</td>
                            <td className="py-2 text-right font-medium">
                              ${(item.quantity_ordered * item.cost_per_unit).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {po.status === 'draft' && (
                    <>
                      <button
                        onClick={() => updatePoStatus(po.id, 'sent')}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                      >
                        Mark as Sent
                      </button>
                      <button
                        onClick={() => deletePo(po.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {po.status === 'sent' && (
                    <button
                      onClick={() => updatePoStatus(po.id, 'received')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    >
                      Mark as Received (Add to Stock)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create Purchase Order</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select supplier...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Parts *</label>
                  <button
                    onClick={addPoItem}
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    + Add Part
                  </button>
                </div>
                
                {poItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={item.part_id}
                      onChange={(e) => updatePoItem(index, 'part_id', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="">Select part...</option>
                      {parts.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.in_stock})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updatePoItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Cost"
                      value={item.cost}
                      onChange={(e) => updatePoItem(index, 'cost', parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    {poItems.length > 1 && (
                      <button
                        onClick={() => removePoItem(index)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                  placeholder="Optional notes..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-lg font-bold text-gray-900">
                  Total: ${poItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createPurchaseOrder}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Create PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
