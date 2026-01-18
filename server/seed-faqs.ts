import { db } from "./db";
import { faqs } from "@shared/schema";

const faqData = [
  { category: '주문/결제', question: '결제 방법은 어떤 것이 있나요?', answer: '신용카드, 체크카드, 계좌이체, 네이버페이, 카카오페이 등 다양한 결제 수단을 지원합니다.', isActive: true, displayOrder: 1 },
  { category: '주문/결제', question: '주문 취소는 어떻게 하나요?', answer: '마이페이지 > 주문내역에서 배송 전 상품은 직접 취소가 가능합니다. 배송 중인 경우 고객센터로 문의해 주세요.', isActive: true, displayOrder: 2 },
  { category: '주문/결제', question: '결제 후 주문 변경이 가능한가요?', answer: '결제 완료 후에는 주문 변경이 어렵습니다. 주문 취소 후 재주문을 권장드립니다.', isActive: true, displayOrder: 3 },
  { category: '배송', question: '배송은 얼마나 걸리나요?', answer: '주문 후 평균 2-3일 이내 배송됩니다. 도서산간 지역은 1-2일 추가 소요될 수 있습니다.', isActive: true, displayOrder: 4 },
  { category: '배송', question: '배송비는 얼마인가요?', answer: '3만원 이상 구매 시 무료배송이며, 미만 시 3,000원의 배송비가 부과됩니다.', isActive: true, displayOrder: 5 },
  { category: '배송', question: '배송 추적은 어떻게 하나요?', answer: '마이페이지 > 주문내역에서 운송장 번호 확인 후 택배사 홈페이지에서 조회 가능합니다.', isActive: true, displayOrder: 6 },
  { category: '장수박스', question: '장수박스는 무엇인가요?', answer: '매월 건강 테마에 맞춘 엄선된 건강식품을 정기 배송해드리는 구독 서비스입니다.', isActive: true, displayOrder: 7 },
  { category: '장수박스', question: '장수박스 구독 해지는 어떻게 하나요?', answer: '마이페이지 > 구독관리에서 언제든지 해지 가능합니다. 다음 결제일 3일 전까지 해지하시면 다음 달부터 적용됩니다.', isActive: true, displayOrder: 8 },
  { category: '장수박스', question: '장수박스 상품을 직접 선택할 수 있나요?', answer: '장수박스는 전문 영양사가 매월 테마에 맞게 엄선한 상품으로 구성되어 직접 선택은 불가합니다.', isActive: true, displayOrder: 9 },
  { category: '교환/반품', question: '반품/교환 신청은 어떻게 하나요?', answer: '마이페이지 > 주문내역에서 반품/교환 신청이 가능합니다. 상품 수령 후 7일 이내 신청해 주세요.', isActive: true, displayOrder: 10 },
  { category: '교환/반품', question: '반품 배송비는 누가 부담하나요?', answer: '단순 변심에 의한 반품은 고객님 부담이며, 상품 하자인 경우 무료로 처리됩니다.', isActive: true, displayOrder: 11 },
  { category: '회원', question: '회원 탈퇴는 어떻게 하나요?', answer: '마이페이지 > 회원정보수정 > 회원탈퇴에서 진행하실 수 있습니다. 탈퇴 시 적립금과 쿠폰은 소멸됩니다.', isActive: true, displayOrder: 12 },
  { category: '회원', question: '비밀번호를 잊어버렸어요', answer: '로그인 화면에서 "비밀번호 찾기"를 클릭하시면 가입된 이메일로 임시 비밀번호를 발송해 드립니다.', isActive: true, displayOrder: 13 },
  { category: '적립/쿠폰', question: '적립금은 어떻게 사용하나요?', answer: '결제 시 적립금을 사용할 수 있으며, 1,000원 이상부터 100원 단위로 사용 가능합니다.', isActive: true, displayOrder: 14 },
  { category: '적립/쿠폰', question: '쿠폰 유효기간은 언제까지인가요?', answer: '각 쿠폰마다 유효기간이 다르며, 마이페이지 > 쿠폰함에서 확인하실 수 있습니다.', isActive: true, displayOrder: 15 },
];

async function seed() {
  console.log("Seeding FAQs to Supabase...");
  try {
    await db.insert(faqs).values(faqData);
    console.log("Successfully seeded 15 FAQs!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding FAQs:", error);
    process.exit(1);
  }
}

seed();
