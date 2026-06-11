import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;

dotenv.config({ path: ".env.local" });
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Copy .env.example to .env.local and update it.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV !== "test") {
    console.log("Executed query", { text, duration, rows: result.rowCount });
  }

  return result;
}
