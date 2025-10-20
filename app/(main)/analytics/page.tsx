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
    totalVisitsWithQR: number;
    totalVisitsWithoutQR: number;
    uniqueVisitorsWithQR: number;
    uniqueVisitorsWithoutQR: number;
    totalVisits: number;
  };
  pageBreakdown: {
    withQR: Array<{ pagePath: string; count: number }>;
    withoutQR: Array<{ pagePath: string; count: number }>;
  };
  timeline: Array<{ date: string; withQR: number; withoutQR: number }>;
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

        // Filter only equipment pages
        params.append("path", "/exercise");

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
      <div className="w-full max-w-2xl space-y-4">
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
    <div className="w-full max-w-6xl space-y-6">
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
            Track visitor statistics for equipment pages
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
                  <Badge variant="default">QR Code</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.totalVisitsWithQR}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visits from QR Codes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Globe className="w-8 h-8 text-blue-500" />
                  <Badge variant="secondary">Direct</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.totalVisitsWithoutQR}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visits without QR Code
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-green-500" />
                  <Badge variant="outline">QR</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.uniqueVisitorsWithQR}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Unique Visitors (QR)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <Badge variant="outline">Total</Badge>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {analyticsData.summary.totalVisits}
                </h3>
                <p className="text-sm text-muted-foreground">Total Visits</p>
              </CardContent>
            </Card>
          </div>

          {/* Page Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-primary" />
                  Top Pages (QR Code)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.pageBreakdown.withQR.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.pageBreakdown.withQR
                      .slice(0, 10)
                      .map((page, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {page.pagePath}
                            </p>
                          </div>
                          <Badge variant="default">{page.count} visits</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No QR code visits yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-500" />
                  Top Pages (Direct)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.pageBreakdown.withoutQR.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.pageBreakdown.withoutQR
                      .slice(0, 10)
                      .map((page, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {page.pagePath}
                            </p>
                          </div>
                          <Badge variant="secondary">{page.count} visits</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No direct visits yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Visits Over Time (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.timeline.length > 0 ? (
                <div className="space-y-2">
                  {analyticsData.timeline.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                    >
                      <div className="w-24 text-sm font-medium text-muted-foreground">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-sm">QR: {day.withQR}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">
                            Direct: {day.withoutQR}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        Total: {day.withQR + day.withoutQR}
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
