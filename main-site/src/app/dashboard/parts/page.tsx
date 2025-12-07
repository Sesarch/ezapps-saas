'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Part {
  id: string
  sku: string | null
  name: string
  description: string | null
  image_url: string | null
  category: string | null
  in_stock: number
  committed: number
  on_order: number
  min_threshold: number
  unit: string
  created_at: string
}

interface Store {
  id: string
  store_url: string
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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  async function uploadImage(file: File): Promise<string | null> {
    try {
      setUploading(true)
      
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${store?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('part-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('part-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      console.error('Error uploading image:', err)
      alert('Failed to upload image')
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    const url = await uploadImage(file)
    if (url) {
      setFormData({ ...formData, image_url: url })
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
            sku: formData.sku || null,
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            category: formData.category || null,
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
            sku: formData.sku || null,
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            category: formData.category || null,
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removeImage() {
    setFormData({ ...formData, image_url: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const categories = [...new Set(parts.map(p => p.category).filter((c): c is string => c !== null && c !== ''))]

  const filteredParts = parts.filter(part => {
    const matchesSearch = !searchTerm || 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.sku && part.sku.toLowerCase().includes(searchTerm.toLowerCase()))
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
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
  {part.image_url ? (
    <img src={part.image_url} alt={part.name} className="w-14 h-14 rounded-lg object-cover" />
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
                        ) : <span>-</span>}
                      </td>
                      <td className="py-4 px-6 text-center font-medium">{part.in_stock} {part.unit}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                          {part.committed}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900">{available} {part.unit}</td>
                      <td className="py-4 px-6 text-center">
                        {status === 'out' && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Out of Stock</span>
                        )}
                        {status === 'low' && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Low Stock</span>
                        )}
                        {status === 'ok' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">In Stock</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => openEditModal(part)}
                          className="text-teal-600 hover:text-teal-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePart(part.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPart ? 'Edit Part' : 'Add New Part'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., RAM Stick 8GB DDR4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., RAM-8GB-DDR4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., Memory"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={2}
                    placeholder="Optional description..."
                  />
                </div>

                {/* Image Upload Section */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part Image</label>
                  
                  {formData.image_url ? (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={formData.image_url} 
                          alt="Part preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 truncate mb-2">{formData.image_url.split('/').pop()}</p>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl mb-2">📷</div>
                          <p className="text-sm text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">In Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.in_stock}
                    onChange={(e) => setFormData({...formData, in_stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_threshold}
                    onChange={(e) => setFormData({...formData, min_threshold: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="m">Meters (m)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="L">Liters (L)</option>
                    <option value="mL">Milliliters (mL)</option>
                    <option value="box">Boxes</option>
                    <option value="set">Sets</option>
                  </select>
                </div>
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
                onClick={savePart}
                disabled={uploading}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {editingPart ? 'Update Part' : 'Add Part'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
