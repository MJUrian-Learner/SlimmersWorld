"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SlimmersLogo } from "@/components/slimmers-logo"
import { QRScanner } from "@/components/qr-scanner"
import { useRouter } from "next/navigation"
import { ArrowLeft, QrCode, CheckCircle, AlertCircle } from "lucide-react"

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string>("")
  const [equipmentInfo, setEquipmentInfo] = useState<any>(null)
  const router = useRouter()

  const handleScan = (result: string) => {
    setScanResult(result)

    // Check if it's a direct equipment URL
    if (result.startsWith("/equipment/")) {
      // Redirect to the equipment page
      router.push(result)
      return
    }

    // Parse the QR code and get equipment info (legacy support)
    const equipmentData = getEquipmentInfo(result)
    setEquipmentInfo(equipmentData)
    setIsScanning(false)
  }

  const getEquipmentInfo = (qrCode: string) => {
    const equipmentDatabase = {
      EQUIPMENT_RACK_001_TREADMILL: {
        id: "RACK_001",
        name: "Treadmill Station",
        type: "Cardio Equipment",
        status: "Available",
        instructions: [
          "Start with a 5-minute warm-up walk",
          "Gradually increase speed as comfortable",
          "Use safety clip at all times",
          "Cool down for 5 minutes after workout",
        ],
        maxTime: "30 minutes",
        difficulty: "Beginner to Advanced",
      },
      EQUIPMENT_RACK_002_WEIGHTS: {
        id: "RACK_002",
        name: "Weight Training Rack",
        type: "Strength Equipment",
        status: "Available",
        instructions: [
          "Always warm up before lifting",
          "Start with lighter weights",
          "Maintain proper form throughout",
          "Re-rack weights after use",
        ],
        maxTime: "45 minutes",
        difficulty: "Intermediate to Advanced",
      },
      EQUIPMENT_RACK_003_CARDIO: {
        id: "RACK_003",
        name: "Cardio Circuit Station",
        type: "Circuit Training",
        status: "Available",
        instructions: [
          "Follow the circuit sequence",
          "Rest 30 seconds between exercises",
          "Complete 3 rounds for best results",
          "Stay hydrated throughout",
        ],
        maxTime: "25 minutes",
        difficulty: "All Levels",
      },
    }

    return (
      equipmentDatabase[qrCode as keyof typeof equipmentDatabase] || {
        id: "UNKNOWN",
        name: "Unknown Equipment",
        type: "Unknown",
        status: "Error",
        instructions: ["QR code not recognized"],
        maxTime: "N/A",
        difficulty: "N/A",
      }
    )
  }

  const startScanning = () => {
    console.log("Start scanning button clicked")
    setIsScanning(true)
    setScanResult("")
    setEquipmentInfo(null)
  }

  const resetScanner = () => {
    setIsScanning(false)
    setScanResult("")
    setEquipmentInfo(null)
  }

  const handleScanError = (error: string) => {
    console.error("QR Scan Error:", error)
    // You could show a toast notification here
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SlimmersLogo />
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-foreground flex items-center justify-center">
                <QrCode className="w-6 h-6 mr-2" />
                Equipment Scanner
              </CardTitle>
            </CardHeader>
          </Card>

          {!equipmentInfo ? (
            <>
              <QRScanner onScan={handleScan} isActive={isScanning} />

              {!isScanning && (
                <div className="space-y-3">
                  <Button onClick={startScanning} className="w-full bg-primary hover:bg-primary/90">
                    📷 Open Camera & Start Scanning
                  </Button>
                  
                  {/* Instructions */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">📱 How to Scan:</h3>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Tap "Open Camera & Start Scanning"</li>
                      <li>2. Allow camera permission when prompted</li>
                      <li>3. Point camera at equipment QR code</li>
                      <li>4. Hold steady until code is detected</li>
                    </ol>
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-800">
                        <strong>Mobile users:</strong> Make sure you're using HTTPS (secure connection) for camera access to work properly.
                      </p>
                    </div>
                  </div>
                  
                  {/* Test QR Codes - Remove in production */}
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">🧪 Test Equipment QR Codes:</p>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleScan("/equipment/dumbbell")}
                        className="w-full text-xs"
                      >
                        Test Dumbbell QR
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleScan("/equipment/kettlebell")}
                        className="w-full text-xs"
                      >
                        Test Kettlebell QR
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleScan("/equipment/ab-roller")}
                        className="w-full text-xs"
                      >
                        Test Ab Roller QR
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      These simulate scanning the actual equipment QR codes
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="bg-card border-border">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {equipmentInfo.status === "Available" ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-foreground">{equipmentInfo.name}</CardTitle>
                <p className="text-muted-foreground">{equipmentInfo.type}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-foreground">Status</div>
                    <div className={equipmentInfo.status === "Available" ? "text-green-600" : "text-red-600"}>
                      {equipmentInfo.status}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Max Time</div>
                    <div className="text-muted-foreground">{equipmentInfo.maxTime}</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Difficulty</div>
                    <div className="text-muted-foreground">{equipmentInfo.difficulty}</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Equipment ID</div>
                    <div className="text-muted-foreground">{equipmentInfo.id}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">Usage Instructions:</h3>
                  <ul className="space-y-2">
                    {equipmentInfo.instructions.map((instruction: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4">
                  <Button onClick={resetScanner} variant="outline" className="w-full border-border bg-transparent">
                    Scan Another Equipment
                  </Button>

                  <Button onClick={() => router.push("/dashboard")} className="w-full bg-primary hover:bg-primary/90">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
