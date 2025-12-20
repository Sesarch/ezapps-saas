'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Part {
  id: string
  sku: string | null
  name: string
  category: string | null
  in_stock: number
  unit: string
  image_url: string | null
}

interface Store {
  id: string
  store_url: string
}

export default function QRScannerPage() {
  const { user } = useAuth()
  const supabase = createClient()
  
  // Store & Parts
  const [store, setStore] = useState<Store | null>(null)
  const [parts, setParts] = useState<Part[]>([])
  const [loadingParts, setLoadingParts] = useState(true)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'create' | 'scan'>('create')
  
  // Create tab state
  const [selectedPartId, setSelectedPartId] = useState('')
  const [partLocation, setPartLocation] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  
  // Scan tab state
  const [scanning, setScanning] = useState(false)
  const [scannedPart, setScannedPart] = useState<Part | null>(null)
  const [scannedLocation, setScannedLocation] = useState('')
  const [scanQty, setScanQty] = useState(1)
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('remove')
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [logging, setLogging] = useState(false)
  
  // Scanner ref
  const html5QrCodeRef = useRef<any>(null)
  const scannerScriptLoaded = useRef(false)

  // Load store and parts on mount
  useEffect(() => {
    fetchStore()
  }, [])

  useEffect(() => {
    if (store) {
      fetchParts()
    }
  }, [store])

  // Load scanner script on mount
  useEffect(() => {
    if (!scannerScriptLoaded.current) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
      script.async = true
      script.onload = () => {
        scannerScriptLoaded.current = true
      }
      document.head.appendChild(script)
    }
  }, [])

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
      }
    } catch (err) {
      console.error('Error fetching store:', err)
    }
  }

  async function fetchParts() {
    if (!store) return
    
    try {
      setLoadingParts(true)
      const { data, error } = await supabase
        .from('parts')
        .select('id, sku, name, category, in_stock, unit, image_url')
        .eq('store_id', store.id)
        .order('name')

      if (error) throw error
      setParts(data || [])
    } catch (err) {
      console.error('Error fetching parts:', err)
    } finally {
      setLoadingParts(false)
    }
  }

  // Generate QR Code for selected part
  const generateQR = () => {
    if (!selectedPartId) {
      alert('Please select a part')
      return
    }

    const part = parts.find(p => p.id === selectedPartId)
    if (!part) return

    setSelectedPart(part)

    const qrData = JSON.stringify({ 
      id: part.id,
      name: part.name,
      sku: part.sku,
      loc: partLocation 
    })

    // Use QR Server API to generate QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`
    
    setQrImageUrl(qrUrl)
    setQrGenerated(true)
  }

  // Print QR
  const printQR = () => {
    if (!qrImageUrl || !selectedPart) return
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print QR - ${selectedPart.name}</title></head>
          <body style="text-align:center;margin-top:50px;font-family:Arial,sans-serif;">
            <img src="${qrImageUrl}" style="width:200px;height:200px;">
            <div style="margin-top:20px;font-size:18px;font-weight:bold;">${selectedPart.name}</div>
            ${selectedPart.sku ? `<div style="margin-top:5px;color:#666;">SKU: ${selectedPart.sku}</div>` : ''}
            ${partLocation ? `<div style="margin-top:5px;color:#666;">📍 ${partLocation}</div>` : ''}
            <script>setTimeout(() => { window.print(); window.close(); }, 500)<\/script>
          </body>
        </html>
      `)
    }
  }

  // Reset create form
  const resetCreate = () => {
    setSelectedPartId('')
    setPartLocation('')
    setQrGenerated(false)
    setQrImageUrl('')
    setSelectedPart(null)
  }

  // Start Scanner
  const startScanner = async () => {
    const readerDiv = document.getElementById('qr-reader')
    if (!readerDiv) return

    if (typeof (window as any).Html5Qrcode === 'undefined') {
      alert('Scanner is loading, please wait a moment and try again...')
      return
    }

    try {
      html5QrCodeRef.current = new (window as any).Html5Qrcode('qr-reader')
      
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        async (decodedText: string) => {
          if (navigator.vibrate) navigator.vibrate(100)
          stopScanner()
          
          let qrData
          try {
            qrData = JSON.parse(decodedText)
          } catch {
            qrData = { name: decodedText }
          }
          
          // Look up part in database
          if (qrData.id) {
            const part = parts.find(p => p.id === qrData.id)
            if (part) {
              setScannedPart(part)
              setScannedLocation(qrData.loc || '')
              setScanQty(1)
              return
            }
          }
          
          // Fallback: show what was scanned
          setScannedPart({
            id: qrData.id || '',
            name: qrData.name || decodedText,
            sku: qrData.sku || null,
            category: null,
            in_stock: 0,
            unit: 'pcs',
            image_url: null
          })
          setScannedLocation(qrData.loc || '')
          setScanQty(1)
        },
        () => {}
      )
      
      setScanning(true)
    } catch (err: any) {
      console.error('Scanner error:', err)
      alert('Camera access denied or error: ' + err.message)
    }
  }

  // Stop Scanner
  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear()
        setScanning(false)
      }).catch(console.error)
    }
  }

  // Update inventory
  const updateInventory = async () => {
    if (!scannedPart || !scannedPart.id) {
      alert('Part not found in inventory')
      return
    }

    setLogging(true)

    try {
      // Calculate new stock
      const currentStock = scannedPart.in_stock || 0
      const newStock = adjustmentType === 'add' 
        ? currentStock + scanQty 
        : Math.max(0, currentStock - scanQty)

      // Update in database
      const { error } = await supabase
        .from('parts')
        .update({ 
          in_stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', scannedPart.id)

      if (error) throw error

      // Add to history
      setScanHistory(prev => [{
        name: scannedPart.name,
        qty: scanQty,
        type: adjustmentType,
        oldStock: currentStock,
        newStock: newStock,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10))

      // Refresh parts list
      fetchParts()

      // Reset
      setScannedPart(null)
      setScannedLocation('')

    } catch (err: any) {
      console.error('Update error:', err)
      alert('Failed to update inventory: ' + err.message)
    }

    setLogging(false)
  }

  // No store connected
  if (!store && !loadingParts) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">QR Scanner</h1>
          <p className="text-gray-600 mt-1">Create QR labels and scan inventory</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No store connected</h3>
          <p className="text-gray-600 mb-6">Connect a store first to use QR Scanner</p>
          <a href="/dashboard/stores" className="inline-block px-6 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors">
            Connect Store
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">QR Scanner</h1>
        <p className="text-gray-600 mt-1">Create QR labels and scan parts inventory</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('create'); if (scanning) stopScanner(); }}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'create'
              ? 'bg-teal-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          ➕ Create Label
        </button>
        <button
          onClick={() => setActiveTab('scan')}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'scan'
              ? 'bg-teal-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          📷 Scan
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="max-w-md">
            {/* Part Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Part *
              </label>
              {loadingParts ? (
                <div className="text-gray-500">Loading parts...</div>
              ) : parts.length === 0 ? (
                <div className="text-gray-500">
                  No parts found. <a href="/dashboard/parts" className="text-teal-600 hover:underline">Add parts first</a>
                </div>
              ) : (
                <select
                  value={selectedPartId}
                  onChange={(e) => {
                    setSelectedPartId(e.target.value)
                    setQrGenerated(false)
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Select a part --</option>
                  {parts.map(part => (
                    <option key={part.id} value={part.id}>
                      {part.name} {part.sku ? `(${part.sku})` : ''} - {part.in_stock} {part.unit}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={partLocation}
                onChange={(e) => setPartLocation(e.target.value)}
                placeholder="e.g. Shelf A-1, Bin 23"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQR}
              disabled={!selectedPartId}
              className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate QR Code
            </button>

            {/* QR Preview */}
            {qrGenerated && selectedPart && (
              <div className="border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-green-600 font-medium mb-4">✓ QR Code Ready</div>
                <div className="inline-block bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
                  <img src={qrImageUrl} alt="QR Code" className="w-[180px] h-[180px]" />
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
                    <div className="font-bold text-gray-900">{selectedPart.name}</div>
                    {selectedPart.sku && <div className="text-sm text-gray-500">SKU: {selectedPart.sku}</div>}
                    {partLocation && <div className="text-sm text-gray-500">📍 {partLocation}</div>}
                    <div className="text-sm text-teal-600 mt-1">Stock: {selectedPart.in_stock} {selectedPart.unit}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={printQR}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    🖨️ Print
                  </button>
                  <button
                    onClick={resetCreate}
                    className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors"
                  >
                    ✨ New Label
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scan Tab */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanner</h3>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ minHeight: '280px' }}>
              <div id="qr-reader" style={{ width: '100%' }} />
              {!scanning && (
                <div className="flex flex-col items-center justify-center h-[280px] text-gray-400">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" strokeWidth={1} />
                  </svg>
                  <span>Tap Start to scan QR code</span>
                </div>
              )}
            </div>

            <button
              onClick={scanning ? stopScanner : startScanner}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                scanning
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {scanning ? '⏹️ Stop Scanner' : '▶️ Start Scanner'}
            </button>

            {/* Scanned Result */}
            {scannedPart && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-green-600 text-sm font-medium mb-1">SCANNED</div>
                <div className="text-xl font-bold text-green-700 mb-1">{scannedPart.name}</div>
                {scannedPart.sku && (
                  <div className="text-gray-600 text-sm">SKU: {scannedPart.sku}</div>
                )}
                {scannedLocation && (
                  <div className="text-gray-600 text-sm">📍 {scannedLocation}</div>
                )}
                <div className="text-teal-600 text-sm font-medium mt-1">
                  Current Stock: {scannedPart.in_stock} {scannedPart.unit}
                </div>
                
                <div className="border-t border-green-200 pt-3 mt-3">
                  {/* Adjustment Type */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setAdjustmentType('remove')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        adjustmentType === 'remove'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      ➖ Remove
                    </button>
                    <button
                      onClick={() => setAdjustmentType('add')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        adjustmentType === 'add'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      ➕ Add
                    </button>
                  </div>

                  <label className="block text-sm text-gray-600 mb-2">Quantity</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="number"
                      value={scanQty}
                      onChange={(e) => setScanQty(parseInt(e.target.value) || 1)}
                      min={1}
                      className="w-full px-4 py-3 text-xl text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <button
                      onClick={updateInventory}
                      disabled={logging || !scannedPart.id}
                      className={`w-full px-6 py-3 text-white rounded-xl font-medium disabled:opacity-50 ${
                        adjustmentType === 'remove'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {logging ? 'Updating...' : `${adjustmentType === 'remove' ? 'Remove' : 'Add'} ${scanQty} ${scannedPart.unit}`}
                    </button>
                  </div>
                  
                  {/* Preview new stock */}
                  <div className="text-center text-sm text-gray-500 mt-2">
                    New stock will be: {adjustmentType === 'add' 
                      ? scannedPart.in_stock + scanQty 
                      : Math.max(0, scannedPart.in_stock - scanQty)} {scannedPart.unit}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scan History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Adjustments</h3>
            
            {scanHistory.length > 0 ? (
              <div className="space-y-2">
                {scanHistory.map((scan, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{scan.name}</div>
                      <div className="text-sm text-gray-500">
                        {scan.type === 'remove' ? '➖' : '➕'} {scan.qty} • {scan.oldStock} → {scan.newStock}
                      </div>
                      <div className="text-xs text-gray-400">{scan.time}</div>
                    </div>
                    <div className={scan.type === 'remove' ? 'text-red-500' : 'text-green-500'}>
                      {scan.type === 'remove' ? '−' : '+'}{scan.qty}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📦</div>
                <p>No adjustments yet</p>
                <p className="text-sm mt-1">Scan a QR code to update inventory</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
