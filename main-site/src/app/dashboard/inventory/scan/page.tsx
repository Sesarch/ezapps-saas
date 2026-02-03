'use client'
export const dynamic = 'force-dynamic'
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
  cost: number
  supplier?: { name: string } | null
}

interface BomItem {
  product_title: string
  variant_title: string | null
  quantity_needed: number
}

export default function ScanPage() {
  const [searchValue, setSearchValue] = useState('')
  const [part, setPart] = useState<Part | null>(null)
  const [bomItems, setBomItems] = useState<BomItem[]>([])
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [adjusting, setAdjusting] = useState(false)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [recentScans, setRecentScans] = useState<Part[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchStore()
    // Focus input on load
    inputRef.current?.focus()
  }, [])

  // Check URL for part ID (from QR code link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const partId = params.get('part')
    if (partId && storeId) {
      searchPart(partId)
    }
  }, [storeId])

  async function fetchStore() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: stores } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    if (stores && stores.length > 0) {
      setStoreId(stores[0].id)
    }
  }

  async function searchPart(query: string) {
    if (!storeId || !query.trim()) return

    setLoading(true)
    setNotFound(false)
    setPart(null)
    setBomItems([])

    // Search by ID, SKU, or name
    const { data, error } = await supabase
      .from('parts')
      .select('*, supplier:suppliers(name)')
      .eq('store_id', storeId)
      .or(`id.eq.${query},sku.ilike.%${query}%,name.ilike.%${query}%`)
      .limit(1)
      .single()

    if (error || !data) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setPart(data)
    
    // Add to recent scans (keep last 5)
    setRecentScans(prev => {
      const filtered = prev.filter(p => p.id !== data.id)
      return [data, ...filtered].slice(0, 5)
    })

    // Fetch BOM items for this part
    const { data: bom } = await supabase
      .from('bom_items')
      .select('product_title, variant_title, quantity_needed')
      .eq('part_id', data.id)

    setBomItems(bom || [])
    setLoading(false)
    setSearchValue('')
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchValue(value)

    // USB scanner typically adds Enter at the end, or we detect rapid input
    // For manual typing, user will press Enter or click search
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchPart(searchValue)
    }
  }

  async function adjustStock(amount: number) {
    if (!part) return

    const newStock = Math.max(0, part.in_stock + amount)
    
    const { error } = await supabase
      .from('parts')
      .update({ in_stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', part.id)

    if (!error) {
      setPart({ ...part, in_stock: newStock })
      setAdjusting(false)
      setAdjustAmount(0)
    }
  }

  async function startCamera() {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
      alert('Could not access camera. Please use manual search or USB scanner.')
      setShowCamera(false)
    }
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    setShowCamera(false)
  }

  const available = part ? part.in_stock - part.committed : 0
  const status = part ? (
    part.in_stock === 0 ? 'out' : 
    part.in_stock <= part.min_threshold ? 'low' : 'ok'
  ) : null

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scan Parts</h1>
        <p className="text-gray-600 mt-1">Scan QR code, use USB scanner, or search manually</p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xl">🔍</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search or scan part ID, SKU, or name..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <button
            onClick={() => searchPart(searchValue)}
            disabled={!searchValue.trim() || loading}
            className="px-6 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={showCamera ? stopCamera : startCamera}
            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
          >
            📷 {showCamera ? 'Close' : 'Camera'}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          💡 Tip: USB barcode scanners work automatically - just scan and it searches!
        </p>
      </div>

      {/* Camera View */}
      {showCamera && (
        <div className="bg-black rounded-2xl overflow-hidden mb-6 relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white/50 rounded-lg"></div>
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            Position QR code in the frame
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      )}

      {/* Not Found */}
      {notFound && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Part not found</h3>
          <p className="text-gray-500">Try a different search term or scan another QR code</p>
        </div>
      )}

      {/* Part Found */}
      {part && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Part Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {part.image_url ? (
                  <img src={part.image_url} alt={part.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🔧</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{part.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  {part.sku && (
                    <span className="text-sm text-gray-500">SKU: {part.sku}</span>
                  )}
                  {part.category && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{part.category}</span>
                  )}
                  {status === 'out' && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Out of Stock</span>
                  )}
                  {status === 'low' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Low Stock</span>
                  )}
                  {status === 'ok' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">In Stock</span>
                  )}
                </div>
                {part.description && (
                  <p className="text-gray-600 mt-2">{part.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 divide-x divide-gray-100 bg-gray-50">
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{part.in_stock}</p>
              <p className="text-xs text-gray-400">{part.unit}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Committed</p>
              <p className="text-2xl font-bold text-red-600">{part.committed}</p>
              <p className="text-xs text-gray-400">{part.unit}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Available</p>
              <p className={`text-2xl font-bold ${available < 0 ? 'text-red-600' : 'text-green-600'}`}>{available}</p>
              <p className="text-xs text-gray-400">{part.unit}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Unit Cost</p>
              <p className="text-2xl font-bold text-gray-900">${(part.cost || 0).toFixed(2)}</p>
              <p className="text-xs text-gray-400">per {part.unit}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
            
            {!adjusting ? (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setAdjusting(true)}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
                >
                  📦 Adjust Stock
                </button>
                <button
                  onClick={() => adjustStock(1)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                >
                  ➕ Add 1
                </button>
                <button
                  onClick={() => adjustStock(-1)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  ➖ Remove 1
                </button>
                <a
                  href={`/dashboard/parts`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  ✏️ Edit Part
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAdjustAmount(a => a - 10)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  -10
                </button>
                <button
                  onClick={() => setAdjustAmount(a => a - 1)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  -1
                </button>
                <div className="px-6 py-2 bg-gray-100 rounded-lg text-center min-w-[100px]">
                  <span className={`text-xl font-bold ${adjustAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustAmount >= 0 ? '+' : ''}{adjustAmount}
                  </span>
                </div>
                <button
                  onClick={() => setAdjustAmount(a => a + 1)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  +1
                </button>
                <button
                  onClick={() => setAdjustAmount(a => a + 10)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  +10
                </button>
                <button
                  onClick={() => adjustStock(adjustAmount)}
                  disabled={adjustAmount === 0}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium disabled:opacity-50"
                >
                  Apply
                </button>
                <button
                  onClick={() => { setAdjusting(false); setAdjustAmount(0) }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* BOM Info */}
          {bomItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-blue-50">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">Used in Products ({bomItems.length})</h3>
              <div className="space-y-2">
                {bomItems.map((bom, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-blue-900">
                      {bom.product_title}
                      {bom.variant_title && bom.variant_title !== 'Default Title' && (
                        <span className="text-blue-600"> - {bom.variant_title}</span>
                      )}
                    </span>
                    <span className="text-blue-700 font-medium">×{bom.quantity_needed}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supplier Info */}
          {part.supplier && (
            <div className="p-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Supplier</h3>
              <p className="text-gray-900">{part.supplier.name}</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Scans */}
      {recentScans.length > 0 && !part && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Scans</h3>
          <div className="space-y-3">
            {recentScans.map(p => (
              <button
                key={p.id}
                onClick={() => searchPart(p.id)}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🔧</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.sku || 'No SKU'} • {p.in_stock} in stock</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
