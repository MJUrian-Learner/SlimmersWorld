"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlimmersLogo } from "@/components/slimmers-logo";
import { getAllEquipment, type Equipment } from "@/lib/equipment-database";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Target, QrCode } from "lucide-react";
import Link from "next/link";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";

export default function EquipmentPage() {
  // Protect this page with auth guard
  useAuthGuard();

  const [selectedType, setSelectedType] = useState<string>("All");
  const router = useRouter();

  const allEquipment = getAllEquipment();
  const equipmentTypes = [
    "All",
    "Cardio",
    "Strength",
    "Circuit",
    "Flexibility",
  ];

  const filteredEquipment =
    selectedType === "All"
      ? allEquipment
      : allEquipment.filter((eq) => eq.type === selectedType);

  const getDifficultyColor = (difficulty: Equipment["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      case "All Levels":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
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

        <Card className="bg-card border-border mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-foreground">
              Equipment Directory
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {equipmentTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="text-xs"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Equipment List */}
        <div className="space-y-4">
          {filteredEquipment.map((equipment) => (
            <Card key={equipment.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {equipment.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {equipment.type} Equipment
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {equipment.maxTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-start">
                  <Badge className={getDifficultyColor(equipment.difficulty)}>
                    {equipment.difficulty}
                  </Badge>
                </div>

                {equipment.targetMuscles && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Target className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Target Areas:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {equipment.targetMuscles.map((muscle, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardAction className="px-4 w-full">
                <Link href={equipment.exerciseURL}>
                  <Button className="w-full">View Exercises</Button>
                </Link>
              </CardAction>
            </Card>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <Button
            onClick={() => router.push("/qr-scanner")}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan Equipment QR Code
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="w-full border-border"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
