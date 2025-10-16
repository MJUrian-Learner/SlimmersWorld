"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackToDashboard } from "@/components/back-to-dashboard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  QrCode,
  Dumbbell,
  Target,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { getAllEquipment, type Equipment } from "@/lib/equipment-database";
import { toast } from "sonner";

export default function GenerateQRPage() {
  // Protect this page with auth guard
  // useAuthGuard();

  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const router = useRouter();

  // Get equipment data from the database
  const equipmentData = getAllEquipment();

  // Add equipment list page as a special QR code
  const equipmentListData = {
    qrCode: "EQUIPMENT_LIST",
    name: "Equipment Directory",
    type: "Navigation",
    exerciseURL: "/equipments",
    difficulty: "All Levels" as const,
    maxTime: "Browse at your pace",
  };

  useEffect(() => {
    // Set base URL
    setBaseUrl(window.location.origin);

    // Generate QR codes for each equipment
    const generateQRCodes = async () => {
      setIsGenerating(true);
      try {
        // Dynamic import to avoid SSR issues
        const QRCode = (await import("qrcode")).default;

        const codes: { [key: string]: string } = {};

        // Generate QR code for equipment list page
        const equipmentListUrl = `${window.location.origin}${equipmentListData.exerciseURL}`;
        const equipmentListQR = await QRCode.toDataURL(equipmentListUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "M",
        });
        codes[equipmentListData.qrCode] = equipmentListQR;

        // Generate QR codes for individual equipment
        for (const equipment of equipmentData) {
          // Create URL that redirects to the exercise page
          const redirectUrl = `${window.location.origin}${equipment.exerciseURL}`;

          const qrDataURL = await QRCode.toDataURL(redirectUrl, {
            width: 256, // Higher resolution for better print quality
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
            errorCorrectionLevel: "M", // Medium error correction for better scanning
          });
          codes[equipment.qrCode] = qrDataURL;
        }
        setQrCodes(codes);
        toast.success("QR codes generated successfully!");
      } catch (error) {
        console.error("Error generating QR codes:", error);
        toast.error("Failed to generate QR codes. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCodes();
  }, []); // Empty dependency array since equipment data is static

  const downloadQRCode = (equipment: Equipment) => {
    if (!qrCodes[equipment.qrCode]) {
      toast.error("QR code not ready. Please wait for generation to complete.");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Create a larger canvas for better print quality
      const size = 512;
      canvas.width = size;
      canvas.height = size + 60; // Extra space for label

      // Fill with white background
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx!.drawImage(img, 0, 0, size, size);

      // Add equipment name label
      ctx!.fillStyle = "black";
      ctx!.font = "16px Arial, sans-serif";
      ctx!.textAlign = "center";
      ctx!.fillText(equipment.name, size / 2, size + 25);

      // Add equipment type
      ctx!.font = "12px Arial, sans-serif";
      ctx!.fillStyle = "#666";
      ctx!.fillText(equipment.type, size / 2, size + 45);

      const link = document.createElement("a");
      link.download = `${equipment.name.replace(/\s+/g, "_")}_QR_Code.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success(`QR code for ${equipment.name} downloaded!`);
    };

    img.src = qrCodes[equipment.qrCode];
  };

  const downloadAllQRCodes = async () => {
    const totalExpected = equipmentData.length + 1; // +1 for equipment list
    if (Object.keys(qrCodes).length !== totalExpected) {
      toast.error("Please wait for all QR codes to be generated first.");
      return;
    }

    setDownloadingAll(true);
    try {
      // Create a zip file with all QR codes
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add equipment list QR code to ZIP
      const equipmentListCanvas = document.createElement("canvas");
      const equipmentListCtx = equipmentListCanvas.getContext("2d");
      const equipmentListImg = new Image();

      await new Promise<void>((resolve) => {
        equipmentListImg.onload = () => {
          const size = 512;
          equipmentListCanvas.width = size;
          equipmentListCanvas.height = size + 60;

          equipmentListCtx!.fillStyle = "white";
          equipmentListCtx!.fillRect(
            0,
            0,
            equipmentListCanvas.width,
            equipmentListCanvas.height
          );
          equipmentListCtx!.drawImage(equipmentListImg, 0, 0, size, size);

          equipmentListCtx!.fillStyle = "black";
          equipmentListCtx!.font = "16px Arial, sans-serif";
          equipmentListCtx!.textAlign = "center";
          equipmentListCtx!.fillText(
            equipmentListData.name,
            size / 2,
            size + 25
          );

          equipmentListCtx!.font = "12px Arial, sans-serif";
          equipmentListCtx!.fillStyle = "#666";
          equipmentListCtx!.fillText(
            equipmentListData.type,
            size / 2,
            size + 45
          );

          equipmentListCanvas.toBlob(
            (blob) => {
              if (blob) {
                zip.file(
                  `${equipmentListData.name.replace(/\s+/g, "_")}_QR_Code.png`,
                  blob
                );
              }
              resolve();
            },
            "image/png",
            1.0
          );
        };
        equipmentListImg.src = qrCodes[equipmentListData.qrCode];
      });

      for (const equipment of equipmentData) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise<void>((resolve) => {
          img.onload = () => {
            const size = 512;
            canvas.width = size;
            canvas.height = size + 60;

            ctx!.fillStyle = "white";
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
            ctx!.drawImage(img, 0, 0, size, size);

            ctx!.fillStyle = "black";
            ctx!.font = "16px Arial, sans-serif";
            ctx!.textAlign = "center";
            ctx!.fillText(equipment.name, size / 2, size + 25);

            ctx!.font = "12px Arial, sans-serif";
            ctx!.fillStyle = "#666";
            ctx!.fillText(equipment.type, size / 2, size + 45);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  zip.file(
                    `${equipment.name.replace(/\s+/g, "_")}_QR_Code.png`,
                    blob
                  );
                }
                resolve();
              },
              "image/png",
              1.0
            );
          };
          img.src = qrCodes[equipment.qrCode];
        });
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.download = "Equipment_QR_Codes.zip";
      link.href = URL.createObjectURL(zipBlob);
      link.click();

      toast.success("All QR codes downloaded successfully!");
    } catch (error) {
      console.error("Error downloading all QR codes:", error);
      toast.error("Failed to download all QR codes. Please try again.");
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <BackToDashboard />
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center mb-3">
            <QrCode className="w-6 h-6 mr-3 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              QR Code Generator
            </h1>
          </div>
          <p className="text-muted-foreground">
            Generate and download QR codes for gym equipment exercises
          </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={["generator", "bulk-actions"]}
        className="space-y-4"
      >
        {/* QR Code Generator Section */}
        <AccordionItem
          value="generator"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">
                Equipment QR Codes ({equipmentData.length + 1} items)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              {isGenerating && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3" />
                  <span className="text-muted-foreground">
                    Generating QR codes...
                  </span>
                </div>
              )}

              {!isGenerating && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Equipment List QR Code */}
                  <div
                    key={equipmentListData.qrCode}
                    className="bg-muted rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <QrCode className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {equipmentListData.name}
                          </h3>
                        </div>
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className="text-xs border-primary text-primary"
                          >
                            {equipmentListData.type}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Target className="w-4 h-4 mr-1" />
                            <span>{equipmentListData.difficulty}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{equipmentListData.maxTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        {qrCodes[equipmentListData.qrCode] ? (
                          <div className="text-center space-y-2">
                            <img
                              src={qrCodes[equipmentListData.qrCode]}
                              alt={`QR Code for ${equipmentListData.name}`}
                              className="w-24 h-24 border border-border rounded-lg mx-auto"
                            />
                            <Button
                              onClick={() =>
                                downloadQRCode(equipmentListData as Equipment)
                              }
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center border border-border rounded-lg bg-background">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded break-all">
                        {baseUrl}
                        {equipmentListData.exerciseURL}
                      </div>
                    </div>
                  </div>

                  {/* Individual Equipment QR Codes */}
                  {equipmentData.map((equipment) => (
                    <div
                      key={equipment.qrCode}
                      className="bg-muted rounded-lg border border-border p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <Dumbbell className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-foreground truncate">
                              {equipment.name}
                            </h3>
                          </div>
                          <div className="space-y-1">
                            <Badge variant="secondary" className="text-xs">
                              {equipment.type}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Target className="w-4 h-4 mr-1" />
                              <span>{equipment.difficulty}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{equipment.maxTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex-shrink-0">
                          {qrCodes[equipment.qrCode] ? (
                            <div className="text-center space-y-2">
                              <img
                                src={qrCodes[equipment.qrCode]}
                                alt={`QR Code for ${equipment.name}`}
                                className="w-24 h-24 border border-border rounded-lg mx-auto"
                              />
                              <Button
                                onClick={() => downloadQRCode(equipment)}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          ) : (
                            <div className="w-24 h-24 flex items-center justify-center border border-border rounded-lg bg-background">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded break-all">
                          {baseUrl}
                          {equipment.exerciseURL}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Bulk Actions Section */}
        <AccordionItem
          value="bulk-actions"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <Download className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">Bulk Actions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6 space-y-4">
              <div className="text-center">
                <Button
                  onClick={downloadAllQRCodes}
                  disabled={
                    downloadingAll ||
                    Object.keys(qrCodes).length !== equipmentData.length + 1
                  }
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  {downloadingAll ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                      Creating ZIP...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download All QR Codes (ZIP)
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Downloads all QR codes in a single ZIP file
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Instructions Section */}
        <AccordionItem
          value="instructions"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">Setup Instructions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-foreground">
                      Download QR Codes:
                    </strong>{" "}
                    Click "Download" for individual equipment or "Download All"
                    for bulk download
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-foreground">Print & Mount:</strong>{" "}
                    Print the QR codes on durable material and mount them on the
                    corresponding equipment
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-foreground">User Access:</strong>{" "}
                    Users can scan these codes with their phone camera or QR
                    scanner to access exercise instructions
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-foreground">Quality Tips:</strong>{" "}
                    Use high-quality printing and laminate codes for durability
                    in gym environments
                  </div>
                </li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
