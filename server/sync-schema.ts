import pg from "pg";

const connectionString = process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DATABASE_URL is required");
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function syncSchema() {
  console.log("Syncing schema to Supabase...");
  
  try {
    // Add missing columns to products table
    const alterStatements = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description text`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS description_markdown text`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS origin varchar(100) DEFAULT '국내산'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer varchar(100) DEFAULT '웰닉스(주)'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS expiration_info varchar(100) DEFAULT '별도 표시'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS storage_method text`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_info text`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS refund_info text`,
      // Add missing columns to reviews table
      `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS order_item_id integer`,
      `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'`,
      `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'`,
      `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply text`,
      `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply_at timestamp`,
      `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply_by integer`,
      `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true`,
    ];

    for (const sql of alterStatements) {
      try {
        await pool.query(sql);
        console.log(`Executed: ${sql.substring(0, 60)}...`);
      } catch (err: any) {
        if (err.code !== '42701') { // column already exists error
          console.error(`Error: ${err.message}`);
        }
      }
    }

    console.log("Schema sync complete!");
  } catch (error) {
    console.error("Error syncing schema:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

syncSchema();
