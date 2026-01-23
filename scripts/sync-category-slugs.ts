import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// CategoryGrid.tsx와 동일한 slug 매핑
const categorySlugMap: Record<string, string> = {
  "홍삼": "hongsam",
  "홍삼/인삼": "hongsam",
  "혈압건강": "blood-pressure",
  "혈행/혈압": "blood-pressure",
  "영양제": "supplements",
  "비타민/미네랄": "supplements",
  "과일선물": "fruit-gift",
  "화장품": "cosmetics",
  "수면건강": "sleep-health",
  "차/음료": "tea-drinks",
  "관절건강": "joint-health",
  "관절/뼈 건강": "joint-health",
  "반려동물": "pets",
  "생활용품": "living-goods",
  "건강즙": "juice",
  "프로바이오틱스": "probiotics",
};

async function syncCategorySlugs() {
  const client = await pool.connect();
  try {
    // 현재 카테고리 조회
    const result = await client.query('SELECT id, name, slug FROM categories ORDER BY id');
    console.log('현재 카테고리:');
    console.table(result.rows);

    // slug 업데이트
    for (const cat of result.rows) {
      const newSlug = categorySlugMap[cat.name];
      if (newSlug && newSlug !== cat.slug) {
        await client.query('UPDATE categories SET slug = $1 WHERE id = $2', [newSlug, cat.id]);
        console.log(`Updated: ${cat.name} (${cat.slug} -> ${newSlug})`);
      }
    }

    // 결과 확인
    const updated = await client.query('SELECT id, name, slug FROM categories ORDER BY id');
    console.log('\n업데이트된 카테고리:');
    console.table(updated.rows);

  } finally {
    client.release();
    await pool.end();
  }
}

syncCategorySlugs().catch(console.error);
