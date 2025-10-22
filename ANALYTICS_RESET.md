# Analytics System Reset - QR Code Tracking

## Overview

The analytics system has been completely reset and redesigned to focus exclusively on QR code scan tracking and exercise engagement metrics. The old `page_visits` table has been replaced with a new `qr_scans` table optimized for tracking QR code scans.

## What Changed

### Database Schema

**Old Table:** `page_visits`

- Tracked all page visits (with and without QR codes)
- Mixed QR and non-QR visit data
- Generic `page_path` field

**New Table:** `qr_scans`

- Tracks **only** QR code scans
- Exercise-specific fields: `exercise_path`, `exercise_name`, `equipment_type`
- Better indexing for performance
- Session-based unique user tracking

### Migration

Run this migration to update your database:

```bash
npm run db:migrate
```

Or manually apply: `lib/db/migrations/0003_reset_analytics.sql`

**⚠️ Warning:** This migration **drops the old `page_visits` table** and all existing data. Make a backup if you need to preserve historical data.

## New Analytics Metrics

### 1. Total Scans

- Overall count of all QR code scans
- Indicates total engagement with the exercise system

### 2. Unique Scanners

- Number of unique users (by session) who scanned QR codes
- Represents actual individual user engagement

### 3. Weekly Active Users (WAU)

- Unique users who scanned in the last 7 days
- Short-term engagement metric

### 4. Monthly Active Users (MAU)

- Unique users who scanned in the last 30 days
- Long-term engagement metric

### 5. Scans Per Exercise

- Breakdown of scans by individual exercise
- Shows which exercises are most/least popular
- Includes exercise name, equipment type, and path

### 6. Scans by Equipment Type

- Aggregated scans grouped by equipment (Dumbbells, Kettlebell, Ab Roller)
- Identifies most popular equipment categories

### 7. Daily Activity Timeline

- Daily breakdown of scans and unique users
- Shows activity trends over time
- Includes average scans per user per day

## API Changes

### Track Visit Endpoint

**Endpoint:** `POST /api/track-visit`

**Old Payload:**

```json
{
  "pagePath": "/exercises/dumbbells",
  "utmSource": "qr_code"
}
```

**New Payload:**

```json
{
  "exercisePath": "/exercises/dumbbells/bicep-curl",
  "exerciseName": "Bicep Curl",
  "equipmentType": "Dumbbells"
}
```

**Note:** The endpoint now **only tracks visits with `utm_source=qr_code`**. Non-QR visits are ignored.

### Analytics Endpoint

**Endpoint:** `GET /api/analytics`

**Query Parameters:**

- `startDate` - Filter scans from this date (ISO format)
- `endDate` - Filter scans until this date (ISO format)

**Old Response:**

```json
{
  "summary": {
    "totalVisitsWithQR": 150,
    "totalVisitsWithoutQR": 200,
    "uniqueVisitorsWithQR": 50,
    "uniqueVisitorsWithoutQR": 80,
    "totalVisits": 350
  },
  "pageBreakdown": { ... },
  "timeline": [ ... ]
}
```

**New Response:**

```json
{
  "summary": {
    "totalScans": 150,
    "uniqueScanners": 50,
    "weeklyActiveUsers": 30,
    "monthlyActiveUsers": 50
  },
  "scansPerExercise": [
    {
      "exerciseName": "Bicep Curl",
      "exercisePath": "/exercises/dumbbells/bicep-curl",
      "equipmentType": "Dumbbells",
      "count": 45
    }
  ],
  "scansByEquipment": [
    {
      "equipmentType": "Dumbbells",
      "count": 80
    }
  ],
  "dailyActiveUsers": [
    {
      "date": "2025-10-22",
      "count": 15
    }
  ],
  "dailyScans": [
    {
      "date": "2025-10-22",
      "scans": 45,
      "uniqueUsers": 15
    }
  ]
}
```

## Frontend Changes

### useTrackPageVisit Hook

The hook now:

1. **Only tracks if `utm_source=qr_code`** is present in the URL
2. Automatically extracts exercise and equipment information from the URL path
3. Sends the structured data to the tracking endpoint

**Example URL:**

```
/exercises/dumbbells/bicep-curl?utm_source=qr_code
```

**Extracted Data:**

- `exercisePath`: `/exercises/dumbbells/bicep-curl`
- `exerciseName`: `Bicep Curl`
- `equipmentType`: `Dumbbells`

### Analytics Dashboard

The dashboard now shows:

- 4 summary cards: Total Scans, Unique Scanners, Weekly Active Users, Monthly Active Users
- Top Exercises list with scan counts
- Scans by Equipment breakdown
- Daily Activity timeline with scans and unique users

## How to Apply Changes

### 1. Backup Existing Data (Optional)

```sql
-- Backup old page_visits data
CREATE TABLE page_visits_backup AS SELECT * FROM page_visits;
```

### 2. Run the Migration

```bash
npm run db:migrate
```

Or manually execute the SQL file:

```bash
psql -U your_user -d your_database -f lib/db/migrations/0003_reset_analytics.sql
```

### 3. Verify the Migration

```sql
-- Check if new table exists
\d qr_scans

-- Check indexes
\di qr_scans*
```

### 4. Test the System

1. Scan a QR code with `utm_source=qr_code` parameter
2. Check the analytics dashboard
3. Verify data is being tracked correctly

## Session Tracking

The system uses cookies to track unique users:

**Cookie Name:** `qr_scan_session_id`
**Duration:** 24 hours
**Purpose:** Identify unique daily active users

This allows accurate tracking of:

- Daily Active Users (unique sessions per day)
- Weekly Active Users (unique sessions in 7 days)
- Monthly Active Users (unique sessions in 30 days)

## Performance Optimizations

The new schema includes indexes on:

- `scanned_at` - For date range queries
- `session_id` - For unique user counting
- `equipment_type` - For equipment breakdown
- `exercise_path` - For exercise-specific queries

## Files Modified

### Database Schema

- `lib/db/schema/tables.ts` - Updated table definition
- `lib/db/schema/relations.ts` - Updated relations
- `lib/db/migrations/0003_reset_analytics.sql` - Migration file
- `lib/db/migrations/meta/_journal.json` - Migration journal
- `lib/db/migrations/meta/0003_snapshot.json` - Schema snapshot

### API Routes

- `app/api/track-visit/route.ts` - QR scan tracking
- `app/api/analytics/route.ts` - Analytics data retrieval

### Frontend

- `lib/hooks/useTrackPageVisit.ts` - QR-only tracking logic
- `app/(main)/analytics/page.tsx` - Analytics dashboard UI

## Troubleshooting

### Migration Fails

- Check database connection in `.env.local`
- Ensure you have proper permissions to drop tables
- Verify no active connections to `page_visits` table

### No Data Showing

- Ensure QR codes have `utm_source=qr_code` parameter
- Check browser console for tracking errors
- Verify cookie is being set correctly

### Analytics Not Loading

- Check if user is super admin (matches `NEXT_PUBLIC_SUPER_ADMIN_ACCOUNT`)
- Verify database connection
- Check browser network tab for API errors

## Future Enhancements

Potential features to add:

- Export analytics data to CSV
- Custom date range picker
- Exercise popularity trends over time
- User retention metrics
- Geographic distribution (if IP tracking enabled)
- Peak usage time analysis
