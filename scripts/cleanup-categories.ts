import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanupCategories() {
  const client = await pool.connect();
  try {
    // Keep only these 10 categories
    const keepCategories = [
      '홍삼',
      '혈압건강', 
      '영양제',
      '과일선물',
      '화장품',
      '수면건강',
      '차/음료',
      '관절건강',
      '반려동물',
      '생활용품'
    ];

    // Update products with old category IDs to use the new ones FIRST
    // Map old to new: 홍삼/인삼 -> 홍삼
    await client.query(`UPDATE products SET category_id = (SELECT id FROM categories WHERE name = '홍삼') WHERE category_id = 1`);
    await client.query(`UPDATE products SET category_id = (SELECT id FROM categories WHERE name = '영양제') WHERE category_id = 2`);
    await client.query(`UPDATE products SET category_id = (SELECT id FROM categories WHERE name = '영양제') WHERE category_id = 3`);
    await client.query(`UPDATE products SET category_id = (SELECT id FROM categories WHERE name = '영양제') WHERE category_id = 4`);
    await client.query(`UPDATE products SET category_id = (SELECT id FROM categories WHERE name = '관절건강') WHERE category_id = 5`);
    await client.query(`UPDATE products SET category_id = (SELECT id FROM categories WHERE name = '혈압건강') WHERE category_id = 6`);
    console.log('Updated product category references');

    // Delete old categories that are not in the keep list
    const deleteResult = await client.query(`
      DELETE FROM categories 
      WHERE name NOT IN (${keepCategories.map((_, i) => `$${i + 1}`).join(', ')})
    `, keepCategories);
    
    console.log(`Deleted ${deleteResult.rowCount} old categories`);

    // Show final categories
    const final = await client.query('SELECT id, name FROM categories ORDER BY id');
    console.log('\nFinal categories:');
    console.table(final.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanupCategories().catch(console.error);
