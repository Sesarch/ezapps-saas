'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Item {
  id: string
  name: string
  sku: string | null
  type: 'part' | 'component' | 'assembly'
  quantity: number
  unit: string
  description?: string
}

interface BomItem {
  id: string
  shopify_product_id: string
  shopify_variant_id: string
  product_title: string
  variant_title: string | null
  item_id: string
  quantity_needed: number
  item?: Item
}

interface Product {
  id: string
  title: string
  variants: { id: string; title: string }[]
  image?: { src: string }
}

interface Store {
  id: string
  store_url: string
  access_token: string
}

export default function BomPage() {
  const [bomItems, setBomItems] = useState<BomItem[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const supabase = createClient()

  useEffect(() => {
    fetchStore()
  }, [])

  useEffect(() => {
    if (store) {
      fetchItems()
      fetchBomItems()
      fetchProducts()
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

  async function fetchItems() {
    if (!store) return
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('store_id', store.id)
      .order('name')
    setItems(data || [])
  }

  async function fetchBomItems() {
    if (!store) return
    try {
      const { data, error } = await supabase
        .from('bom_items')
        .select('*, item:items(*)')
        .eq('store_id', store.id)

      if (error) throw error
      setBomItems(data || [])
    } catch (err) {
      console.error('Error fetching BOM:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProducts() {
    if (!store) return
    try {
      const response = await fetch(`/api/shopify/products?storeId=${store.id}`)
      const data = await response.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  async function addBomItem() {
    if (!store || !selectedProduct || !selectedVariant || !selectedItem) {
      alert('Please select product, variant, and item')
      return
    }

    const product = products.find(p => p.id.toString() === selectedProduct)
    const variant = product?.variants.find(v => v.id.toString() === selectedVariant)

    try {
      const { error } = await supabase
        .from('bom_items')
        .insert({
          store_id: store.id,
          shopify_product_id: selectedProduct,
          shopify_variant_id: selectedVariant,
          product_title: product?.title || '',
          variant_title: variant?.title || null,
          item_id: selectedItem,
          quantity_needed: quantity
        })

      if (error) throw error
      closeModal()
      fetchBomItems()
    } catch (err) {
      console.error('Error adding BOM item:', err)
      alert('Failed to add BOM item. It may already exist.')
    }
  }

  async function deleteBomItem(id: string) {
    if (!confirm('Remove this part from the BOM?')) return
    try {
      await supabase.from('bom_items').delete().eq('id', id)
      fetchBomItems()
    } catch (err) {
      console.error('Error deleting BOM item:', err)
    }
  }

  function openModal() {
    setSelectedProduct('')
    setSelectedVariant('')
    setSelectedItem('')
    setQuantity(1)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
  }

  const selectedProductData = products.find(p => p.id.toString() === selectedProduct)

  // Group BOM items by product/variant
  const groupedBom = bomItems.reduce((acc, item) => {
    const key = `${item.shopify_product_id}-${item.shopify_variant_id}`
    if (!acc[key]) {
      acc[key] = {
        product_title: item.product_title,
        variant_title: item.variant_title,
        items: []
      }
    }
    acc[key].items.push(item)
    return acc
  }, {} as Record<string, { product_title: string; variant_title: string | null; items: BomItem[] }>)

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
        <h1 className="text-3xl font-bold text-gray-900">Bill of Materials</h1>
        <p className="text-gray-600 mt-1">Define which parts are needed to build each product variant</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products with BOM</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{Object.keys(groupedBom).length}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total BOM Entries</p>
              <p className="text-3xl font-bold text-teal-600 mt-1">{bomItems.length}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Items</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{items.length}</p>
            </div>
            <div className="text-3xl">🔧</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Link items to your Shopify products</p>
          <button
            onClick={openModal}
            disabled={items.length === 0}
            className="flex items-center px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">+</span> Add BOM Entry
          </button>
        </div>
        {items.length === 0 && (
          <p className="text-yellow-600 text-sm mt-2">
            ⚠️ Add items first before creating BOM. <a href="/dashboard/items" className="underline">Go to Items</a>
          </p>
        )}
      </div>

      {/* BOM List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : Object.keys(groupedBom).length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No BOM entries yet</h3>
            <p className="text-gray-500 mb-4">Start by linking items to your products</p>
          </div>
        ) : (
          Object.entries(groupedBom).map(([key, group]) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{group.product_title}</h3>
                {group.variant_title && group.variant_title !== 'Default Title' && (
                  <p className="text-sm text-gray-500">Variant: {group.variant_title}</p>
                )}
              </div>
              <div className="divide-y divide-gray-100">
                {group.items.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        {item.item?.type === 'part' ? '🔧' : item.item?.type === 'component' ? '⚙️' : '📦'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.item?.name || 'Unknown Item'}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>SKU: {item.item?.sku || '-'}</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium capitalize">
                            {item.item?.type || 'unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Qty Needed</p>
                        <p className="font-bold text-gray-900">{item.quantity_needed}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">In Stock</p>
                        <p className={`font-bold ${(item.item?.quantity || 0) < item.quantity_needed ? 'text-red-600' : 'text-green-600'}`}>
                          {item.item?.quantity || 0}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteBomItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Total items: {group.items.length} | 
                  Total cost: <span className="font-medium">Calculate from supplier prices</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add BOM Entry</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value)
                    setSelectedVariant('')
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a product...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.title}</option>
                  ))}
                </select>
              </div>

              {selectedProductData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variant *</label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select a variant...</option>
                    {selectedProductData.variants.map(variant => (
                      <option key={variant.id} value={variant.id}>{variant.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item *</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select an item...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.type}) - {item.quantity} in stock
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Needed *</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
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
                onClick={addBomItem}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Add to BOM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
