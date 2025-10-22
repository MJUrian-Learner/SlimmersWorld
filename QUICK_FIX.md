# Quick Fix: Apply Analytics Migration

## The Problem

```
Error: relation "qr_scans" does not exist
```

The `qr_scans` table hasn't been created in your database yet.

---

## ⚡ Quick Solutions (Choose ONE)

### 1️⃣ EASIEST: Run the Migration Script

```bash
npm run db:migrate:analytics
```

This will:

- ✅ Drop the old `page_visits` table
- ✅ Create the new `qr_scans` table
- ✅ Create all indexes
- ✅ Verify everything worked

---

### 2️⃣ ALTERNATIVE: Use Drizzle Push

```bash
npm run db:push
```

This will automatically sync your schema with the database.

---

### 3️⃣ MANUAL: Copy & Paste SQL

Open your database client (Supabase, pgAdmin, psql, etc.) and run:

```sql
-- Drop old table
DROP TABLE IF EXISTS "page_visits" CASCADE;

-- Create new table
CREATE TABLE "qr_scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"exercise_path" varchar(500) NOT NULL,
	"exercise_name" varchar(255),
	"equipment_type" varchar(100),
	"session_id" varchar(255) NOT NULL,
	"user_agent" varchar(500),
	"ip_address" varchar(45),
	"scanned_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
  ON DELETE set null ON UPDATE no action;

-- Create indexes
CREATE INDEX "qr_scans_scanned_at_idx" ON "qr_scans" ("scanned_at");
CREATE INDEX "qr_scans_session_id_idx" ON "qr_scans" ("session_id");
CREATE INDEX "qr_scans_equipment_type_idx" ON "qr_scans" ("equipment_type");
CREATE INDEX "qr_scans_exercise_path_idx" ON "qr_scans" ("exercise_path");
```

---

## After Running Migration

1. **Restart your dev server** (if it's running)
2. **Refresh the analytics page**
3. **Test by scanning a QR code** with `?utm_source=qr_code`

---

## Verify It Worked

Run this to check:

```sql
SELECT COUNT(*) FROM qr_scans;
```

Should return `0` (table exists but empty).

---

## Still Having Issues?

Check:

1. ✅ Database connection in `.env.local`
2. ✅ Database is running
3. ✅ You have CREATE/DROP permissions

See `MIGRATION_GUIDE.md` for detailed troubleshooting.
