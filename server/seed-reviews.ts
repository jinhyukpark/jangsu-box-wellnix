import { db } from "./db";
import { products } from "@shared/schema";
import { sql } from "drizzle-orm";

const sampleImages = [
  "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
  "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
  "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400",
];

const sampleVideos = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/jNQXAC9IVRw",
];

const reviewContents = [
  "정말 좋은 상품이에요! 부모님께 선물했는데 너무 좋아하세요. 포장도 깔끔하고 배송도 빨랐습니다. 다음에도 또 구매할 예정이에요.",
  "매일 아침 먹고 있는데 확실히 컨디션이 좋아진 것 같아요. 맛도 괜찮고 먹기 편해요. 추천합니다!",
  "어머니 생신 선물로 구매했어요. 품질이 좋고 가격도 합리적이라 만족합니다. 포장도 고급스러워요.",
  "건강을 위해 꾸준히 먹고 있어요. 효과를 느끼고 있고 가성비도 좋습니다. 재구매 의사 있어요!",
  "친구 추천으로 구매했는데 정말 좋네요. 배송도 빠르고 제품 퀄리티도 훌륭합니다.",
  "온 가족이 함께 먹고 있어요. 아이들도 맛있게 먹어요. 건강해지는 느낌이 들어 좋아요.",
  "선물용으로 여러 번 구매했어요. 받으시는 분들마다 좋아하세요. 포장이 예뻐서 선물하기 좋아요.",
  "처음 먹어보는데 생각보다 맛있어요. 꾸준히 먹어볼 예정입니다. 건강에 좋다니 기대됩니다.",
  "할머니께서 드시는데 입맛에 맞으시대요. 소화도 잘 되고 좋다고 하시네요. 감사합니다!",
  "다른 제품들도 써봤는데 이게 제일 좋은 것 같아요. 가격 대비 품질이 훌륭합니다.",
  "매일 꾸준히 복용 중인데 피로감이 확실히 줄었어요. 건강해지는 느낌! 추천해요.",
  "시어머니 선물로 샀는데 너무 좋아하세요. 다음에 또 사드려야겠어요.",
];


async function seedReviews() {
  console.log("Seeding reviews with images and videos...");
  
  try {
    console.log("Fixing column types for images and videos...");
    try {
      await db.execute(sql`ALTER TABLE reviews ALTER COLUMN images DROP DEFAULT`);
      await db.execute(sql`ALTER TABLE reviews ALTER COLUMN videos DROP DEFAULT`);
      await db.execute(sql`ALTER TABLE reviews ALTER COLUMN images TYPE jsonb USING COALESCE(images::text, '[]')::jsonb`);
      await db.execute(sql`ALTER TABLE reviews ALTER COLUMN videos TYPE jsonb USING COALESCE(videos::text, '[]')::jsonb`);
      await db.execute(sql`ALTER TABLE reviews ALTER COLUMN images SET DEFAULT '[]'::jsonb`);
      await db.execute(sql`ALTER TABLE reviews ALTER COLUMN videos SET DEFAULT '[]'::jsonb`);
    } catch (e) {
      console.log("Column types already correct or migration done");
    }
    console.log("Column types fixed!");
    
    const allProducts = await db.select().from(products);
    console.log(`Found ${allProducts.length} products`);
    
    for (const product of allProducts) {
      console.log(`Adding reviews for product: ${product.name}`);
      
      for (let i = 0; i < 12; i++) {
        const hasImages = Math.random() > 0.3;
        const hasVideos = Math.random() > 0.7;
        
        const reviewImages = hasImages 
          ? sampleImages.slice(0, Math.floor(Math.random() * 3) + 1)
          : [];
        
        const reviewVideos = hasVideos
          ? sampleVideos.slice(0, 1)
          : [];

        const rating = Math.floor(Math.random() * 2) + 4;
        const daysAgo = Math.floor(Math.random() * 60);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);

        await db.execute(sql`
          INSERT INTO reviews (product_id, member_id, rating, content, is_visible, created_at)
          VALUES (${product.id}, 1, ${rating}, ${reviewContents[i % reviewContents.length]}, true, NOW())
        `);
        
        const lastReview = await db.execute(sql`SELECT id FROM reviews ORDER BY id DESC LIMIT 1`);
        const reviewId = (lastReview.rows[0] as any).id;
        
        if (reviewImages.length > 0 || reviewVideos.length > 0) {
          await db.execute(sql`
            UPDATE reviews SET 
              images = ${JSON.stringify(reviewImages)}::jsonb,
              videos = ${JSON.stringify(reviewVideos)}::jsonb
            WHERE id = ${reviewId}
          `);
        }
      }
    }
    
    console.log("Successfully seeded reviews for all products!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding reviews:", error);
    process.exit(1);
  }
}

seedReviews();
