import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/client";
import { pageVisits, users } from "@/lib/db/schema";
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
    const { pagePath, utmSource } = await request.json();

    if (!pagePath) {
      return NextResponse.json(
        { error: "Missing required field: pagePath" },
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
    let sessionId = cookieStore.get("visit_session_id")?.value;

    if (!sessionId) {
      sessionId = randomUUID();
    }

    // Get user agent and IP address
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined;

    // Save visit to database
    const [visitRecord] = await db
      .insert(pageVisits)
      .values({
        userId,
        pagePath,
        utmSource: utmSource || null,
        sessionId,
        userAgent,
        ipAddress,
      })
      .returning();

    // Set session cookie (expires in 30 minutes)
    const response = NextResponse.json(
      { success: true, visitId: visitRecord.id },
      { status: 201 }
    );

    if (sessionId) {
      response.cookies.set("visit_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30, // 30 minutes
      });
    }

    return response;
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
