"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect } from "react";

const _AuthContext = createContext({});

export default function AuthContext({ children }: React.PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Check initial auth state
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      await fetch("/api/new-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        // Clear any cached data and redirect
        router.replace("/auth/login");
      }
    });

    // Check auth when page becomes visible (handles browser back button after logout)
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        // Page became visible, check auth status
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/auth/login");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  return <_AuthContext value={{}}>{children}</_AuthContext>;
}
