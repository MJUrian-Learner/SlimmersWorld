import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and merges Tailwind CSS classes efficiently.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 *
 * @param inputs - Class names to combine (strings, objects, arrays, etc.)
 * @returns Merged class string with optimized Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a route matches any of the provided route patterns.
 * Supports exact strings, wildcards (*), and regular expressions.
 *
 * @param routes - Array of route patterns to match against
 * @param currentRoute - The current route to check
 * @returns True if a match is found, false otherwise
 */
export function matchRoute(
  routes: (string | RegExp)[],
  currentRoute: string
): boolean {
  return routes.some((route) => {
    if (route instanceof RegExp) {
      return route.test(currentRoute);
    }
    if (typeof route === "string" && route.includes("*")) {
      const prefix = route.replace("*", "");
      return currentRoute.startsWith(prefix);
    }
    return route === currentRoute;
  });
}

/**
 * Gets the current site URL with proper formatting.
 * Prioritizes environment variables for production and development.
 *
 * @returns Formatted site URL with https:// and trailing slash
 */
export const getURL = () => {
  const PREVIEW_URL =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : undefined;

  const PRODUCTION_URL =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      : undefined;

  let url = PREVIEW_URL ?? PRODUCTION_URL ?? "http://localhost:3000/";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};
