import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/client";
import { pageVisits } from "@/lib/db/schema";
import { sql, and, gte, lte, isNull, isNotNull, eq } from "drizzle-orm";

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
    const pathFilter = searchParams.get("path");

    // Build conditions array
    const conditions = [];

    if (startDate) {
      conditions.push(gte(pageVisits.createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(pageVisits.createdAt, new Date(endDate)));
    }

    if (pathFilter) {
      conditions.push(sql`${pageVisits.pagePath} LIKE ${`%${pathFilter}%`}`);
    }

    // Get total visits with QR code
    const visitsWithQRResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageVisits)
      .where(
        and(
          isNotNull(pageVisits.utmSource),
          eq(pageVisits.utmSource, "qr_code"),
          ...(conditions.length > 0 ? conditions : [])
        )
      );

    const visitsWithQR = visitsWithQRResult[0]?.count || 0;

    // Get total visits without QR code (utm_source is null or not 'qr_code')
    const visitsWithoutQRResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageVisits)
      .where(
        and(
          sql`(${pageVisits.utmSource} IS NULL OR ${pageVisits.utmSource} != 'qr_code')`,
          ...(conditions.length > 0 ? conditions : [])
        )
      );

    const visitsWithoutQR = visitsWithoutQRResult[0]?.count || 0;

    // Get breakdown by page path with QR code
    const pageBreakdownWithQR = await db
      .select({
        pagePath: pageVisits.pagePath,
        count: sql<number>`count(*)::int`,
      })
      .from(pageVisits)
      .where(
        and(
          isNotNull(pageVisits.utmSource),
          eq(pageVisits.utmSource, "qr_code"),
          ...(conditions.length > 0 ? conditions : [])
        )
      )
      .groupBy(pageVisits.pagePath)
      .orderBy(sql`count(*) DESC`);

    // Get breakdown by page path without QR code
    const pageBreakdownWithoutQR = await db
      .select({
        pagePath: pageVisits.pagePath,
        count: sql<number>`count(*)::int`,
      })
      .from(pageVisits)
      .where(
        and(
          sql`(${pageVisits.utmSource} IS NULL OR ${pageVisits.utmSource} != 'qr_code')`,
          ...(conditions.length > 0 ? conditions : [])
        )
      )
      .groupBy(pageVisits.pagePath)
      .orderBy(sql`count(*) DESC`);

    // Get visits over time (daily)
    const visitsOverTime = await db
      .select({
        date: sql<string>`DATE(${pageVisits.createdAt})`,
        withQR: sql<number>`COUNT(CASE WHEN ${pageVisits.utmSource} = 'qr_code' THEN 1 END)::int`,
        withoutQR: sql<number>`COUNT(CASE WHEN ${pageVisits.utmSource} IS NULL OR ${pageVisits.utmSource} != 'qr_code' THEN 1 END)::int`,
      })
      .from(pageVisits)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(sql`DATE(${pageVisits.createdAt})`)
      .orderBy(sql`DATE(${pageVisits.createdAt}) DESC`)
      .limit(30);

    // Get unique visitors (by session)
    const uniqueVisitorsWithQR = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${pageVisits.sessionId})::int`,
      })
      .from(pageVisits)
      .where(
        and(
          isNotNull(pageVisits.utmSource),
          eq(pageVisits.utmSource, "qr_code"),
          ...(conditions.length > 0 ? conditions : [])
        )
      );

    const uniqueVisitorsWithoutQR = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${pageVisits.sessionId})::int`,
      })
      .from(pageVisits)
      .where(
        and(
          sql`(${pageVisits.utmSource} IS NULL OR ${pageVisits.utmSource} != 'qr_code')`,
          ...(conditions.length > 0 ? conditions : [])
        )
      );

    return NextResponse.json({
      summary: {
        totalVisitsWithQR: visitsWithQR,
        totalVisitsWithoutQR: visitsWithoutQR,
        uniqueVisitorsWithQR: uniqueVisitorsWithQR[0]?.count || 0,
        uniqueVisitorsWithoutQR: uniqueVisitorsWithoutQR[0]?.count || 0,
        totalVisits: visitsWithQR + visitsWithoutQR,
      },
      pageBreakdown: {
        withQR: pageBreakdownWithQR,
        withoutQR: pageBreakdownWithoutQR,
      },
      timeline: visitsOverTime,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
