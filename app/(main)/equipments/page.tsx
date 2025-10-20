"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackToDashboard } from "@/components/back-to-dashboard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllEquipment, type Equipment } from "@/lib/equipment-database";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Target, Dumbbell } from "lucide-react";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useTrackPageVisit } from "@/lib/hooks/useTrackPageVisit";

export default function EquipmentPage() {
  // Protect this page with auth guard
  // useAuthGuard();

  // Track page visit
  useTrackPageVisit();

  const [selectedType, setSelectedType] = useState<string>("All");
  const router = useRouter();

  const allEquipment = getAllEquipment();

  // Only show equipment types that have actual records
  const availableTypes = ["All", ...new Set(allEquipment.map((eq) => eq.type))];
  const equipmentTypes = availableTypes;

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
    <div className="w-full max-w-2xl space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <BackToDashboard />
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center mb-3">
            <Dumbbell className="w-6 h-6 mr-3 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Equipment Directory
            </h1>
          </div>
          <p className="text-muted-foreground">
            Browse gym equipment and discover targeted workouts
          </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={["equipment-filter", "equipment-list"]}
        className="space-y-4"
      >
        {/* Filter Section */}
        <AccordionItem
          value="equipment-filter"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">Equipment Filter</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-2">
                {equipmentTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="text-sm transition-all duration-200"
                  >
                    {type}
                    {type !== "All" && (
                      <span className="ml-2 bg-primary-foreground/20 px-1.5 py-0.5 rounded-full text-xs">
                        {allEquipment.filter((eq) => eq.type === type).length}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Equipment List Section */}
        <AccordionItem
          value="equipment-list"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <Dumbbell className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">
                {selectedType === "All"
                  ? "All Equipment"
                  : `${selectedType} Equipment`}{" "}
                ({filteredEquipment.length} items)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {filteredEquipment.map((equipment) => (
                  <div
                    key={equipment.id}
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
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                equipment.type === "Strength"
                                  ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                                  : equipment.type === "Cardio"
                                  ? "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                                  : equipment.type === "Flexibility"
                                  ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                                  : "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300"
                              }`}
                            >
                              {equipment.type}
                            </Badge>
                            <Badge
                              className={getDifficultyColor(
                                equipment.difficulty
                              )}
                            >
                              {equipment.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{equipment.maxTime}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Calories:</span>{" "}
                            {equipment.calories}
                          </div>
                        </div>
                      </div>
                    </div>

                    {equipment.targetMuscles && (
                      <div className="mb-4">
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
                              variant="outline"
                              className="text-xs"
                            >
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">
                          Instructions:
                        </strong>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        {equipment.instructions
                          .slice(0, 2)
                          .map((instruction, index) => (
                            <li key={index} className="list-disc">
                              {instruction}
                            </li>
                          ))}
                        {equipment.instructions.length > 2 && (
                          <li className="text-xs italic">
                            +{equipment.instructions.length - 2} more
                            instructions...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
