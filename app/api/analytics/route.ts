import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/client";
import { qrScans } from "@/lib/db/schema";
import { sql, and, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is super admin
    const isSuperAdmin =
      user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_ACCOUNT;

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 403 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build conditions array
    const conditions = [];

    if (startDate) {
      conditions.push(gte(qrScans.scannedAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(qrScans.scannedAt, new Date(endDate)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total scans
    const totalScansResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(qrScans)
      .where(whereClause);

    const totalScans = totalScansResult[0]?.count || 0;

    // Get unique scanners (by session)
    const uniqueScannersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${qrScans.sessionId})::int`,
      })
      .from(qrScans)
      .where(whereClause);

    const uniqueScanners = uniqueScannersResult[0]?.count || 0;

    // Get scans per exercise
    const scansPerExercise = await db
      .select({
        exerciseName: qrScans.exerciseName,
        exercisePath: qrScans.exercisePath,
        equipmentType: qrScans.equipmentType,
        count: sql<number>`count(*)::int`,
      })
      .from(qrScans)
      .where(whereClause)
      .groupBy(
        qrScans.exerciseName,
        qrScans.exercisePath,
        qrScans.equipmentType
      )
      .orderBy(sql`count(*) DESC`);

    // Get scans by equipment type
    const scansByEquipment = await db
      .select({
        equipmentType: qrScans.equipmentType,
        count: sql<number>`count(*)::int`,
      })
      .from(qrScans)
      .where(whereClause)
      .groupBy(qrScans.equipmentType)
      .orderBy(sql`count(*) DESC`);

    // Get daily active users (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyActiveUsers = await db
      .select({
        date: sql<string>`DATE(${qrScans.scannedAt})`,
        count: sql<number>`COUNT(DISTINCT ${qrScans.sessionId})::int`,
      })
      .from(qrScans)
      .where(
        and(
          gte(qrScans.scannedAt, thirtyDaysAgo),
          ...(conditions.length > 0 ? conditions : [])
        )
      )
      .groupBy(sql`DATE(${qrScans.scannedAt})`)
      .orderBy(sql`DATE(${qrScans.scannedAt}) DESC`)
      .limit(30);

    // Calculate weekly active users (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyActiveUsersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${qrScans.sessionId})::int`,
      })
      .from(qrScans)
      .where(
        and(
          gte(qrScans.scannedAt, sevenDaysAgo),
          ...(conditions.length > 0 ? conditions : [])
        )
      );

    const weeklyActiveUsers = weeklyActiveUsersResult[0]?.count || 0;

    // Calculate monthly active users (last 30 days)
    const monthlyActiveUsersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${qrScans.sessionId})::int`,
      })
      .from(qrScans)
      .where(
        and(
          gte(qrScans.scannedAt, thirtyDaysAgo),
          ...(conditions.length > 0 ? conditions : [])
        )
      );

    const monthlyActiveUsers = monthlyActiveUsersResult[0]?.count || 0;

    // Get daily scans timeline
    const dailyScans = await db
      .select({
        date: sql<string>`DATE(${qrScans.scannedAt})`,
        scans: sql<number>`count(*)::int`,
        uniqueUsers: sql<number>`COUNT(DISTINCT ${qrScans.sessionId})::int`,
      })
      .from(qrScans)
      .where(whereClause)
      .groupBy(sql`DATE(${qrScans.scannedAt})`)
      .orderBy(sql`DATE(${qrScans.scannedAt}) DESC`)
      .limit(30);

    return NextResponse.json({
      summary: {
        totalScans,
        uniqueScanners,
        weeklyActiveUsers,
        monthlyActiveUsers,
      },
      scansPerExercise,
      scansByEquipment,
      dailyActiveUsers,
      dailyScans,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
