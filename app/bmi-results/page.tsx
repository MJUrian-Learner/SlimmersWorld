"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SlimmersLogo } from "@/components/slimmers-logo"
import { useRouter } from "next/navigation"
import { ArrowLeft, QrCode, RotateCcw } from "lucide-react"

interface BMIResult {
  bmi: string
  weight: number
  height: number
  date: string
}

export default function BMIResults() {
  const [bmiData, setBmiData] = useState<BMIResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    const result = localStorage.getItem("bmiResult")
    if (!result) {
      router.push("/bmi-calculator")
      return
    }
    setBmiData(JSON.parse(result))
  }, [router])

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (bmi < 25) return { category: "Normal Weight", color: "text-green-600", bgColor: "bg-green-50" }
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { category: "Obese", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const getHealthTips = (bmi: number) => {
    if (bmi < 18.5) {
      return [
        "Consider increasing caloric intake with nutritious foods",
        "Focus on strength training to build muscle mass",
        "Consult with a nutritionist for a healthy weight gain plan",
      ]
    }
    if (bmi < 25) {
      return [
        "Maintain your current healthy weight",
        "Continue regular exercise and balanced nutrition",
        "Keep up the great work with your fitness routine!",
      ]
    }
    if (bmi < 30) {
      return [
        "Consider a balanced diet with portion control",
        "Increase physical activity to 150+ minutes per week",
        "Focus on cardiovascular and strength training exercises",
      ]
    }
    return [
      "Consult with healthcare professionals for a weight management plan",
      "Start with low-impact exercises and gradually increase intensity",
      "Focus on sustainable lifestyle changes rather than quick fixes",
    ]
  }

  if (!bmiData) return null

  const bmiValue = Number.parseFloat(bmiData.bmi)
  const { category, color, bgColor } = getBMICategory(bmiValue)
  const healthTips = getHealthTips(bmiValue)

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
          {/* BMI Result Card */}
          <Card className="bg-card border-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-foreground">Your BMI Result</CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-primary mb-2">{bmiData.bmi}</div>
                <div className={`inline-block px-4 py-2 rounded-full ${bgColor} ${color} font-medium`}>{category}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium">Weight</div>
                  <div>{bmiData.weight} kg</div>
                </div>
                <div>
                  <div className="font-medium">Height</div>
                  <div>{bmiData.height} cm</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Tips Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Health Recommendations</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {healthTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={() => router.push("/bmi-calculator")} variant="outline" className="w-full border-border">
              <RotateCcw className="w-4 h-4 mr-2" />
              Calculate Again
            </Button>

            <Button onClick={() => router.push("/qr-scanner")} className="w-full bg-primary hover:bg-primary/90">
              <QrCode className="w-4 h-4 mr-2" />
              Scan Equipment to Use
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
