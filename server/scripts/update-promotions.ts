/**
 * 기존 promotions 테이블 데이터를 업데이트하는 스크립트
 * 실행: npx tsx server/scripts/update-promotions.ts
 */
import { db } from "../db";
import { promotions } from "@shared/schema";
import { eq } from "drizzle-orm";

const SUPABASE_URL = "https://iquuynjyrvsnpvpijbql.supabase.co";
const getImageUrl = (filename: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/_public/images/${filename}`;

async function updatePromotions() {
  console.log("Updating promotions data...");

  // seol-gift 업데이트
  await db.update(promotions)
    .set({
      title: "2026 설 선물세트",
      heroImage: getImageUrl("luxury_korean_health_gift_set.png"),
      bannerImages: [
        getImageUrl("luxury_korean_health_gift_set.png"),
        getImageUrl("premium_luxury_gift_box.png"),
      ],
      benefits: [
        { title: "얼리버드 혜택", description: "1.12 ~ 1.29 기간 주문 시 추가 할인" },
        { title: "보자기 포장 제공", description: "100% 국내산 보자기 포장 제공" },
        { title: "세뱃돈 봉투 3종", description: "프리미엄 세트 구매 시 증정" },
      ],
    })
    .where(eq(promotions.slug, "seol-gift"));
  console.log("✓ seol-gift updated");

  // jangsu-box 업데이트
  await db.update(promotions)
    .set({
      heroImage: getImageUrl("happy_seniors_opening_gift_box.png"),
      bannerImages: [
        getImageUrl("happy_seniors_opening_gift_box.png"),
        getImageUrl("korean_health_gift_set.png"),
      ],
      benefits: [
        { title: "정기 배송 할인", description: "매월 10% 추가 할인 적용" },
        { title: "무료 배송", description: "전 상품 무료 배송" },
        { title: "구독 선물", description: "3개월 구독 시 건강즙 세트 증정" },
      ],
    })
    .where(eq(promotions.slug, "jangsu-box"));
  console.log("✓ jangsu-box updated");

  // health-travel 업데이트
  await db.update(promotions)
    .set({
      heroImage: getImageUrl("korean_temple_autumn_travel.png"),
      bannerImages: [
        getImageUrl("korean_temple_autumn_travel.png"),
      ],
      benefits: [
        { title: "휴대용 세트", description: "여행에 편리한 휴대용 포장" },
        { title: "여행 할인", description: "여행 시즌 특별 할인" },
      ],
    })
    .where(eq(promotions.slug, "health-travel"));
  console.log("✓ health-travel updated");

  // popular 업데이트
  await db.update(promotions)
    .set({
      heroImage: getImageUrl("korean_red_ginseng_roots.png"),
      bannerImages: [
        getImageUrl("korean_red_ginseng_roots.png"),
        getImageUrl("vitamin_supplements_pills.png"),
      ],
      benefits: [
        { title: "베스트셀러", description: "검증된 인기 상품만 모았습니다" },
        { title: "고객 후기", description: "수천 건의 실제 구매 후기" },
      ],
    })
    .where(eq(promotions.slug, "popular"));
  console.log("✓ popular updated");

  console.log("\n✅ All promotions updated successfully!");
}

updatePromotions().catch(console.error);
