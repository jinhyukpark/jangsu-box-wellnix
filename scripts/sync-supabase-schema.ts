import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const { Pool } = pg;

async function syncSchema() {
  const connectionString = process.env.SUPABASE_DATABASE_URL;
  if (!connectionString) {
    throw new Error("SUPABASE_DATABASE_URL is required");
  }

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  const queries = [
    // Add display_order to subscription_plans if not exists
    `ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;`,
    
    // Create main_page_settings table if not exists
    `CREATE TABLE IF NOT EXISTS main_page_settings (
      id SERIAL PRIMARY KEY,
      best_products_criteria VARCHAR(20) DEFAULT 'sales',
      best_products_manual_ids JSONB DEFAULT '[]',
      best_products_limit INTEGER DEFAULT 6,
      ad_banner_image TEXT,
      ad_banner_link TEXT,
      ad_banner_active BOOLEAN DEFAULT true,
      new_products_show BOOLEAN DEFAULT true,
      new_products_limit INTEGER DEFAULT 8,
      events_show BOOLEAN DEFAULT true,
      events_limit INTEGER DEFAULT 4,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`,
    
    // Create event_participants table if not exists
    `CREATE TABLE IF NOT EXISTS event_participants (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES events(id),
      member_id INTEGER REFERENCES members(id),
      status VARCHAR(20) DEFAULT 'registered',
      payment_status VARCHAR(20) DEFAULT 'pending',
      amount_paid INTEGER DEFAULT 0,
      notes TEXT,
      registered_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
      console.log("Executed:", query.substring(0, 60) + "...");
    } catch (err: any) {
      console.log("Note:", err.message);
    }
  }

  await pool.end();
  console.log("Schema sync complete!");
}

syncSchema().catch(console.error);
