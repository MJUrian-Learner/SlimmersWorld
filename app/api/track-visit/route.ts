import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/client";
import { qrScans, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user (optional - visitor might not be logged in)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Parse request body
    const { exercisePath, exerciseName, equipmentType } = await request.json();

    if (!exercisePath) {
      return NextResponse.json(
        { error: "Missing required field: exercisePath" },
        { status: 400 }
      );
    }

    let userId: string | null = null;

    // If user is authenticated, get their DB user ID
    if (user) {
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email!))
        .limit(1);

      if (dbUser.length > 0) {
        userId = dbUser[0].id;
      }
    }

    // Get session ID from cookie or create new one
    const cookieStore = request.cookies;
    let sessionId = cookieStore.get("qr_scan_session_id")?.value;

    if (!sessionId) {
      sessionId = randomUUID();
    }

    // Get user agent and IP address
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined;

    // Save QR scan to database
    const [scanRecord] = await db
      .insert(qrScans)
      .values({
        userId,
        exercisePath,
        exerciseName: exerciseName || null,
        equipmentType: equipmentType || null,
        sessionId,
        userAgent,
        ipAddress,
      })
      .returning();

    // Set session cookie (expires in 24 hours for daily active user tracking)
    const response = NextResponse.json(
      { success: true, scanId: scanRecord.id },
      { status: 201 }
    );

    if (sessionId) {
      response.cookies.set("qr_scan_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }

    return response;
  } catch (error) {
    console.error("Error tracking QR scan:", error);
    return NextResponse.json(
      { error: "Failed to track QR scan" },
      { status: 500 }
    );
  }
}
