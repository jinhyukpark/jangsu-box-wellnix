import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or SUPABASE_DATABASE_URL is not set");
}

const useSSL = !process.env.DATABASE_URL && process.env.SUPABASE_DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
