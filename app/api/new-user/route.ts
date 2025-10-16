import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

  // Upsert user in database by email
  const name = user.user_metadata.firstName + " " + user.user_metadata.lastName;

  const [dbUser] = await db
    .insert(users)
    .values({
      email: user.email!,
      name,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { name },
    })
    .returning();

  return NextResponse.json({ user: dbUser });
}
