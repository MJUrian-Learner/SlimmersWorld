"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SlimmersLogo } from "@/components/slimmers-logo"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calculator } from "lucide-react"

export default function BMICalculator() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const router = useRouter()

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!weight || !height) return

    const weightNum = Number.parseFloat(weight)
    const heightNum = Number.parseFloat(height) / 100 // Convert cm to meters
    const bmi = weightNum / (heightNum * heightNum)

    // Store BMI result and navigate to results page
    localStorage.setItem(
      "bmiResult",
      JSON.stringify({
        bmi: bmi.toFixed(1),
        weight: weightNum,
        height: Number.parseFloat(height),
        date: new Date().toISOString(),
      }),
    )

    router.push("/bmi-results")
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

        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center">
              <Calculator className="w-6 h-6 mr-2" />
              BMI Calculator
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-foreground font-medium">
                    Weight
                  </Label>
                  <div className="relative">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-input border-border text-foreground pr-12"
                      required
                      min="1"
                      max="500"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                      kg
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-foreground font-medium">
                    Height
                  </Label>
                  <div className="relative">
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-input border-border text-foreground pr-12"
                      required
                      min="50"
                      max="250"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                      cm
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium"
                disabled={!weight || !height}
              >
                Calculate
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-2">BMI Categories:</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Underweight: Below 18.5</div>
                <div>Normal: 18.5 - 24.9</div>
                <div>Overweight: 25.0 - 29.9</div>
                <div>Obese: 30.0 and above</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
