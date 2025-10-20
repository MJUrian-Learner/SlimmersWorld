"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export function useTrackPageVisit() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        const utmSource = searchParams.get("utm_source");

        await fetch("/api/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pagePath: pathname,
            utmSource: utmSource,
          }),
        });
      } catch (error) {
        // Silently fail - we don't want tracking errors to affect user experience
        console.error("Failed to track page visit:", error);
      }
    };

    trackVisit();
  }, [pathname, searchParams]);
}
