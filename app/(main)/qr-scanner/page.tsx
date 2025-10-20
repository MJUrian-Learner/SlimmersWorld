"use client";

import { BackToDashboard } from "@/components/back-to-dashboard";
import { QRScanner } from "@/components/qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  History,
  PauseCircle,
  PlayCircle,
  QrCode,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

export default function QRScannerPage() {
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleScan = useCallback((value: string) => {
    setCurrentResult(value);
    setHistory((prev) => {
      const next = [value, ...prev.filter((entry) => entry !== value)];
      return next.slice(0, 5); // Keep only five most recent unique results
    });
  }, []);

  const isResultUrl = useMemo(() => {
    if (!currentResult) return false;
    try {
      const url = new URL(currentResult);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
      return false;
    }
  }, [currentResult]);

  const toggleScanner = () => {
    setIsScannerActive((prev) => !prev);
  };

  const clearResult = () => {
    setCurrentResult(null);
    setIsScannerActive(true);
  };

  return (
    <div className="w-full max-w-2xl space-y-6 pb-12">
      <BackToDashboard />

      <Card className="border border-border">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">QR Scanner</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleScanner}
              className="flex items-center gap-2"
            >
              {isScannerActive ? (
                <>
                  <PauseCircle className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  Resume
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Activate your camera and point it at any Slimmers World equipment QR
            code to see quick access links and helpful details.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <QRScanner onScan={handleScan} isActive={isScannerActive} />
          <Separator />
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Tips:</span>
            <span>Hold your device steady for faster detection.</span>
            <span>Move closer if the code does not register immediately.</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Latest Scan</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearResult}
              disabled={!currentResult}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentResult ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-muted/50 p-4">
                <p className="font-mono text-sm break-words text-foreground">
                  {currentResult}
                </p>
              </div>
              {isResultUrl && (
                <Button asChild className="flex items-center gap-2">
                  <Link
                    href={currentResult}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Link
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your most recent scan will appear here along with quick actions.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <CardTitle>Recent History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Scan a QR code to populate your history.
            </p>
          ) : (
            <ul className="space-y-3">
              {history.map((value) => (
                <li
                  key={value}
                  className="rounded-md border border-border bg-muted/50 p-3"
                >
                  <p className="font-mono text-xs break-words text-foreground">
                    {value}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
