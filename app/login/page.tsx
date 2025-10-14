"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlimmersLogo } from "@/components/slimmers-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    // setIsSubmitting(true)
    // try {
    //   const { error } = await supabase.auth.signInWithPassword({
    //     email: formData.email,
    //     password: formData.password,
    //   })
    //   if (error) throw error
    //   router.push("/dashboard")
    // } catch (err: any) {
    //   setAuthError(err?.message || "Authentication error")
    // } finally {
    //   setIsSubmitting(false)
    // }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SlimmersLogo className="mb-8" />

        <Card className="bg-card border-border">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Login</h2>
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/signup")}
              >
                Sign Up
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
