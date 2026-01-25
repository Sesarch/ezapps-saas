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

interface ProductGroup {
  product_id: string
  variant_id: string
  product_title: string
  variant_title: string | null
  items: BomItem[]
}

export default function EnhancedBomPage() {
  const [bomItems, setBomItems] = useState<BomItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<ProductGroup | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchBomItems()
  }, [])

  async function fetchBomItems() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
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

      if (error) throw error
      setBomItems(data || [])
    } catch (err) {
      console.error('Error fetching BOM:', err)
    } finally {
      setLoading(false)
    }
  }

  // Group BOM items by product/variant
  const productGroups: ProductGroup[] = Object.values(
    bomItems.reduce((acc, item) => {
      const key = `${item.shopify_product_id}-${item.shopify_variant_id}`
      if (!acc[key]) {
        acc[key] = {
          product_id: item.shopify_product_id,
          variant_id: item.shopify_variant_id,
          product_title: item.product_title,
          variant_title: item.variant_title,
          items: []
        }
      }
      acc[key].items.push(item)
      return acc
    }, {} as Record<string, ProductGroup>)
  )

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

  const uniqueProducts = productGroups.length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bill of Materials</h1>
        <p className="text-gray-600 mt-1">Click any product to manage its BOM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products with BOM</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{uniqueProducts}</p>
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
              <p className="text-sm text-gray-500">Avg Items per Product</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {uniqueProducts > 0 ? (bomItems.length / uniqueProducts).toFixed(1) : 0}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading BOMs...</p>
          </div>
        ) : productGroups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No BOM entries yet</h3>
            <p className="text-gray-500 mb-4">Start by adding items to your products</p>
            <p className="text-sm text-gray-400">
              💡 Tip: Click any product to open its BOM panel
            </p>
          </div>
        ) : (
          productGroups.map((group) => {
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
          })
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
            fetchBomItems()
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}
