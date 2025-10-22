"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "@/components/loader";
import { BackToDashboard } from "@/components/back-to-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  TrendingUp,
  QrCode,
  Globe,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  summary: {
    totalScans: number;
    uniqueScanners: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
  scansPerExercise: Array<{
    exerciseName: string | null;
    exercisePath: string;
    equipmentType: string | null;
    count: number;
  }>;
  scansByEquipment: Array<{
    equipmentType: string | null;
    count: number;
  }>;
  dailyActiveUsers: Array<{
    date: string;
    count: number;
  }>;
  dailyScans: Array<{
    date: string;
    scans: number;
    uniqueUsers: number;
  }>;
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "all">("30d");
  const router = useRouter();

  const SUPER_ADMIN = useMemo(
    () => process.env.NEXT_PUBLIC_SUPER_ADMIN_ACCOUNT,
    []
  );

  useEffect(() => {
    setIsSuperAdmin(userEmail === SUPER_ADMIN);
  }, [userEmail, SUPER_ADMIN]);

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/auth/login");
          return;
        }

        if (isMounted) {
          setUser(user.user_metadata || { name: user.email });
          setUserEmail(user?.email || null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!isSuperAdmin || !userEmail) return;

    const fetchAnalytics = async () => {
      try {
        let url = "/api/analytics";
        const params = new URLSearchParams();

        if (dateRange !== "all") {
          const days = dateRange === "7d" ? 7 : 30;
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);
          params.append("startDate", startDate.toISOString());
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };

    fetchAnalytics();
  }, [isSuperAdmin, userEmail, dateRange]);

  if (isLoading) {
    return <Loader header="Loading..." description="Please wait." />;
  }

  if (!isSuperAdmin) {
    return (
      <div className="w-full max-w-2xl space-y-6 mb-12">
        <BackToDashboard />
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Access denied. This page is only available to super admins.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6 mb-12">
      {/* Header */}
      <div className="space-y-2">
        <BackToDashboard />
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                Analytics Dashboard
              </h1>
            </div>
            <Badge variant="secondary">Super Admin</Badge>
          </div>
          <p className="text-muted-foreground">
            Track QR code scan statistics and exercise engagement metrics
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Time Range
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={dateRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("7d")}
              >
                Last 7 Days
              </Button>
              <Button
                variant={dateRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("30d")}
              >
                Last 30 Days
              </Button>
              <Button
                variant={dateRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("all")}
              >
                All Time
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      {analyticsData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <QrCode className="w-8 h-8 text-primary" />
                  <Badge variant="default">Total</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.totalScans}
                </h3>
                <p className="text-sm text-muted-foreground">Total Scans</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-green-500" />
                  <Badge variant="secondary">Unique</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.uniqueScanners}
                </h3>
                <p className="text-sm text-muted-foreground">Unique Scanners</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <Badge variant="outline">7 Days</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.weeklyActiveUsers}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Weekly Active Users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  <Badge variant="outline">30 Days</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.monthlyActiveUsers}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monthly Active Users
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scans Per Exercise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-primary" />
                  Top Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.scansPerExercise.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.scansPerExercise
                      .slice(0, 10)
                      .map((exercise, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {exercise.exerciseName || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {exercise.equipmentType || "N/A"} •{" "}
                              {exercise.exercisePath}
                            </p>
                          </div>
                          <Badge variant="default">
                            {exercise.count} scans
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No scans yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                  Scans by Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.scansByEquipment.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.scansByEquipment.map((equipment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {equipment.equipmentType || "Unknown"}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {equipment.count} scans
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No scans yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily Scans Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Daily Activity (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.dailyScans.length > 0 ? (
                <div className="space-y-2">
                  {analyticsData.dailyScans.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                    >
                      <div className="w-28 text-sm font-medium text-muted-foreground">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                      <div className="flex-1 flex gap-4">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-primary" />
                          <span className="text-sm">{day.scans} scans</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-500" />
                          <span className="text-sm">
                            {day.uniqueUsers} users
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        Avg: {(day.scans / day.uniqueUsers).toFixed(1)}{" "}
                        scans/user
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No visit data available
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
