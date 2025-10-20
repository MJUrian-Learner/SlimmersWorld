# Analytics Feature Implementation Summary

## Overview

This implementation adds analytics tracking to monitor website visits with and without QR code UTM parameters. Super admins can view detailed statistics on the analytics dashboard.

## What Was Added

### 1. Database Schema Changes

- **New Table: `page_visits`**
  - Tracks all page visits to equipment and exercise pages
  - Captures UTM source (to identify QR code scans)
  - Stores user ID (if logged in), session ID, user agent, IP address, and timestamp
  - Located in: `lib/db/schema/tables.ts`

### 2. Database Migration

- Created migration file: `lib/db/migrations/0001_add_page_visits.sql`
- Updated migration metadata in `lib/db/migrations/meta/`

### 3. API Endpoints

#### Track Visit API (`/api/track-visit`)

- **Method**: POST
- **Purpose**: Records page visits with UTM tracking
- **Data Captured**:
  - Page path
  - UTM source (if present)
  - User ID (if authenticated)
  - Session ID (cookie-based)
  - User agent
  - IP address
- **File**: `app/api/track-visit/route.ts`

#### Analytics API (`/api/analytics`)

- **Method**: GET
- **Purpose**: Retrieves analytics data for super admins
- **Access**: Super admin only
- **Query Parameters**:
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date
  - `path`: Filter by page path pattern
- **Returns**:
  - Total visits with/without QR code
  - Unique visitors (by session)
  - Page-by-page breakdown
  - Daily timeline data
- **File**: `app/api/analytics/route.ts`

### 4. Client-Side Hook

- **Hook**: `useTrackPageVisit()`
- **Purpose**: Automatically tracks page visits when component mounts
- **Usage**: Add to any page component to enable tracking
- **File**: `lib/hooks/useTrackPageVisit.ts`

### 5. Updated Pages with Tracking

The following pages now track visits:

- `/equipments` - Equipment directory page
- `/exercises/dumbbells` - Dumbbell exercises page
- `/exercises/kettlebell` - Kettlebell exercises page
- `/exercises/ab-roller-wheel` - Ab roller exercises page

### 6. Analytics Dashboard

- **Route**: `/analytics`
- **Access**: Super admin only
- **Features**:
  - Summary cards showing:
    - Total visits from QR codes
    - Total visits without QR codes
    - Unique visitors (with/without QR)
    - Total visits
  - Time range filters (7 days, 30 days, all time)
  - Top pages breakdown (QR vs Direct)
  - Timeline showing daily visit trends
- **File**: `app/(main)/analytics/page.tsx`

## How to Use

### For Super Admins

1. Log in with the super admin account (defined in `NEXT_PUBLIC_SUPER_ADMIN_ACCOUNT`)
2. Navigate to the Dashboard
3. Click on "Analytics" card
4. View statistics and filter by date range

### For Developers - Adding Tracking to New Pages

```tsx
import { useTrackPageVisit } from "@/lib/hooks/useTrackPageVisit";

export default function YourPage() {
  // Add this line to track visits
  useTrackPageVisit();

  return (
    // Your page content
  );
}
```

### Testing QR Code Tracking

To test if QR code visits are being tracked correctly:

1. Visit any tracked page with `?utm_source=qr_code` parameter
   - Example: `http://localhost:3000/equipments?utm_source=qr_code`
2. Check the analytics dashboard to see the visit counted under "QR Code" visits

## Database Migration Instructions

### Option 1: Using Drizzle Kit (Recommended)

```bash
# Run migration
pnpm drizzle-kit push
```

### Option 2: Manual Migration

If you encounter PowerShell execution policy issues:

```sql
-- Run this SQL directly in your database
CREATE TABLE IF NOT EXISTS "page_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"page_path" varchar(500) NOT NULL,
	"utm_source" varchar(100),
	"session_id" varchar(255),
	"user_agent" varchar(500),
	"ip_address" varchar(45),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "page_visits"
ADD CONSTRAINT "page_visits_user_id_users_id_fk"
FOREIGN KEY ("user_id")
REFERENCES "public"."users"("id")
ON DELETE SET NULL
ON UPDATE NO ACTION;
```

## Key Features

### Privacy & Session Management

- Session tracking uses secure HTTP-only cookies
- Session expires after 30 minutes of inactivity
- User tracking is optional (works for anonymous visitors)

### Analytics Capabilities

- **UTM Source Tracking**: Distinguishes QR code scans from direct visits
- **Page-Level Insights**: See which equipment pages get the most traffic
- **Trend Analysis**: Track visits over time with daily breakdown
- **Visitor Segmentation**: Separate unique visitors from total pageviews

### Super Admin Protection

- Analytics dashboard is only accessible to super admin account
- API endpoint validates super admin status before returning data
- Returns 403 Forbidden for unauthorized users

## Configuration

### Environment Variables Required

- `NEXT_PUBLIC_SUPER_ADMIN_ACCOUNT`: Email address of the super admin account
- `DATABASE_URL`: PostgreSQL connection string (already configured)

## Files Modified/Created

### New Files

1. `app/api/track-visit/route.ts` - Visit tracking API
2. `app/api/analytics/route.ts` - Analytics data API
3. `app/(main)/analytics/page.tsx` - Analytics dashboard
4. `lib/hooks/useTrackPageVisit.ts` - Tracking hook
5. `lib/db/migrations/0001_add_page_visits.sql` - Database migration
6. `lib/db/migrations/meta/0001_snapshot.json` - Migration metadata

### Modified Files

1. `lib/db/schema/tables.ts` - Added pageVisits table
2. `lib/db/schema/relations.ts` - Added pageVisits relations
3. `app/(main)/equipments/page.tsx` - Added tracking
4. `app/(main)/exercises/dumbbells/page.tsx` - Added tracking
5. `app/(main)/exercises/kettlebell/page.tsx` - Added tracking
6. `app/(main)/exercises/ab-roller-wheel/page.tsx` - Added tracking
7. `lib/db/migrations/meta/_journal.json` - Updated migration journal

## Next Steps

1. Run the database migration
2. Test the tracking by visiting equipment pages with and without `utm_source=qr_code`
3. Log in as super admin and check the analytics dashboard
4. Consider adding tracking to other important pages as needed

## Potential Enhancements (Future)

- Add charts/graphs for better visualization
- Export analytics data to CSV
- Add filters for specific date ranges
- Track individual exercise detail pages
- Add real-time visitor counts
- Email reports to super admin
