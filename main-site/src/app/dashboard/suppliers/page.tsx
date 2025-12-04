'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  website: string
  notes: string
  created_at: string
}

interface Store {
  id: string
  store_name: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    notes: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchStore()
  }, [])

  useEffect(() => {
    if (store) {
      fetchSuppliers()
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

  async function fetchSuppliers() {
    if (!store) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('store_id', store.id)
        .order('name')

      if (error) throw error
      setSuppliers(data || [])
    } catch (err) {
      console.error('Error fetching suppliers:', err)
      setError('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  async function saveSupplier() {
    if (!store) return
    if (!formData.name.trim()) {
      alert('Supplier name is required')
      return
    }

    try {
      if (editingSupplier) {
        const { error } = await supabase
          .from('suppliers')
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            website: formData.website,
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSupplier.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert({
            store_id: store.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            website: formData.website,
            notes: formData.notes
          })

        if (error) throw error
      }

      closeModal()
      fetchSuppliers()
    } catch (err) {
      console.error('Error saving supplier:', err)
      alert('Failed to save supplier')
    }
  }

  async function deleteSupplier(id: string) {
    if (!confirm('Are you sure you want to delete this supplier?')) return

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchSuppliers()
    } catch (err) {
      console.error('Error deleting supplier:', err)
      alert('Failed to delete supplier')
    }
  }

  function openAddModal() {
    setEditingSupplier(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      notes: ''
    })
    setShowModal(true)
  }

  function openEditModal(supplier: Supplier) {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      website: supplier.website || '',
      notes: supplier.notes || ''
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingSupplier(null)
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    return !searchTerm || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  })

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
        <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
        <p className="text-gray-600 mt-1">Manage your parts suppliers and vendors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Suppliers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{suppliers.length}</p>
            </div>
            <div className="text-3xl">🚚</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">With Email</p>
              <p className="text-3xl font-bold text-teal-600 mt-1">{suppliers.filter(s => s.email).length}</p>
            </div>
            <div className="text-3xl">📧</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">With Phone</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{suppliers.filter(s => s.phone).length}</p>
            </div>
            <div className="text-3xl">📞</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            <span className="mr-2">+</span> Add Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-500 mb-4">
              {suppliers.length === 0 ? 'Add your first supplier to get started' : 'Try adjusting your search'}
            </p>
            {suppliers.length === 0 && (
              <button
                onClick={openAddModal}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Add Your First Supplier
              </button>
            )}
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-2xl">🏭</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                    {supplier.website && (
                      <a 
                        href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:underline"
                      >
                        {supplier.website}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(supplier)}
                    className="text-gray-400 hover:text-teal-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteSupplier(supplier.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {supplier.email && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📧</span>
                    <a href={`mailto:${supplier.email}`} className="hover:text-teal-600">{supplier.email}</a>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📞</span>
                    <a href={`tel:${supplier.phone}`} className="hover:text-teal-600">{supplier.phone}</a>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{supplier.address}</span>
                  </div>
                )}
                {supplier.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-gray-500 text-xs">{supplier.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Acme Parts Inc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="contact@supplier.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="www.supplier.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSupplier}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
