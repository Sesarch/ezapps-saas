'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Script from 'next/script'

export default function QRScannerPage() {
  const { user } = useAuth()
  const supabase = createClient()
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'create' | 'scan'>('create')
  
  // Script loading state
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const [qrScriptLoaded, setQrScriptLoaded] = useState(false)
  const [scannerScriptLoaded, setScannerScriptLoaded] = useState(false)
  
  // Create tab state
  const [partName, setPartName] = useState('')
  const [partLocation, setPartLocation] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)
  const [currentQRData, setCurrentQRData] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Scan tab state
  const [scanning, setScanning] = useState(false)
  const [scannedPart, setScannedPart] = useState<any>(null)
  const [scanQty, setScanQty] = useState(1)
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [logging, setLogging] = useState(false)
  
  // Refs
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const qrHiddenRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<any>(null)

  // Check if both scripts are loaded
  useEffect(() => {
    if (qrScriptLoaded && scannerScriptLoaded) {
      setScriptsLoaded(true)
    }
  }, [qrScriptLoaded, scannerScriptLoaded])

  // Generate QR Code
  const generateQR = () => {
    if (!partName.trim()) {
      alert('Please enter a part name')
      return
    }

    if (typeof window === 'undefined' || !(window as any).QRCode) {
      alert('QR Code library not loaded yet. Please wait a moment and try again.')
      return
    }

    const qrHidden = qrHiddenRef.current
    if (!qrHidden) return

    qrHidden.innerHTML = ''
    
    const qrData = JSON.stringify({ 
      id: Date.now().toString(), 
      name: partName, 
      loc: partLocation 
    })

    try {
      new (window as any).QRCode(qrHidden, { 
        text: qrData, 
        width: 180, 
        height: 180 
      })

      setTimeout(() => {
        const qrImg = qrHidden.querySelector('canvas') || qrHidden.querySelector('img')
        const canvas = qrCanvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // White background
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, 220, 260)

        // Draw QR
        if (qrImg) {
          if (qrImg.tagName === 'CANVAS') {
            ctx.drawImage(qrImg as HTMLCanvasElement, 20, 15, 180, 180)
          } else {
            const img = new Image()
            img.onload = () => {
              ctx.drawImage(img, 20, 15, 180, 180)
              finishQRDraw(ctx, canvas)
            }
            img.src = (qrImg as HTMLImageElement).src
            return
          }
        }

        finishQRDraw(ctx, canvas)
      }, 300)
    } catch (err) {
      console.error('QR generation error:', err)
      alert('Error generating QR code')
    }
  }

  const finishQRDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Dashed line
    ctx.strokeStyle = '#CCCCCC'
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(20, 205)
    ctx.lineTo(200, 205)
    ctx.stroke()
    ctx.setLineDash([])

    // Part name
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(partName.substring(0, 18), 110, 230)

    // Location
    if (partLocation) {
      ctx.fillStyle = '#666666'
      ctx.font = '12px Arial'
      ctx.fillText(partLocation.substring(0, 22), 110, 250)
    }

    setCurrentQRData(canvas.toDataURL('image/png'))
    setQrGenerated(true)
  }

  // Save QR Label
  const saveLabel = async () => {
    if (!currentQRData || !user) return

    setSaving(true)
    setSaveSuccess(false)

    try {
      // Convert data URL to blob
      const arr = currentQRData.split(',')
      const bstr = atob(arr[1])
      const u8 = new Uint8Array(bstr.length)
      for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i)
      const blob = new Blob([u8], { type: 'image/png' })

      const fileName = `qr_${Date.now()}.png`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('qr-labels')
        .upload(fileName, blob, { contentType: 'image/png', upsert: true })

      if (uploadError) {
        // If bucket doesn't exist, create it
        if (uploadError.message.includes('not found')) {
          console.log('Creating qr-labels bucket...')
        }
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('qr-labels')
        .getPublicUrl(fileName)

      // Save to database
      const { error: dbError } = await supabase
        .from('qr_labels')
        .insert({
          user_id: user.id,
          name: partName,
          location: partLocation,
          image_url: urlData.publicUrl,
          created_at: new Date().toISOString()
        })

      if (dbError) {
        console.log('DB Error (table might not exist):', dbError)
      }

      setSaveSuccess(true)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setPartName('')
        setPartLocation('')
        setQrGenerated(false)
        setCurrentQRData(null)
        setSaveSuccess(false)
      }, 2000)

    } catch (err: any) {
      console.error('Save error:', err)
      alert('Error saving: ' + err.message)
    }

    setSaving(false)
  }

  // Print QR
  const printQR = () => {
    if (!currentQRData) return
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <body style="text-align:center;margin-top:50px;">
            <img src="${currentQRData}" style="max-width:300px;">
            <script>setTimeout(() => { window.print(); window.close(); }, 500)</script>
          </body>
        </html>
      `)
    }
  }

  // Start Scanner
  const startScanner = async () => {
    if (typeof window === 'undefined' || !(window as any).Html5Qrcode) {
      alert('Scanner library not loaded yet. Please wait a moment and try again.')
      return
    }

    const readerDiv = document.getElementById('qr-reader')
    if (!readerDiv) return

    try {
      html5QrCodeRef.current = new (window as any).Html5Qrcode('qr-reader')
      
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText: string) => {
          // On success
          if (navigator.vibrate) navigator.vibrate(100)
          stopScanner()
          
          let part
          try {
            part = JSON.parse(decodedText)
          } catch {
            part = { name: decodedText }
          }
          
          setScannedPart(part)
          setScanQty(1)
        },
        () => {} // Ignore errors (no QR in frame)
      )
      
      setScanning(true)
    } catch (err: any) {
      console.error('Scanner error:', err)
      alert('Camera access denied')
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

  // Log Scan
  const logScan = async () => {
    if (!scannedPart || !user) return

    setLogging(true)

    try {
      // Save to database
      const { error } = await supabase
        .from('qr_scans')
        .insert({
          user_id: user.id,
          part_name: scannedPart.name,
          quantity: scanQty,
          scanned_at: new Date().toISOString()
        })

      if (error) {
        console.log('DB Error (table might not exist):', error)
      }

      // Add to local history
      setScanHistory(prev => [{
        name: scannedPart.name,
        qty: scanQty,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10))

      setScannedPart(null)

    } catch (err: any) {
      console.error('Log error:', err)
    }

    setLogging(false)
  }

  return (
    <>
      {/* Load external scripts */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
        onLoad={() => setQrScriptLoaded(true)}
      />
      <Script 
        src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"
        onLoad={() => setScannerScriptLoaded(true)}
      />
      
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">QR Scanner</h1>
        <p className="text-gray-600 mt-1">Create QR labels and scan inventory</p>
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
            {/* Part Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Name *
              </label>
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="Enter part name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
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
                placeholder="e.g. Shelf A-1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQR}
              className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors mb-6"
            >
              Generate QR Code
            </button>

            {/* QR Preview */}
            {qrGenerated && (
              <div className="border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-green-600 font-medium mb-4">✓ QR Code Ready</div>
                <div className="inline-block border-2 border-gray-200 rounded-lg p-2 mb-4">
                  <canvas ref={qrCanvasRef} width={220} height={260} className="block" />
                </div>
                <div ref={qrHiddenRef} className="hidden" />

                <div className="flex gap-3">
                  <button
                    onClick={printQR}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    🖨️ Print
                  </button>
                  <button
                    onClick={saveLabel}
                    disabled={saving}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      saveSuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    } disabled:opacity-50`}
                  >
                    {saving ? 'Saving...' : saveSuccess ? '✓ Saved!' : '💾 Save'}
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
                {scannedPart.loc && (
                  <div className="text-gray-600 text-sm mb-3">📍 {scannedPart.loc}</div>
                )}
                
                <div className="border-t border-green-200 pt-3 mt-3">
                  <label className="block text-sm text-gray-600 mb-2">Quantity</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={scanQty}
                      onChange={(e) => setScanQty(parseInt(e.target.value) || 1)}
                      min={1}
                      className="flex-1 px-4 py-3 text-xl text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <button
                      onClick={logScan}
                      disabled={logging}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50"
                    >
                      {logging ? '...' : 'Send Request'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scan History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
            
            {scanHistory.length > 0 ? (
              <div className="space-y-2">
                {scanHistory.map((scan, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{scan.name}</div>
                      <div className="text-sm text-gray-500">Qty: {scan.qty} • {scan.time}</div>
                    </div>
                    <div className="text-green-500">✓</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📷</div>
                <p>No scans yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
