import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedMembers() {
  const client = await pool.connect();
  try {
    const testMembers = [
      { email: 'kim.minho@test.com', name: '김민호', phone: '010-1234-5678', membershipLevel: '실버', mileage: 1500 },
      { email: 'lee.sunja@test.com', name: '이순자', phone: '010-2345-6789', membershipLevel: '골드', mileage: 5200 },
      { email: 'park.younghee@test.com', name: '박영희', phone: '010-3456-7890', membershipLevel: '일반', mileage: 800 },
      { email: 'choi.dongsu@test.com', name: '최동수', phone: '010-4567-8901', membershipLevel: 'VIP', mileage: 12000 },
      { email: 'jung.miok@test.com', name: '정미옥', phone: '010-5678-9012', membershipLevel: '실버', mileage: 2300 },
    ];

    for (const member of testMembers) {
      await client.query(`
        INSERT INTO members (email, password, name, phone, status, membership_level, mileage, email_verified, created_at)
        VALUES ($1, '$2a$10$N9qo8uLOickgx2ZMRZoMye3Z6/r8B5Xp1qXpP/O7.CYx7FvbWP8Oy', $2, $3, 'active', $4, $5, true, NOW())
        ON CONFLICT (email) DO NOTHING
      `, [member.email, member.name, member.phone, member.membershipLevel, member.mileage]);
      console.log(`Added member: ${member.name}`);
    }

    const result = await client.query('SELECT id, name, email, membership_level, mileage FROM members ORDER BY id');
    console.log('\nAll members:');
    console.table(result.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

seedMembers().catch(console.error);
