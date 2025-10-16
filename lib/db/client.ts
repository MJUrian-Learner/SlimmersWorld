import { drizzle } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
