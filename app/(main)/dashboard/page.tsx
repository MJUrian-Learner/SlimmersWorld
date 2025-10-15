"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, QrCode, Dumbbell, TrendingUp, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      try {
        // const {
        //   data: { user },
        // } = await supabase.auth.getUser()
        // if (!user) {
        // router.push("/login")
        //   return
        // }
        // if (isMounted) setUser(user.user_metadata || { name: user.email });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Welcome Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome, User!
        </h1>
        <p className="text-muted-foreground">
          Ready to start your fitness journey?
        </p>
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        <div
          className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200"
          onClick={() => router.push("/bmi-calculator")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <Calculator size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                BMI Calculator
              </h3>
              <p className="text-sm text-muted-foreground">
                Calculate your body mass index
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200"
          onClick={() => router.push("/equipments")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <Dumbbell size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                Browse Equipment
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore fitness equipment
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200"
          onClick={() => router.push("/qr-scanner")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <QrCode size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                Scan Equipment
              </h3>
              <p className="text-sm text-muted-foreground">
                Scan QR codes for equipment info
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
