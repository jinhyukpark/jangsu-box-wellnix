import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixHeroTextColor() {
  const client = await pool.connect();
  try {
    await client.query(`UPDATE site_branding SET text_color = '#ffffff' WHERE key = 'hero'`);
    console.log('Updated hero text color to white');
    
    const result = await client.query('SELECT key, text_color FROM site_branding WHERE key = $1', ['hero']);
    console.log('Result:', result.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

fixHeroTextColor().catch(console.error);
