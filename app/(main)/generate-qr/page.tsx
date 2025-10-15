"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlimmersLogo } from "@/components/slimmers-logo";
import { ArrowLeft, Download, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GenerateQRPage() {
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [baseUrl, setBaseUrl] = useState<string>("");
  const router = useRouter();

  const equipmentData = [
    {
      id: "DUMBBELL_EXERCISES",
      name: "Dumbbell Station",
      type: "Strength Equipment",
      url: "/equipment/dumbbell",
    },
    {
      id: "KETTLEBELL_EXERCISES",
      name: "Kettlebell Station",
      type: "Functional Training",
      url: "/equipment/kettlebell",
    },
    {
      id: "AB_ROLLER_EXERCISES",
      name: "Ab Roller Station",
      type: "Core Training",
      url: "/equipment/ab-roller",
    },
  ];

  useEffect(() => {
    // Set base URL
    setBaseUrl(window.location.origin);

    // Generate QR codes for each equipment
    const generateQRCodes = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const QRCode = (await import("qrcode")).default;

        const codes: { [key: string]: string } = {};
        for (const equipment of equipmentData) {
          // Create URL that redirects to the equipment page
          const redirectUrl = `${window.location.origin}${equipment.url}`;

          const qrDataURL = await QRCode.toDataURL(redirectUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          codes[equipment.id] = qrDataURL;
        }
        setQrCodes(codes);
      } catch (error) {
        console.error("Error generating QR codes:", error);
      }
    };

    generateQRCodes();
  }, []);

  const downloadQRCode = (equipmentId: string, equipmentName: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `${equipmentName.replace(/\s+/g, "_")}_QR.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = qrCodes[equipmentId];
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-4 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SlimmersLogo />
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="text-center p-4">
              <CardTitle className="text-xl font-bold text-foreground flex items-center justify-center">
                <QrCode className="w-6 h-6 mr-2" />
                Equipment QR Code Generator
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Generate and download QR codes for gym equipment
              </p>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentData.map((equipment) => (
              <Card key={equipment.id} className="bg-card border-border">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-bold text-foreground">
                    {equipment.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {equipment.type}
                  </p>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                  {qrCodes[equipment.id] ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <img
                          src={qrCodes[equipment.id]}
                          alt={`QR Code for ${equipment.name}`}
                          className="border border-border rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded break-all">
                          {baseUrl}
                          {equipment.url}
                        </p>

                        <Button
                          onClick={() =>
                            downloadQRCode(equipment.id, equipment.name)
                          }
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download QR Code
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <p className="text-muted-foreground">
                        Generating QR Code...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="text-center p-4">
              <CardTitle className="text-xl font-bold text-foreground flex items-center justify-center">
                <QrCode className="w-6 h-6 mr-2" />
                Exercise QR Code Generator
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Generate and download QR codes for gym equipment
              </p>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">
                Instructions:
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    1
                  </span>
                  Click "Download QR Code" for the equipment you want to print
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    2
                  </span>
                  Print the QR code and place it on the corresponding equipment
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    3
                  </span>
                  Use the QR Scanner in the app to scan the printed codes
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
