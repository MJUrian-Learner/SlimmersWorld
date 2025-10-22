# Migration Guide: Apply Analytics Reset

## Problem

The `qr_scans` table doesn't exist in your database. You need to run the migration to create it.

## Solutions

### ✅ Option 1: Using Drizzle Kit Push (Easiest)

This automatically syncs your schema with the database:

```bash
cd e:\Projects\MJ\SlimmersWorld
npx drizzle-kit push
```

When prompted, review the changes and type `yes` to apply them.

---

### ✅ Option 2: Using psql (Direct SQL)

If you have PostgreSQL installed locally:

1. **Get your database connection details** from `.env.local`:

   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Run the migration SQL**:

   ```bash
   psql "postgresql://user:password@host:port/database" -f lib/db/migrations/0003_reset_analytics.sql
   ```

   Or connect first, then run:

   ```bash
   psql "postgresql://user:password@host:port/database"
   \i lib/db/migrations/0003_reset_analytics.sql
   ```

---

### ✅ Option 3: Using Supabase Dashboard

If you're using Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `lib/db/migrations/0003_reset_analytics.sql`
4. Paste and run the SQL query

---

### ✅ Option 4: Using Node.js Script

Create a quick migration script:

**File: `scripts/apply-migration.ts`**

```typescript
import { db } from "@/lib/db/client";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function applyMigration() {
  try {
    console.log("Reading migration file...");
    const migrationPath = path.join(
      process.cwd(),
      "lib/db/migrations/0003_reset_analytics.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("Applying migration...");

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await db.execute(sql.raw(statement));
    }

    console.log("✅ Migration applied successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
```

Then run:

```bash
npx tsx scripts/apply-migration.ts
```

---

### ✅ Option 5: Manual SQL Execution

Copy this SQL and run it in any PostgreSQL client:

```sql
-- Drop old page_visits table and create new qr_scans table

-- Drop the old table
DROP TABLE IF EXISTS "page_visits" CASCADE;

-- Create new qr_scans table
CREATE TABLE IF NOT EXISTS "qr_scans" (
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

-- Add foreign key constraint
DO $$ BEGIN
 ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "qr_scans_scanned_at_idx" ON "qr_scans" ("scanned_at");
CREATE INDEX IF NOT EXISTS "qr_scans_session_id_idx" ON "qr_scans" ("session_id");
CREATE INDEX IF NOT EXISTS "qr_scans_equipment_type_idx" ON "qr_scans" ("equipment_type");
CREATE INDEX IF NOT EXISTS "qr_scans_exercise_path_idx" ON "qr_scans" ("exercise_path");
```

---

## Verify the Migration

After applying, verify the table was created:

```sql
-- Check if table exists
SELECT * FROM qr_scans LIMIT 1;

-- Check table structure
\d qr_scans

-- Check indexes
\di qr_scans*
```

Or using Drizzle:

```bash
npx drizzle-kit studio
```

This opens a web UI to view your database schema.

---

## Troubleshooting

### Error: "permission denied"

- Ensure your database user has CREATE and DROP permissions
- Try running with a superuser account

### Error: "database connection failed"

- Check your `DATABASE_URL` in `.env.local`
- Ensure the database is running
- Verify network connectivity

### Error: "relation page_visits does not exist"

- This is okay! The migration handles this with `IF EXISTS`
- Just proceed with the migration

### PowerShell Execution Policy Error

Run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## After Migration

1. **Restart your Next.js dev server**:

   ```bash
   npm run dev
   ```

2. **Test the analytics page**:

   - Navigate to `/analytics` as super admin
   - You should see the new metrics (currently all zeros)

3. **Test QR scan tracking**:
   - Visit any exercise page with `?utm_source=qr_code`
   - Check analytics dashboard to see the scan recorded

---

## Need Help?

If you're still having issues:

1. **Share your DATABASE_URL format** (without credentials):

   - Is it local PostgreSQL?
   - Is it Supabase?
   - Is it another cloud provider?

2. **Check if you can connect to the database**:

   ```bash
   psql "your-database-url" -c "SELECT version();"
   ```

3. **Try the simplest option first**: Drizzle Kit Push
   ```bash
   npx drizzle-kit push
   ```
