"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    try {
      // Sign out globally to ensure all sessions are cleared
      await supabase.auth.signOut({ scope: "global" });

      // Clear browser history to prevent back button access
      window.history.replaceState(null, "", "/auth/login");

      // Use replace to prevent adding to history stack
      router.replace("/auth/login");

      // Force page reload to clear any cached state
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback - still redirect even if logout fails
      window.location.href = "/auth/login";
    }
    setIsLoading(false);
  };

  return (
    <nav className="w-full bg-card border-b border-border sticky top-0 z-50">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-foreground tracking-tight">
            SLIMMERS WORLD
          </div>
          <Button onClick={onLogout} variant="ghost" size="sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut size={18} />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
