'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Part {
  id: string
  sku: string
  name: string
  description: string
  image_url: string
  category: string
  in_stock: number
  committed: number
  on_order: number
  min_threshold: number
  unit: string
  created_at: string
}

interface Store {
  id: string
  store_name: string
}

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    image_url: '',
    category: '',
    in_stock: 0,
    min_threshold: 5,
    unit: 'pcs'
  })

  const supabase = createClient()

  useEffect(() => {
    fetchStore()
  }, [])

  useEffect(() => {
    if (store) {
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

  async function fetchParts() {
    if (!store) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .eq('store_id', store.id)
        .order('name')

      if (error) throw error
      setParts(data || [])
    } catch (err) {
      console.error('Error fetching parts:', err)
      setError('Failed to load parts')
    } finally {
      setLoading(false)
    }
  }

  async function savePart() {
    if (!store) return
    if (!formData.name.trim()) {
      alert('Part name is required')
      return
    }

    try {
      if (editingPart) {
        const { error } = await supabase
          .from('parts')
          .update({
            sku: formData.sku,
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
            in_stock: formData.in_stock,
            min_threshold: formData.min_threshold,
            unit: formData.unit,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPart.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('parts')
          .insert({
            store_id: store.id,
            sku: formData.sku,
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
            in_stock: formData.in_stock,
            min_threshold: formData.min_threshold,
            unit: formData.unit
          })

        if (error) throw error
      }

      closeModal()
      fetchParts()
    } catch (err) {
      console.error('Error saving part:', err)
      alert('Failed to save part')
    }
  }

  async function deletePart(id: string) {
    if (!confirm('Are you sure you want to delete this part?')) return

    try {
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchParts()
    } catch (err) {
      console.error('Error deleting part:', err)
      alert('Failed to delete part')
    }
  }

  function openAddModal() {
    setEditingPart(null)
    setFormData({
      sku: '',
      name: '',
      description: '',
      image_url: '',
      category: '',
      in_stock: 0,
      min_threshold: 5,
      unit: 'pcs'
    })
    setShowModal(true)
  }

  function openEditModal(part: Part) {
    setEditingPart(part)
    setFormData({
      sku: part.sku || '',
      name: part.name,
      description: part.description || '',
      image_url: part.image_url || '',
      category: part.category || '',
      in_stock: part.in_stock,
      min_threshold: part.min_threshold,
      unit: part.unit || 'pcs'
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingPart(null)
  }

  const categories = [...new Set(parts.map(p => p.category).filter(Boolean))]

  const filteredParts = parts.filter(part => {
    const matchesSearch = !searchTerm || 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || part.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalParts = parts.length
  const lowStockParts = parts.filter(p => p.in_stock <= p.min_threshold && p.in_stock > 0).length
  const outOfStockParts = parts.filter(p => p.in_stock === 0).length

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
        <h1 className="text-3xl font-bold text-gray-900">Parts Management</h1>
        <p className="text-gray-600 mt-1">Manage your inventory parts and components</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Parts</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalParts}</p>
            </div>
            <div className="text-3xl">🔧</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{parts.filter(p => p.in_stock > p.min_threshold).length}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{lowStockParts}</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{outOfStockParts}</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search parts by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            <span className="mr-2">+</span> Add Part
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">🔧</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parts found</h3>
            <p className="text-gray-500 mb-4">
              {parts.length === 0 ? 'Add your first part to get started' : 'Try adjusting your search or filters'}
            </p>
            {parts.length === 0 && (
              <button
                onClick={openAddModal}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Add Your First Part
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">PART</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">SKU</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">CATEGORY</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">IN STOCK</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded">COMMITTED</span>
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">AVAILABLE</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">STATUS</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParts.map((part) => {
                  const available = part.in_stock - part.committed
                  const status = part.in_stock === 0 ? 'out' : 
                                 part.in_stock <= part.min_threshold ? 'low' : 'ok'
                  
                  return (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            {part.image_url ? (
                              <img src={part.image_url} alt={part.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <span className="text-xl">🔧</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{part.name}</p>
                            {part.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">{part.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{part.sku || '-'}</td>
                      <td className="py-4 px-6">
                        {part.category ? (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{part.category}</span>
                        ) : '-'}
                      </td>
                      <td className="py-4 px-6 text-center font-medium">{part.in_stock} {part.unit}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                          {part.committed}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900">{available} {part.unit}</td>
