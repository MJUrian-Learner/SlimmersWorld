"use client";

import type React from "react";

import { BackToDashboard } from "@/components/back-to-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/client";
import { Calculator, Check, Save, Target, History, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useBMIHistory, useSaveBMI, useDeleteBMI } from "@/lib/hooks/useBMI";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
}

export default function BMICalculator() {
  // Protect this page with auth guard
  useAuthGuard();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [savedBMI, setSavedBMI] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // React Query hooks
  const { data: bmiHistory = [], isLoading: isLoadingHistory } =
    useBMIHistory();
  const saveBMIMutation = useSaveBMI();
  const deleteBMIMutation = useDeleteBMI();

  // Load saved BMI on component mount
  useEffect(() => {
    const loadSavedBMI = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user) {
          setIsLoading(false);
          return;
        }

        const savedBMIRecord = user.user_metadata?.bmi_record;
        if (savedBMIRecord) {
          setSavedBMI(savedBMIRecord);
        }
      } catch (error) {
        console.error("Error loading saved BMI:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedBMI();
  }, [supabase]);

  const getBMICategory = (bmi: number): Omit<BMIResult, "bmi"> => {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        color: "blue",
        description: "You may need to gain some weight for optimal health.",
      };
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return {
        category: "Normal",
        color: "green",
        description: "You have a healthy weight for your height.",
      };
    } else if (bmi >= 25 && bmi <= 29.9) {
      return {
        category: "Overweight",
        color: "yellow",
        description: "You may benefit from losing some weight.",
      };
    } else {
      return {
        category: "Obese",
        color: "red",
        description:
          "Consider consulting a healthcare professional for guidance.",
      };
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight || !height) return;

    const weightNum = Number.parseFloat(weight);
    const heightNum = Number.parseFloat(height) / 100; // Convert cm to meters
    const bmi = weightNum / (heightNum * heightNum);

    const categoryInfo = getBMICategory(bmi);
    setBmiResult({
      bmi,
      ...categoryInfo,
    });

    // Reset save states when calculating a new result
    saveBMIMutation.reset();

    // Optional: Still store in localStorage for future reference
    localStorage.setItem(
      "bmiResult",
      JSON.stringify({
        bmi: bmi.toFixed(1),
        weight: weightNum,
        height: Number.parseFloat(height),
        date: new Date().toISOString(),
      })
    );
  };

  const saveBMIResult = async () => {
    if (!bmiResult) return;

    try {
      await saveBMIMutation.mutateAsync({
        weight: Number.parseFloat(weight),
        height: Number.parseFloat(height),
        bmiValue: bmiResult.bmi,
      });

      // Update local state for saved BMI display
      const bmiRecord = {
        bmi: bmiResult.bmi,
        category: bmiResult.category,
        weight: Number.parseFloat(weight),
        height: Number.parseFloat(height),
        date: new Date().toISOString(),
      };
      setSavedBMI(bmiRecord);
      toast.success("BMI record saved successfully!");
    } catch (error) {
      console.error("Error saving BMI result:", error);
      toast.error("Failed to save BMI result. Please try again.");
    }
  };

  const handleDeleteClick = (recordId: string) => {
    setRecordToDelete(recordId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await deleteBMIMutation.mutateAsync(recordToDelete);
      toast.success("BMI record deleted successfully!");
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error("Error deleting BMI record:", error);
      toast.error("Failed to delete BMI record. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <BackToDashboard />
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center mb-3">
            <Calculator className="w-6 h-6 mr-3 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              BMI Calculator
            </h1>
          </div>
          <p className="text-muted-foreground">
            Calculate your body mass index to track your health
          </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={["calculator"]}
        className="space-y-4"
      >
        {/* Calculator Section */}
        <AccordionItem
          value="calculator"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">BMI Calculator</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="weight"
                      className="text-foreground font-medium text-base"
                    >
                      Weight
                    </Label>
                    <div className="relative">
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Enter your weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="bg-background border-border text-foreground pr-12 h-12 text-lg"
                        required
                        min="1"
                        max="500"
                        step="0.1"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                        kg
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="height"
                      className="text-foreground font-medium text-base"
                    >
                      Height
                    </Label>
                    <div className="relative">
                      <Input
                        id="height"
                        type="number"
                        placeholder="Enter your height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="bg-background border-border text-foreground pr-12 h-12 text-lg"
                        required
                        min="50"
                        max="250"
                        step="0.1"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                        cm
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                  disabled={!weight || !height}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate BMI
                </Button>
              </form>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* BMI Result Section */}
        {bmiResult && (
          <AccordionItem
            value="result"
            className="border border-border rounded-lg"
          >
            <AccordionTrigger className="px-6 py-4">
              <div className="flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary" />
                <span className="font-semibold">Your BMI Result</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6">
                <div className="text-center space-y-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground mb-2">
                        {bmiResult.bmi.toFixed(1)}
                      </div>
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${
                          bmiResult.color === "blue"
                            ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : bmiResult.color === "green"
                            ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                            : bmiResult.color === "yellow"
                            ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                            : "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                        }`}
                      >
                        {bmiResult.category}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        {bmiResult.description}
                      </p>
                    </div>

                    <div className="flex justify-center space-x-4 text-sm text-muted-foreground pt-2 border-t border-border">
                      <div>
                        Weight: <span className="font-medium">{weight} kg</span>
                      </div>
                      <div>
                        Height: <span className="font-medium">{height} cm</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBmiResult(null);
                        saveBMIMutation.reset();
                      }}
                    >
                      Calculate Again
                    </Button>

                    <Button
                      variant={
                        saveBMIMutation.isSuccess ? "default" : "secondary"
                      }
                      size="sm"
                      onClick={saveBMIResult}
                      disabled={
                        saveBMIMutation.isPending || saveBMIMutation.isSuccess
                      }
                      className={`transition-all duration-200 ${
                        saveBMIMutation.isSuccess
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }`}
                    >
                      {saveBMIMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Saving...
                        </>
                      ) : saveBMIMutation.isSuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Result
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* BMI History Section */}
        <AccordionItem
          value="history"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <History className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">
                BMI History ({bmiHistory.length} records)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              {isLoadingHistory && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3" />
                  <span className="text-muted-foreground">
                    Loading BMI history...
                  </span>
                </div>
              )}

              {!isLoadingHistory && bmiHistory.length > 0 && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {bmiHistory.map((record) => (
                    <div
                      key={record.id}
                      className="bg-muted rounded-lg border border-border p-4"
                    >
                      {/* Header with BMI and Delete Button */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {Number(record.bmiValue).toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            BMI
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(record.id)}
                          disabled={deleteBMIMutation.isPending}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Body with measurements and status */}
                      <div className="space-y-3">
                        {/* Measurements */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-background/50 rounded-md p-3">
                            <div className="text-xs text-muted-foreground mb-1">
                              Weight
                            </div>
                            <div className="text-sm font-medium">
                              {Number(record.weight).toFixed(1)} kg
                            </div>
                          </div>
                          <div className="bg-background/50 rounded-md p-3 text-right">
                            <div className="text-xs text-muted-foreground mb-1">
                              Height
                            </div>
                            <div className="text-sm font-medium">
                              {Number(record.height).toFixed(1)} cm
                            </div>
                          </div>
                        </div>

                        {/* Status and Date */}
                        <div className="flex items-center justify-between">
                          <div
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              record.category === "Underweight"
                                ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                                : record.category === "Normal"
                                ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                                : record.category === "Overweight"
                                ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300"
                                : "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {record.category}
                          </div>

                          <div className="text-xs text-muted-foreground text-right">
                            <div className="font-medium">
                              {new Date(record.recordedAt).toLocaleDateString()}
                            </div>
                            <div>
                              {new Date(record.recordedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoadingHistory && bmiHistory.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No BMI history yet</p>
                  <p className="text-xs mt-1">
                    Save your BMI calculations to see them here
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* BMI Categories Section */}
        <AccordionItem
          value="categories"
          className="border border-border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">BMI Categories</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div
                    className={`flex flex-col justify-between items-center p-3 rounded-lg border transition-all ${
                      bmiResult?.category === "Underweight"
                        ? "bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-800 shadow-md"
                        : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      Underweight
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Below 18.5
                    </span>
                    {bmiResult?.category === "Underweight" && (
                      <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                        ← Your Category
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-between items-center p-3 rounded-lg border transition-all ${
                      bmiResult?.category === "Normal"
                        ? "bg-green-100 dark:bg-green-950/40 border-green-300 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-800 shadow-md"
                        : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    }`}
                  >
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Normal
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      18.5 - 24.9
                    </span>
                    {bmiResult?.category === "Normal" && (
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                        ← Your Category
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div
                    className={`flex flex-col justify-between items-center p-3 rounded-lg border transition-all ${
                      bmiResult?.category === "Overweight"
                        ? "bg-yellow-100 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-600 ring-2 ring-yellow-200 dark:ring-yellow-800 shadow-md"
                        : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                    }`}
                  >
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">
                      Overweight
                    </span>
                    <span className="text-yellow-600 dark:text-yellow-400">
                      25.0 - 29.9
                    </span>
                    {bmiResult?.category === "Overweight" && (
                      <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        ← Your Category
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-between items-center p-3 rounded-lg border transition-all ${
                      bmiResult?.category === "Obese"
                        ? "bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-600 ring-2 ring-red-200 dark:ring-red-800 shadow-md"
                        : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <span className="font-medium text-red-700 dark:text-red-300">
                      Obese
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      30.0+
                    </span>
                    {bmiResult?.category === "Obese" && (
                      <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                        ← Your Category
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete BMI Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this BMI record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteBMIMutation.isPending}
            >
              {deleteBMIMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
