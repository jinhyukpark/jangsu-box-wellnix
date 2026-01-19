import { db } from "./db";
import { 
  categories, 
  products, 
  subscriptionPlans, 
  events,
  monthlyBoxes,
  notices,
  faqs,
  admins,
  promotions
} from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existingCategories = await db.select().from(categories);
  if (existingCategories.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin1234", 10);
  await db.insert(admins).values({
    email: "admin@wellnix.kr",
    password: hashedPassword,
    name: "슈퍼관리자",
    role: "슈퍼 관리자",
    permissions: ["all"],
  });

  const insertedCategories = await db.insert(categories).values([
    { name: "홍삼/인삼", slug: "ginseng", displayOrder: 1 },
    { name: "비타민/미네랄", slug: "vitamins", displayOrder: 2 },
    { name: "건강즙", slug: "juice", displayOrder: 3 },
    { name: "프로바이오틱스", slug: "probiotics", displayOrder: 4 },
    { name: "관절/뼈 건강", slug: "joint", displayOrder: 5 },
    { name: "혈행/혈압", slug: "blood", displayOrder: 6 },
  ]).returning();

  await db.insert(products).values([
    {
      name: "정관장 홍삼정 에브리타임",
      description: "6년근 홍삼을 휴대하기 좋은 스틱 포장으로 간편하게 즐기세요.",
      categoryId: insertedCategories[0].id,
      price: 89000,
      originalPrice: 120000,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      stock: 100,
      rating: "4.8",
      reviewCount: 324,
      isFeatured: true,
    },
    {
      name: "고려홍삼 6년근 진액",
      description: "국내산 6년근 홍삼을 정성껏 달여 만든 프리미엄 진액입니다.",
      categoryId: insertedCategories[0].id,
      price: 159000,
      originalPrice: 200000,
      image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400",
      stock: 50,
      rating: "4.9",
      reviewCount: 156,
      isFeatured: true,
    },
    {
      name: "종합 비타민 50+ 플러스",
      description: "50대 이상 어르신을 위한 맞춤 종합 비타민입니다.",
      categoryId: insertedCategories[1].id,
      price: 45000,
      originalPrice: 55000,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      stock: 200,
      rating: "4.6",
      reviewCount: 89,
      isFeatured: true,
    },
    {
      name: "산수유 건강즙",
      description: "100% 국내산 산수유로 만든 건강즙입니다.",
      categoryId: insertedCategories[2].id,
      price: 78000,
      image: "https://images.unsplash.com/photo-1622597467836-f3e82dfc0ebe?w=400",
      stock: 80,
      rating: "4.7",
      reviewCount: 67,
    },
    {
      name: "프로바이오틱스 골드",
      description: "500억 CFU 유산균으로 장 건강을 지켜드립니다.",
      categoryId: insertedCategories[3].id,
      price: 55000,
      originalPrice: 65000,
      image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400",
      stock: 150,
      rating: "4.5",
      reviewCount: 234,
      isFeatured: true,
    },
    {
      name: "MSM 관절 건강",
      description: "관절 연골 건강에 도움을 주는 MSM 보충제입니다.",
      categoryId: insertedCategories[4].id,
      price: 42000,
      image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400",
      stock: 90,
      rating: "4.4",
      reviewCount: 45,
    },
    {
      name: "오메가3 트리플 파워",
      description: "EPA, DHA, 비타민D를 한 번에 섭취할 수 있는 프리미엄 오메가3입니다.",
      categoryId: insertedCategories[5].id,
      price: 65000,
      originalPrice: 80000,
      image: "https://images.unsplash.com/photo-1535185384036-28bbc8035f28?w=400",
      stock: 120,
      rating: "4.7",
      reviewCount: 178,
      isFeatured: true,
    },
  ]);

  await db.insert(subscriptionPlans).values([
    {
      name: "효심박스",
      slug: "hyosim",
      price: 89000,
      originalPrice: 110000,
      description: "부모님께 드리는 기본 건강 선물 세트",
      features: ["홍삼 제품 1종", "비타민 1종", "건강즙 1종", "감사 카드"],
    },
    {
      name: "장수박스",
      slug: "jangsu",
      price: 159000,
      originalPrice: 200000,
      description: "인기 No.1! 건강과 정성을 담은 프리미엄 세트",
      features: ["프리미엄 홍삼 1종", "비타민/미네랄 2종", "건강즙 2종", "프로바이오틱스 1종", "감사 카드", "고급 포장"],
      isPopular: true,
    },
    {
      name: "천수박스",
      slug: "cheonsu",
      price: 289000,
      originalPrice: 350000,
      description: "최고급 건강 선물! VIP 고객님을 위한 특별 구성",
      features: ["VIP 전용 프리미엄 홍삼", "종합 비타민 세트", "프리미엄 건강즙 3종", "프로바이오틱스", "관절 건강 제품", "개인 맞춤 상담", "VIP 포장", "무료 배송"],
    },
  ]);

  await db.insert(monthlyBoxes).values([
    {
      month: "1",
      year: 2026,
      theme: "새해 건강 다짐 특별 구성",
      highlight: "6년근 홍삼정 + 비타민D 3000IU",
      description: "새해를 맞아 건강한 한 해를 시작하세요!",
    },
    {
      month: "2",
      year: 2026,
      theme: "설날 효도 선물 세트",
      highlight: "프리미엄 홍삼 + 관절 건강 세트",
      description: "설날에는 건강을 선물하세요.",
    },
  ]);

  await db.insert(events).values([
    {
      title: "2026 신년 건강 세미나",
      description: "건강한 새해를 시작하는 방법! 전문의와 함께하는 건강 강좌입니다.",
      date: new Date("2026-01-25T14:00:00"),
      time: "14:00 - 16:00",
      location: "웰닉스 서울센터",
      locationType: "offline",
      tag: "세미나",
      category: "건강강좌",
      maxParticipants: 50,
      currentParticipants: 23,
      status: "recruiting",
    },
    {
      title: "홍삼 건강법 온라인 클래스",
      description: "홍삼의 효능과 올바른 섭취법을 배워보세요.",
      date: new Date("2026-02-10T10:00:00"),
      time: "10:00 - 11:30",
      location: "Zoom 온라인",
      locationType: "online",
      tag: "클래스",
      category: "건강강좌",
      maxParticipants: 100,
      currentParticipants: 45,
      status: "recruiting",
    },
    {
      title: "시니어 요가 체험 클래스",
      description: "시니어 맞춤형 요가 프로그램으로 몸과 마음을 건강하게!",
      date: new Date("2026-02-15T09:00:00"),
      time: "09:00 - 10:30",
      location: "웰닉스 부산센터",
      locationType: "offline",
      tag: "체험",
      category: "운동",
      maxParticipants: 30,
      currentParticipants: 28,
      status: "recruiting",
    },
  ]);

  await db.insert(notices).values([
    {
      title: "2026년 설 명절 배송 안내",
      content: "설 명절을 맞아 배송 일정을 안내드립니다. 1월 25일 이전 주문 건은 설 전 배송됩니다.",
      category: "배송",
      isImportant: true,
    },
    {
      title: "웰닉스 신규 회원 혜택 안내",
      content: "신규 가입 시 5,000원 적립금과 첫 구매 10% 할인 쿠폰을 드립니다.",
      category: "이벤트",
    },
    {
      title: "개인정보처리방침 개정 안내",
      content: "2026년 1월 1일부로 개인정보처리방침이 개정되었습니다.",
      category: "일반",
    },
  ]);

  await db.insert(faqs).values([
    {
      category: "주문/결제",
      question: "결제 수단은 어떤 것이 있나요?",
      answer: "신용카드, 체크카드, 무통장입금, 카카오페이, 네이버페이를 지원합니다.",
      displayOrder: 1,
    },
    {
      category: "주문/결제",
      question: "주문 취소는 어떻게 하나요?",
      answer: "마이페이지 > 주문내역에서 배송 전 주문건에 한해 취소가 가능합니다.",
      displayOrder: 2,
    },
    {
      category: "배송",
      question: "배송은 얼마나 걸리나요?",
      answer: "평일 오후 2시 이전 결제 완료 시 당일 출고되며, 출고 후 1-2일 내 배송됩니다.",
      displayOrder: 3,
    },
    {
      category: "구독",
      question: "장수박스 구독은 어떻게 신청하나요?",
      answer: "장수박스 메뉴에서 원하시는 플랜을 선택 후 구독 신청이 가능합니다.",
      displayOrder: 4,
    },
    {
      category: "구독",
      question: "구독 해지는 언제든 가능한가요?",
      answer: "네, 마이페이지에서 언제든 구독 해지가 가능합니다. 다음 결제일 전까지 해지하시면 추가 결제 없이 해지됩니다.",
      displayOrder: 5,
    },
  ]);

  await db.insert(promotions).values([
    {
      slug: "seol-gift",
      title: "설 선물세트",
      subtitle: "새해 첫 선물로, 특별함과 다양함을 담은 세트를 추천해요.",
      description: "부모님께 전하는 건강한 설 선물",
      period: "1. 12(월) ~ 2. 27(목)",
      heroImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
      isActive: true,
      displayOrder: 1,
    },
    {
      slug: "jangsu-box",
      title: "장수박스",
      subtitle: "매월 정기 배송되는 프리미엄 건강 선물 세트",
      description: "부모님의 건강을 매달 챙겨드립니다",
      period: "매월 정기 배송",
      heroImage: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600",
      isActive: true,
      displayOrder: 2,
    },
    {
      slug: "health-travel",
      title: "건강 여행",
      subtitle: "건강한 여행을 위한 필수 아이템",
      description: "여행길에도 건강을 챙기세요",
      period: "상시 진행",
      heroImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
      isActive: true,
      displayOrder: 3,
    },
    {
      slug: "popular",
      title: "인기 상품",
      subtitle: "고객님들이 가장 많이 찾는 베스트셀러",
      description: "믿고 구매하는 인기 상품",
      period: "실시간 인기 순위",
      heroImage: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600",
      isActive: true,
      displayOrder: 4,
    },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
