"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, CameraOff, AlertCircle, Loader2, Shield } from "lucide-react"
import QrScanner from "qr-scanner"

interface QRScannerProps {
  onScan: (result: string) => void
  isActive: boolean
}

export function QRScanner({ onScan, isActive }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrScannerRef = useRef<QrScanner | null>(null)
  const [error, setError] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown")
  const [isHttps, setIsHttps] = useState(true)

  useEffect(() => {
    // Check if we're on HTTPS
    setIsHttps(window.location.protocol === 'https:' || window.location.hostname === 'localhost')
    
    // Check camera permission on component mount
    checkCameraPermission()
  }, [])

  useEffect(() => {
    console.log("QR Scanner isActive changed:", isActive)
    if (isActive) {
      // Start camera when isActive becomes true with a small delay
      setTimeout(() => {
        startQRScanner()
      }, 100)
    } else if (qrScannerRef.current) {
      // Stop camera when isActive becomes false
      stopQRScanner()
    }

    return () => {
      if (qrScannerRef.current) {
        stopQRScanner()
      }
    }
  }, [isActive])

  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
        setCameraPermission(permission.state)
        
        permission.onchange = () => {
          setCameraPermission(permission.state)
        }
      } else {
        // Fallback for browsers that don't support permissions API
        setCameraPermission("unknown")
      }
    } catch (error) {
      console.log("Permission API not supported")
      setCameraPermission("unknown")
    }
  }

  const startQRScanner = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Check HTTPS requirement
      if (!isHttps) {
        setError("Camera access requires HTTPS. Please use a secure connection.")
        setIsLoading(false)
        return
      }
      
      // Check if camera is available first
      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        setError("No camera found on this device")
        setIsLoading(false)
        return
      }

      // Wait for video element to be available
      if (!videoRef.current) {
        setError("Video element not ready. Please try again.")
        setIsLoading(false)
        return
      }

      // Stop any existing scanner
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
        qrScannerRef.current = null
      }

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          if (!hasScanned) {
            setHasScanned(true)
            setIsScanning(false)
            onScan(result.data)
          }
        },
        {
          onDecodeError: (error) => {
            // Only log errors if not actively scanning
            if (error && typeof error === 'string' && !error.includes("No QR code found")) {
              console.debug("QR decode error:", error)
            }
          },
          preferredCamera: "environment", // Use back camera on mobile
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
        }
      )

      await qrScannerRef.current.start()
      setIsScanning(true)
      setIsLoading(false)
      setError("")
      setCameraPermission("granted")
    } catch (err) {
      console.error("QR Scanner error:", err)
      setIsLoading(false)
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError("Camera access denied. Please allow camera permission in your browser settings and try again.")
          setCameraPermission("denied")
        } else if (err.name === 'NotFoundError') {
          setError("No camera found on this device. Please check if your device has a camera.")
        } else if (err.name === 'NotReadableError') {
          setError("Camera is already in use by another application. Please close other camera apps and try again.")
        } else if (err.name === 'OverconstrainedError') {
          setError("Camera constraints could not be satisfied. Please try again.")
        } else if (err.name === 'SecurityError') {
          setError("Camera access blocked for security reasons. Please ensure you're using HTTPS.")
        } else {
          setError(`Camera access failed: ${err.message}. Please try again.`)
        }
      } else {
        setError("Camera access denied or not available. Please check your browser permissions.")
      }
    }
  }

  const stopQRScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }
    setIsScanning(false)
  }

  const resetScanner = () => {
    setHasScanned(false)
    setError("")
    if (qrScannerRef.current && videoRef.current) {
      qrScannerRef.current.start()
      setIsScanning(true)
    } else {
      // Start the QR scanner - this will handle both first-time activation and restart
      startQRScanner()
    }
  }

  const requestCameraAccess = () => {
    setError("")
    startQRScanner()
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
          {/* Always render video element so ref is available */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${!isActive || error ? 'hidden' : ''}`} 
          />
          
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center absolute inset-0">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Starting camera...</p>
              </div>
            </div>
          ) : isActive && !error ? (
            <>
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                  {/* Animated scanning line */}
                  {isScanning && !hasScanned && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse"></div>
                  )}
                </div>
              </div>
              {/* Success overlay */}
              {hasScanned && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">QR Code Detected!</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-4">
                {error ? (
                  <>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium mb-2">Camera Error</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    {cameraPermission === "denied" && (
                      <Button
                        onClick={requestCameraAccess}
                        variant="outline"
                        size="sm"
                        className="mb-2"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Allow Camera Access
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <CameraOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Camera not active</p>
                    <p className="text-sm text-muted-foreground">Tap the button below to start scanning</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!hasScanned && !isLoading && (
            <Button
              onClick={resetScanner}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Starting..." : isScanning ? "Scanning..." : "Start Camera"}
            </Button>
          )}

          {hasScanned && (
            <Button
              onClick={resetScanner}
              variant="outline"
              className="w-full border-border bg-transparent"
            >
              <Camera className="w-4 h-4 mr-2" />
              Scan Another Code
            </Button>
          )}

          <p className="text-sm text-muted-foreground text-center">
            {isLoading 
              ? "Initializing camera..." 
              : isScanning 
              ? "Point your camera at the QR code" 
              : error
              ? "Fix the camera issue above to start scanning"
              : "Tap 'Start Camera' to begin scanning QR codes"
            }
          </p>

          {!isHttps && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">HTTPS Required</p>
                  <p className="text-sm text-yellow-700">
                    Camera access requires a secure connection. Please use HTTPS or localhost.
                  </p>
                </div>
              </div>
            </div>
          )}

          {cameraPermission === "denied" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-medium">Camera Access Denied</p>
                  <p className="text-sm text-red-700">
                    Please allow camera permission in your browser settings and refresh the page.
                  </p>
                  <div className="mt-2 text-xs text-red-600">
                    <p><strong>Mobile users:</strong> Tap the camera icon in your browser's address bar to allow camera access.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && !isHttps && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <Camera className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Mobile Camera Tips</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Make sure you're using HTTPS (secure connection)</li>
                    <li>• Allow camera permission when prompted</li>
                    <li>• Close other camera apps before scanning</li>
                    <li>• Try refreshing the page if camera doesn't start</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
