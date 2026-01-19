import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateCategories() {
  const client = await pool.connect();
  try {
    const newCategories = [
      { name: '홍삼', slug: 'hongsam' },
      { name: '혈압건강', slug: 'blood-pressure' },
      { name: '영양제', slug: 'supplements' },
      { name: '과일선물', slug: 'fruit-gift' },
      { name: '화장품', slug: 'cosmetics' },
      { name: '수면건강', slug: 'sleep-health' },
      { name: '차/음료', slug: 'tea-drinks' },
      { name: '관절건강', slug: 'joint-health' },
      { name: '반려동물', slug: 'pets' },
      { name: '생활용품', slug: 'living-goods' }
    ];

    // Get existing categories
    const existing = await client.query('SELECT id, name FROM categories ORDER BY id');
    console.log('Existing categories:');
    console.table(existing.rows);

    // Add missing categories
    for (const cat of newCategories) {
      const exists = existing.rows.find(c => c.name === cat.name);
      if (!exists) {
        await client.query('INSERT INTO categories (name, slug) VALUES ($1, $2)', [cat.name, cat.slug]);
        console.log(`Added: ${cat.name}`);
      }
    }

    // Show final categories
    const final = await client.query('SELECT id, name FROM categories ORDER BY id');
    console.log('\nFinal categories:');
    console.table(final.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

updateCategories().catch(console.error);
