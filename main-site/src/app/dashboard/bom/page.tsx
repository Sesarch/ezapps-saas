'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductPanel from '@/components/ProductPanel'

interface Item {
  id: string
  name: string
  sku: string | null
  item_type: string
  current_stock: number
}

interface BomItem {
  id: string
  shopify_product_id: string
  shopify_variant_id: string
  product_title: string
  variant_title: string | null
  item_id: string
  quantity_needed: number
  items?: Item
}

interface ShopifyProduct {
  id: string | number
  title: string
  variants: ShopifyVariant[]
}

interface ShopifyVariant {
  id: string | number
  title: string
  inventory_quantity: number
}

interface ProductGroup {
  product_id: string
  variant_id: string
  product_title: string
  variant_title: string | null
  items: BomItem[]
  has_bom: boolean
}

export default function ShopifyBomPageFixed() {
  const [allProducts, setAllProducts] = useState<ProductGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<ProductGroup | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchAllProductsAndBoms()
  }, [])

  // Helper function to extract ID (handles both string GIDs and numbers)
  function extractId(id: string | number): string {
    if (typeof id === 'number') {
      return String(id)
    }
    if (typeof id === 'string' && id.includes('gid://')) {
      return id.split('/').pop() || id
    }
    return String(id)
  }

  async function fetchAllProductsAndBoms() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Get Shopify store
      const { data: platform } = await supabase
        .from('platforms')
        .select('id')
        .eq('slug', 'shopify')
        .single()

      if (!platform) {
        setError('Shopify platform not found')
        setLoading(false)
        return
      }

      const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform_id', platform.id)

      if (!stores || stores.length === 0) {
        setError('No Shopify store connected')
        setLoading(false)
        return
      }

      const store = stores[0]

      // Fetch products from Shopify API
      let shopifyProducts: ShopifyProduct[] = []
      try {
        const response = await fetch(`/api/shopify/products?storeId=${store.id}`)
        const data = await response.json()
        
        if (data.error) {
          console.error('Shopify API error:', data.error)
          setError(data.error)
        } else {
          shopifyProducts = data.products || []
          console.log(`Fetched ${shopifyProducts.length} products from Shopify`)
        }
      } catch (err) {
        console.error('Failed to fetch from Shopify:', err)
        setError('Failed to fetch products from Shopify')
      }

      // Fetch existing BOM items from database
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

      // Create a map of BOM items by product+variant
      const bomMap = new Map<string, BomItem[]>()
      if (bomData) {
        bomData.forEach(item => {
          const productId = extractId(item.shopify_product_id)
          const variantId = extractId(item.shopify_variant_id)
          const key = `${productId}-${variantId}`
          
          if (!bomMap.has(key)) {
            bomMap.set(key, [])
          }
          bomMap.get(key)!.push(item)
        })
        console.log(`Found ${bomData.length} BOM items in database`)
      }

      // Build product groups from Shopify products
      const productGroups: ProductGroup[] = []

      shopifyProducts.forEach(product => {
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach(variant => {
            const productId = extractId(product.id)
            const variantId = extractId(variant.id)
            const key = `${productId}-${variantId}`
            const bomItems = bomMap.get(key) || []
            
            productGroups.push({
              product_id: productId,
              variant_id: variantId,
              product_title: product.title,
              variant_title: variant.title,
              items: bomItems,
              has_bom: bomItems.length > 0
            })
          })
        }
      })

      console.log(`Created ${productGroups.length} product variants`)
      console.log(`${productGroups.filter(p => p.has_bom).length} have BOMs`)
      
      setAllProducts(productGroups)
      setError(null)
    } catch (err) {
      console.error('Error fetching products and BOMs:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  function calculateBuildable(group: ProductGroup): number {
    if (group.items.length === 0) return 0
    
    const quantities = group.items.map(bomItem => {
      const stock = bomItem.items?.current_stock || 0
      const needed = bomItem.quantity_needed
      return Math.floor(stock / needed)
    })
    
    return Math.min(...quantities)
  }

  function getBottleneck(group: ProductGroup): string | null {
    if (group.items.length === 0) return null
    
    let minUnits = Infinity
    let bottleneck = null
    
    group.items.forEach(bomItem => {
      const stock = bomItem.items?.current_stock || 0
      const needed = bomItem.quantity_needed
      const canBuild = Math.floor(stock / needed)
      
      if (canBuild < minUnits) {
        minUnits = canBuild
        bottleneck = bomItem.items?.name || 'Unknown'
      }
    })
    
    return bottleneck
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

  const stats = {
    total: allProducts.length,
    withBom: allProducts.filter(p => p.has_bom).length,
    withoutBom: allProducts.filter(p => !p.has_bom).length,
    totalBomEntries: allProducts.reduce((sum, p) => sum + p.items.length, 0)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bill of Materials</h1>
        <p className="text-gray-600 mt-1">Click any product to manage its BOM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">With BOM</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.withBom}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Need BOM</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.withoutBom}</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total BOM Entries</p>
              <p className="text-3xl font-bold text-teal-600 mt-1">{stats.totalBomEntries}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products from Shopify...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
            <p className="text-gray-500">Please check your Shopify connection in the Stores page.</p>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Your Shopify store doesn't have any products yet.</p>
          </div>
        ) : (
          <>
            {/* Products WITH BOMs */}
            {stats.withBom > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ✅ Products with BOM ({stats.withBom})
                </h2>
                <div className="space-y-4">
                  {allProducts
                    .filter(group => group.has_bom)
                    .map((group) => {
                      const buildable = calculateBuildable(group)
                      const bottleneck = getBottleneck(group)
                      
                      return (
                        <button
                          key={`${group.product_id}-${group.variant_id}`}
                          onClick={() => setSelectedProduct(group)}
                          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-teal-500 transition-all text-left"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="text-3xl">📦</div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">{group.product_title}</h3>
                                  {group.variant_title && group.variant_title !== 'Default Title' && (
                                    <p className="text-sm text-gray-500">Variant: {group.variant_title}</p>
                                  )}
                                </div>
                              </div>

                              {/* BOM Items Preview */}
                              <div className="space-y-2 mb-4">
                                {group.items.slice(0, 3).map(bomItem => (
                                  <div key={bomItem.id} className="flex items-center gap-2 text-sm">
                                    <span className="text-lg">{getItemIcon(bomItem.items?.item_type || '')}</span>
                                    <span className="font-medium">{bomItem.items?.name || 'Unknown'}</span>
                                    <span className="text-gray-400">×</span>
                                    <span className="text-gray-600">{bomItem.quantity_needed}</span>
                                    <span className="text-gray-400 text-xs">
                                      ({bomItem.items?.current_stock || 0} in stock)
                                    </span>
                                  </div>
                                ))}
                                {group.items.length > 3 && (
                                  <p className="text-sm text-gray-400 pl-7">
                                    + {group.items.length - 3} more items
                                  </p>
                                )}
                              </div>

                              {/* Stats Row */}
                              <div className="flex items-center gap-6 text-sm">
                                <div>
                                  <span className="text-gray-500">Total Items:</span>
                                  <span className="font-semibold text-gray-900 ml-2">{group.items.length}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Can Build:</span>
                                  <span className={`font-semibold ml-2 ${buildable > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {buildable} units
                                  </span>
                                </div>
                                {bottleneck && buildable < 100 && (
                                  <div>
                                    <span className="text-gray-500">Bottleneck:</span>
                                    <span className="font-semibold text-orange-600 ml-2">{bottleneck}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-teal-500 text-2xl">
                              →
                            </div>
                          </div>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Products WITHOUT BOMs */}
            {stats.withoutBom > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ⚠️ Products needing BOM ({stats.withoutBom})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allProducts
                    .filter(group => !group.has_bom)
                    .map((group) => (
                      <button
                        key={`${group.product_id}-${group.variant_id}`}
                        onClick={() => setSelectedProduct(group)}
                        className="bg-orange-50 rounded-xl shadow-sm border-2 border-orange-200 p-4 hover:shadow-md hover:border-orange-400 transition-all text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">📦</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{group.product_title}</h3>
                            {group.variant_title && group.variant_title !== 'Default Title' && (
                              <p className="text-xs text-gray-600 truncate">Variant: {group.variant_title}</p>
                            )}
                            <p className="text-xs text-orange-600 font-medium mt-2">
                              ⚠️ Click to add BOM
                            </p>
                          </div>
                          <div className="text-orange-500 text-xl">
                            +
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Panel */}
      {selectedProduct && (
        <ProductPanel
          productId={selectedProduct.product_id}
          variantId={selectedProduct.variant_id}
          productTitle={selectedProduct.product_title}
          variantTitle={selectedProduct.variant_title}
          onClose={() => setSelectedProduct(null)}
          onUpdate={() => {
            fetchAllProductsAndBoms()
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}
