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
