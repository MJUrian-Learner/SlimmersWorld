import { drizzle } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client);

async function resetDatabase() {
  await db.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
  await db.execute("DROP SCHEMA IF EXISTS drizzle CASCADE;");
}

resetDatabase().then(() => process.exit(0));
