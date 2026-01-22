const pg = require('pg');

const connectionString = process.env.SUPABASE_DATABASE_URL;
if (!connectionString) {
  console.error("SUPABASE_DATABASE_URL is required");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

async function dropColumns() {
  try {
    console.log("Dropping title and subtitle columns from subscription_banners...");
    await pool.query(`
      ALTER TABLE subscription_banners 
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS subtitle
    `);
    console.log("Columns dropped successfully!");
  } catch (error) {
    console.error("Error dropping columns:", error.message);
  } finally {
    await pool.end();
  }
}

dropColumns();
