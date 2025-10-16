import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { matchRoute } from "@/lib/utils";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/constants/middleware";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getClaims()

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Redirect to set password page if user needs to set initial password
  const needsInitialPassword = user?.user_metadata?.needs_initial_password;
  if (needsInitialPassword) {
    if (!request.nextUrl.pathname.startsWith("/auth/set-password")) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/set-password";
      return NextResponse.redirect(url);
    }
  }

  // Redirect to reset password page if user is logged in and password reset is required
  const passwordResetRequired = user?.user_metadata?.password_reset_required;
  if (passwordResetRequired) {
    if (!request.nextUrl.pathname.startsWith("/user-management/set-password")) {
      const url = request.nextUrl.clone();
      url.pathname = "/user-management/set-password";
      return NextResponse.redirect(url);
    }
  }

  if (matchRoute(PUBLIC_ROUTES, request.nextUrl.pathname)) {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    // EXCEPT if they need to set initial password
    if (user && request.nextUrl.pathname.startsWith("/auth/")) {
      // Allow access to set-password if user needs initial password
      if (
        needsInitialPassword &&
        request.nextUrl.pathname.startsWith("/auth/set-password")
      ) {
        return supabaseResponse;
      }

      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Protect private routes
  if (!user && matchRoute(PRIVATE_ROUTES, request.nextUrl.pathname)) {
    // If it's an api route, return 401 JSON
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set(
      "redirectTo",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  // Add cache control headers for protected routes to prevent caching
  if (user && matchRoute(PRIVATE_ROUTES, request.nextUrl.pathname)) {
    supabaseResponse.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate, proxy-revalidate"
    );
    supabaseResponse.headers.set("Pragma", "no-cache");
    supabaseResponse.headers.set("Expires", "0");
    supabaseResponse.headers.set("Surrogate-Control", "no-store");
  }

  // Redirect to dashboard if user is logged in and on the home page
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
