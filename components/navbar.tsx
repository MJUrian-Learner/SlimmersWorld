"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const onLogout = () => {
    console.log("Logout");
  };

  return (
    <nav className="w-full bg-card border-b border-border sticky top-0 z-50">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-foreground tracking-tight">
            SLIMMERS WORLD
          </div>
          <Button onClick={onLogout} variant="ghost" size="sm">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </nav>
  );
}
