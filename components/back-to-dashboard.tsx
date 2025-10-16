"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackToDashboard = () => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push("/dashboard")}
      className="underline"
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Dashboard
    </Button>
  );
};
