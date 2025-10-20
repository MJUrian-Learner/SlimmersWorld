"use client";

import { Suspense } from "react";
import { useTrackPageVisit } from "@/lib/hooks/useTrackPageVisit";

function PageVisitTrackerContent() {
  useTrackPageVisit();
  return null;
}

export function PageVisitTracker() {
  return (
    <Suspense fallback={null}>
      <PageVisitTrackerContent />
    </Suspense>
  );
}
