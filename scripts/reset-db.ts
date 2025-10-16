import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

async function resetDatabase() {
  await db.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
  await db.execute("DROP SCHEMA IF EXISTS drizzle CASCADE;");
}

resetDatabase().then(() => process.exit(0));
