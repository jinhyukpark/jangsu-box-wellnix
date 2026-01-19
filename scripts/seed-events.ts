import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { db } from "../server/db";
import { events } from "../shared/schema";
import { eq } from "drizzle-orm";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET_NAME = "_public";

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(filePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `events/${Date.now()}_${path.basename(filePath)}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`images/${fileName}`, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/images/${fileName}`;

    return publicUrl;
  } catch (err) {
    console.error("Error uploading:", err);
    return null;
  }
}

async function seedEvents() {
  console.log("Starting event seeding...");

  const seminarImages = [
    "attached_assets/stock_images/health_seminar_confe_9664d3a8.jpg",
    "attached_assets/stock_images/health_seminar_confe_59919046.jpg",
    "attached_assets/stock_images/health_seminar_confe_84feb58f.jpg",
    "attached_assets/stock_images/health_seminar_confe_3b59e102.jpg",
  ];

  const ginsengImages = [
    "attached_assets/stock_images/korean_red_ginseng_t_b3e216e8.jpg",
    "attached_assets/stock_images/korean_red_ginseng_t_23ee6bf5.jpg",
    "attached_assets/stock_images/korean_red_ginseng_t_e18f7828.jpg",
    "attached_assets/stock_images/korean_red_ginseng_t_7b19be2b.jpg",
  ];

  const yogaImages = [
    "attached_assets/stock_images/senior_yoga_class_st_c6c466c9.jpg",
    "attached_assets/stock_images/senior_yoga_class_st_00a53d28.jpg",
    "attached_assets/stock_images/senior_yoga_class_st_3d353997.jpg",
    "attached_assets/stock_images/senior_yoga_class_st_61e24657.jpg",
  ];

  console.log("Uploading seminar images...");
  const seminarUrls: string[] = [];
  for (const img of seminarImages) {
    const url = await uploadImage(img);
    console.log(`Uploaded: ${url}`);
    if (url) seminarUrls.push(url);
  }
  console.log(`Seminar URLs: ${seminarUrls.length} images`);

  console.log("Uploading ginseng images...");
  const ginsengUrls: string[] = [];
  for (const img of ginsengImages) {
    const url = await uploadImage(img);
    console.log(`Uploaded: ${url}`);
    if (url) ginsengUrls.push(url);
  }
  console.log(`Ginseng URLs: ${ginsengUrls.length} images`);

  console.log("Uploading yoga images...");
  const yogaUrls: string[] = [];
  for (const img of yogaImages) {
    const url = await uploadImage(img);
    console.log(`Uploaded: ${url}`);
    if (url) yogaUrls.push(url);
  }
  console.log(`Yoga URLs: ${yogaUrls.length} images`);

  console.log("Updating event 1 (신년 건강 세미나)...");
  await db.update(events).set({
    image: seminarUrls[0] || null,
    images: seminarUrls.slice(1),
    programSchedule: [
      { time: "13:30", description: "등록 및 입장" },
      { time: "14:00", description: "개회사 및 웰닉스 소개" },
      { time: "14:20", description: "특강 1: 2026년 건강 트렌드와 예방의학" },
      { time: "15:00", description: "휴식 및 건강차 시음" },
      { time: "15:20", description: "특강 2: 면역력 증진을 위한 생활 습관" },
      { time: "16:00", description: "Q&A 및 1:1 건강 상담" },
      { time: "16:30", description: "경품 추첨 및 선물 증정" },
      { time: "17:00", description: "폐회" },
    ],
    benefits: [
      { icon: "meal", title: "건강 다과", description: "유기농 과일과 건강차 제공" },
      { icon: "gift", title: "참가 선물", description: "웰닉스 건강식품 샘플 세트 (5만원 상당)" },
      { icon: "transport", title: "무료 주차", description: "지하주차장 3시간 무료 주차 지원" },
      { icon: "check", title: "건강 상담", description: "전문 영양사 1:1 맞춤 상담 제공" },
    ],
    promotions: [
      { title: "세미나 참석자 특별 할인", description: "장수박스 첫 구독 시 30% 할인 쿠폰 증정 (5만원 한도)" },
      { title: "경품 추첨 이벤트", description: "참석자 전원 대상 효심박스 3개월 무료 구독권 추첨 (10명)" },
      { title: "얼리버드 혜택", description: "1월 20일까지 신청 시 프리미엄 건강즙 세트 추가 증정" },
    ],
    organizerInfo: {
      company: "웰닉스 헬스케어",
      contact: "김건강 매니저",
      phone: "02-1588-0000",
      email: "event@wellnix.co.kr",
    },
    notices: [
      "사전 신청자에 한해 참석 가능합니다.",
      "세미나 시작 30분 전까지 도착해주세요.",
      "주차 공간이 제한되어 있으니 가급적 대중교통을 이용해주세요.",
      "당일 건강 체크리스트를 지참하시면 맞춤 상담이 가능합니다.",
      "문의사항은 고객센터(1588-0000)로 연락해주세요.",
    ],
    featureTags: ["무료 주차", "건강 다과", "1:1 상담", "경품 추첨"],
  }).where(eq(events.id, 1));

  console.log("Updating event 2 (홍삼 건강법 온라인 클래스)...");
  await db.update(events).set({
    image: ginsengUrls[0] || null,
    images: ginsengUrls.slice(1),
    programSchedule: [
      { time: "09:50", description: "ZOOM 접속 및 연결 확인" },
      { time: "10:00", description: "인사 및 오늘의 강의 소개" },
      { time: "10:10", description: "홍삼의 역사와 종류" },
      { time: "10:30", description: "홍삼의 과학적 효능과 연구 결과" },
      { time: "10:50", description: "나에게 맞는 홍삼 선택법" },
      { time: "11:10", description: "홍삼 올바른 섭취 방법" },
      { time: "11:30", description: "Q&A 및 실시간 질문" },
      { time: "11:50", description: "정리 및 다음 클래스 안내" },
    ],
    benefits: [
      { icon: "gift", title: "강의 자료", description: "PDF 강의 자료 및 홍삼 가이드북 제공" },
      { icon: "check", title: "수료증", description: "온라인 수료증 발급" },
      { icon: "gift", title: "할인 쿠폰", description: "웰닉스 홍삼 제품 20% 할인 쿠폰" },
    ],
    promotions: [
      { title: "온라인 특가", description: "클래스 수강 후 홍삼 제품 구매 시 30% 추가 할인" },
      { title: "후기 이벤트", description: "수강 후기 작성 시 홍삼 스틱 10포 세트 증정" },
    ],
    organizerInfo: {
      company: "웰닉스 아카데미",
      contact: "박홍삼 강사",
      phone: "02-1588-0001",
      email: "academy@wellnix.co.kr",
    },
    notices: [
      "안정적인 인터넷 환경에서 수강해주세요.",
      "클래스 시작 10분 전에 ZOOM에 접속해주세요.",
      "카메라 ON은 선택 사항입니다.",
      "강의 자료는 수업 전날 이메일로 발송됩니다.",
      "녹화본은 1주일간 다시보기 가능합니다.",
    ],
    featureTags: ["온라인 강의", "수료증 발급", "다시보기 제공"],
  }).where(eq(events.id, 2));

  console.log("Updating event 3 (시니어 요가 체험 클래스)...");
  await db.update(events).set({
    image: yogaUrls[0] || null,
    images: yogaUrls.slice(1),
    programSchedule: [
      { time: "09:30", description: "등록 및 요가 매트 배포" },
      { time: "10:00", description: "인사 및 오늘의 프로그램 안내" },
      { time: "10:10", description: "준비 운동 및 호흡법 익히기" },
      { time: "10:30", description: "시니어 맞춤 기초 요가 동작" },
      { time: "11:00", description: "휴식 및 수분 보충" },
      { time: "11:10", description: "관절 건강을 위한 스트레칭" },
      { time: "11:30", description: "마음을 다스리는 명상 시간" },
      { time: "11:50", description: "마무리 및 정기 클래스 안내" },
    ],
    benefits: [
      { icon: "gift", title: "요가 매트", description: "개인용 요가 매트 무료 제공 (수업 후 지참 가능)" },
      { icon: "meal", title: "건강 간식", description: "유기농 과일 및 견과류 제공" },
      { icon: "check", title: "개인 교정", description: "전문 강사의 1:1 동작 교정" },
      { icon: "transport", title: "왕복 버스", description: "강남역 출발 무료 셔틀버스 운행" },
    ],
    promotions: [
      { title: "정기 등록 할인", description: "월 4회 정기 수강 등록 시 30% 할인" },
      { title: "친구 초대 이벤트", description: "친구와 함께 신청 시 다음 달 수업료 50% 할인" },
      { title: "체험 후기 이벤트", description: "체험 후기 작성 시 건강즙 1박스 증정" },
    ],
    organizerInfo: {
      company: "웰닉스 피트니스센터",
      contact: "이요가 강사",
      phone: "02-1588-0002",
      email: "fitness@wellnix.co.kr",
    },
    notices: [
      "편안한 복장과 양말을 준비해주세요.",
      "요가 매트는 제공되지만 개인 매트 지참도 가능합니다.",
      "수업 시작 30분 전까지 도착해주세요.",
      "무릎이나 허리 통증이 있으신 분은 사전에 알려주세요.",
      "수분 섭취를 위해 개인 물병을 준비해주세요.",
    ],
    featureTags: ["왕복 버스", "요가 매트 제공", "1:1 교정", "건강 간식"],
  }).where(eq(events.id, 3));

  console.log("Event seeding completed!");
}

seedEvents()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
