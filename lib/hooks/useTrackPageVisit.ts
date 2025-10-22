"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export function useTrackPageVisit() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Only track if coming from QR code (utm_source=qr_code)
    const utmSource = searchParams.get("utm_source");

    if (utmSource !== "qr_code") {
      return; // Don't track non-QR visits
    }

    // Track QR code scan
    const trackScan = async () => {
      try {
        // Extract exercise information from the path
        // e.g., /exercises/dumbbells/bicep-curl or /exercises/dumbbells
        const pathParts = pathname.split("/").filter(Boolean);

        let exerciseName: string | undefined;
        let equipmentType: string | undefined;

        if (pathParts[0] === "exercises" && pathParts.length >= 2) {
          // Get equipment type
          const equipment = pathParts[1];
          equipmentType = equipment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          // Get exercise name if it exists
          if (pathParts.length >= 3) {
            exerciseName = pathParts[2]
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
        }

        await fetch("/api/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exercisePath: pathname,
            exerciseName,
            equipmentType,
          }),
        });
      } catch (error) {
        // Silently fail - we don't want tracking errors to affect user experience
        console.error("Failed to track QR scan:", error);
      }
    };

    trackScan();
  }, [pathname, searchParams]);
}
