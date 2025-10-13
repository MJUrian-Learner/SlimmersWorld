"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SlimmersLogo } from "@/components/slimmers-logo"
import { useRouter } from "next/navigation"
import { Calculator, QrCode, User, LogOut, Dumbbell } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    const loadUser = async () => {
      try {
        // const {
        //   data: { user },
        // } = await supabase.auth.getUser()
        // if (!user) {
          // router.push("/login")
        //   return
        // }
        if (isMounted) setUser(user.user_metadata || { name: user.email })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadUser()
    return () => {
      isMounted = false
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (isLoading) return null
  if (!user) return null

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <SlimmersLogo />
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-border bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground flex items-center">
                <User className="w-5 h-5 mr-2" />
                Welcome, {user.name}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Ready to start your fitness journey?</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6 space-y-3">
              <Button onClick={() => router.push("/bmi-calculator")} className="w-full bg-primary hover:bg-primary/90">
                <Calculator className="w-5 h-5 mr-2" />
                BMI Calculator
              </Button>

              <Button onClick={() => router.push("/equipments")} variant="outline" className="w-full border-border">
                <Dumbbell className="w-5 h-5 mr-2" />
                Browse Equipment
              </Button>

              <Button onClick={() => router.push("/qr-scanner")} variant="outline" className="w-full border-border">
                <QrCode className="w-5 h-5 mr-2" />
                Scan Equipment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
