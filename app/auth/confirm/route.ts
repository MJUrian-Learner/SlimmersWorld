import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          // If user doesn't exist, create a new record
          if (existingUser.length === 0) {
            await db.insert(users).values({
              email: user.email!,
              name:
                user.user_metadata?.name ||
                user.user_metadata?.full_name ||
                user.email!.split("@")[0],
            });
          }
        } catch (dbError) {
          console.error("Error creating user in database:", dbError);
        }
      }

      if (type === "recovery") {
        await supabase.auth.updateUser({
          data: { password_reset_required: true },
        });
      }

      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        console.error("Error refreshing session:", refreshError);
      }

      return NextResponse.redirect(redirectTo);
    }
  }

  notFound();
}
