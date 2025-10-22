import { config } from "dotenv";
import postgres from "postgres";
import fs from "fs";
import path from "path";

// Load environment variables
config({ path: [".env.local", ".env.development"] });

async function applyMigration() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    console.error("Please check your .env.local file");
    process.exit(1);
  }

  console.log("🔄 Connecting to database...");
  const sql = postgres(DATABASE_URL);

  try {
    console.log("📖 Reading migration file...");
    const migrationPath = path.join(
      process.cwd(),
      "lib/db/migrations/0003_reset_analytics.sql"
    );

    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found: ${migrationPath}`);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("⚠️  WARNING: This migration will DROP the page_visits table!");
    console.log("⚠️  All existing page visit data will be LOST!");
    console.log("");
    console.log("📋 Migration preview:");
    console.log("  - DROP TABLE page_visits");
    console.log("  - CREATE TABLE qr_scans");
    console.log("  - CREATE 4 indexes");
    console.log("");

    // In production, you might want to add a confirmation prompt here
    // For now, we'll proceed automatically

    console.log("🚀 Applying migration...");

    // Execute the entire migration as a single transaction
    await sql.begin(async (sql) => {
      // Split by semicolon but be careful with DO blocks
      const statements = migrationSQL
        .split(/;(?=\s*(?:--|CREATE|DROP|ALTER|DO))/gi)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.match(/^--.*$/));

      for (const statement of statements) {
        if (statement.startsWith("--")) continue;

        const preview = statement.substring(0, 60).replace(/\s+/g, " ");
        console.log(`  ⚙️  ${preview}...`);

        await sql.unsafe(statement + ";");
      }
    });

    console.log("");
    console.log("✅ Migration applied successfully!");
    console.log("");
    console.log("📊 Verifying table creation...");

    // Verify the table was created
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'qr_scans'
    `;

    if (result.length > 0) {
      console.log("✅ qr_scans table created successfully");
    } else {
      console.warn("⚠️  Could not verify qr_scans table creation");
    }

    // Check indexes
    const indexes = await sql`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'qr_scans'
    `;

    console.log(`✅ ${indexes.length} indexes created`);
    indexes.forEach((idx) => {
      console.log(`   - ${idx.indexname}`);
    });

    console.log("");
    console.log("🎉 All done! You can now:");
    console.log("   1. Restart your Next.js dev server");
    console.log("   2. Visit /analytics page");
    console.log("   3. Test QR code scanning with ?utm_source=qr_code");
  } catch (error) {
    console.error("");
    console.error("❌ Migration failed:");
    console.error(error);
    console.error("");
    console.error("Troubleshooting:");
    console.error("  1. Check your DATABASE_URL in .env.local");
    console.error("  2. Ensure database is running and accessible");
    console.error("  3. Verify you have CREATE/DROP permissions");
    console.error("  4. Try running: npx drizzle-kit push");
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the migration
console.log("🔧 Analytics Reset Migration");
console.log("════════════════════════════════");
console.log("");

applyMigration();
