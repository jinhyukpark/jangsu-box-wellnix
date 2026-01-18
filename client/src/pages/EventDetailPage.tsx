import { useParams, useLocation } from "wouter";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Gift, Utensils, Bus, CheckCircle, MessageCircle, Share2, Building2, Phone, User } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { images } from "@/lib/images";

const templeImage = images.koreanTempleAutumnTravel;
const hqImage = images.modernWellnessCompanyHq;
const rehabImage = images.seniorRehabTherapyEquipment;

const eventsData: Record<string, {
  id: string;
  title: string;
  tag: string;
  status: string;
  date: string;
  time: string;
  location: string;
  address: string;
  participants: number;
  maxParticipants: number;
  image: string;
  description: string;
  schedule: { time: string; activity: string }[];
  benefits: { icon: string; title: string; description: string }[];
  promotions: { title: string; description: string }[];
  notes: string[];
  organizer: { name: string; contact: string; manager: string; email: string };
}> = {
  "1": {
    id: "1",
    title: "2026 건강한 설맞이 특별 세미나",
    tag: "무료 세미나",
    status: "모집중",
    date: "2026.01.25 (토)",
    time: "14:00 - 16:00",
    location: "서울 강남구 웰닉스홀",
    address: "서울특별시 강남구 테헤란로 123 웰닉스빌딩 3층",
    participants: 127,
    maxParticipants: 150,
    image: hqImage,
    description: "새해 건강 관리 비법과 면역력 증진 방법을 전문가와 함께 알아봅니다. 한방 전문의와 영양사가 함께하는 특별한 건강 세미나에 초대합니다.",
    schedule: [
      { time: "13:30", activity: "등록 및 입장" },
      { time: "14:00", activity: "개회사 및 웰닉스 소개" },
      { time: "14:15", activity: "특강 1: 겨울철 면역력 관리법 (한방 전문의)" },
      { time: "15:00", activity: "특강 2: 설맞이 건강 식단 (영양사)" },
      { time: "15:45", activity: "Q&A 및 경품 추첨" },
      { time: "16:00", activity: "폐회 및 선물 증정" },
    ],
    benefits: [
      { icon: "meal", title: "간식 제공", description: "건강 다과 및 음료 제공" },
      { icon: "gift", title: "참가 선물", description: "웰닉스 건강식품 샘플 세트" },
      { icon: "transport", title: "주차 지원", description: "무료 주차 2시간 지원" },
    ],
    promotions: [
      { title: "세미나 참석자 특별 할인", description: "장수박스 첫 구독 시 20% 할인 쿠폰 증정" },
      { title: "경품 추첨", description: "참석자 중 추첨을 통해 효심박스 3개월 무료 구독권 증정 (5명)" },
    ],
    notes: [
      "사전 신청자에 한해 참석 가능합니다.",
      "참석 확정 문자가 발송됩니다.",
      "행사 당일 마스크 착용을 권장합니다.",
    ],
    organizer: {
      name: "웰닉스 헬스케어",
      contact: "02-1234-5678",
      manager: "김건강 매니저",
      email: "event@wellnix.co.kr",
    },
  },
  "2": {
    id: "2",
    title: "시니어 요가 & 명상 클래스",
    tag: "정기 클래스",
    status: "모집중",
    date: "2026.02.05 (수)",
    time: "10:00 - 11:00",
    location: "온라인 ZOOM",
    address: "참가 링크는 신청 후 이메일로 발송됩니다",
    participants: 89,
    maxParticipants: 100,
    image: rehabImage,
    description: "전문 강사와 함께하는 시니어 맞춤 요가와 명상 프로그램입니다. 집에서 편안하게 참여하실 수 있습니다.",
    schedule: [
      { time: "09:50", activity: "ZOOM 입장 및 연결 확인" },
      { time: "10:00", activity: "인사 및 오늘의 프로그램 안내" },
      { time: "10:10", activity: "준비 운동 및 스트레칭" },
      { time: "10:25", activity: "시니어 맞춤 요가 동작" },
      { time: "10:45", activity: "호흡 명상" },
      { time: "10:55", activity: "마무리 및 다음 수업 안내" },
    ],
    benefits: [
      { icon: "gift", title: "수업 자료", description: "요가 동작 가이드 PDF 제공" },
      { icon: "check", title: "개인 피드백", description: "동작 교정 및 1:1 질문 가능" },
    ],
    promotions: [
      { title: "정기 수강 할인", description: "월 4회 정기 수강 시 20% 할인" },
      { title: "친구 초대 이벤트", description: "친구와 함께 신청하면 다음 달 수업료 50% 할인" },
    ],
    notes: [
      "편안한 복장과 요가 매트를 준비해주세요.",
      "인터넷 연결 상태를 미리 확인해주세요.",
      "수업 10분 전까지 ZOOM에 접속해주세요.",
    ],
    organizer: {
      name: "웰닉스 아카데미",
      contact: "02-1234-5679",
      manager: "박평화 강사",
      email: "class@wellnix.co.kr",
    },
  },
  "3": {
    id: "3",
    title: "홍삼 건강법 특강",
    tag: "건강 강좌",
    status: "마감됨",
    date: "2026.03.15 (토)",
    time: "15:00 - 17:00",
    location: "부산 해운대 컨벤션센터",
    address: "부산광역시 해운대구 해운대해변로 55",
    participants: 80,
    maxParticipants: 80,
    image: templeImage,
    description: "홍삼의 효능과 올바른 섭취 방법에 대해 배워봅니다. 30년 경력의 한약사가 직접 알려드립니다.",
    schedule: [
      { time: "14:30", activity: "등록 및 입장" },
      { time: "15:00", activity: "개회사" },
      { time: "15:10", activity: "홍삼의 역사와 종류" },
      { time: "15:40", activity: "홍삼의 효능과 과학적 근거" },
      { time: "16:10", activity: "휴식 및 홍삼차 시음" },
      { time: "16:30", activity: "나에게 맞는 홍삼 섭취법" },
      { time: "16:50", activity: "Q&A" },
      { time: "17:00", activity: "폐회" },
    ],
    benefits: [
      { icon: "meal", title: "다과 제공", description: "홍삼차 및 건강 다과" },
      { icon: "gift", title: "참가 선물", description: "프리미엄 홍삼 스틱 10포 세트" },
      { icon: "transport", title: "셔틀버스", description: "해운대역에서 무료 셔틀 운행" },
    ],
    promotions: [
      { title: "특강 참석자 할인", description: "웰닉스 홍삼 제품 30% 특별 할인 (당일 한정)" },
    ],
    notes: [
      "모집이 마감되었습니다.",
      "다음 특강 일정은 추후 공지됩니다.",
    ],
    organizer: {
      name: "웰닉스 부산지점",
      contact: "051-9876-5432",
      manager: "이홍삼 팀장",
      email: "busan@wellnix.co.kr",
    },
  },
};

const getBenefitIcon = (icon: string) => {
  switch (icon) {
    case "meal": return <Utensils className="w-5 h-5" />;
    case "gift": return <Gift className="w-5 h-5" />;
    case "transport": return <Bus className="w-5 h-5" />;
    case "check": return <CheckCircle className="w-5 h-5" />;
    default: return <Gift className="w-5 h-5" />;
  }
};

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const event = eventsData[params.id || "1"];

  if (!event) {
    return (
      <AppLayout>
        <div className="p-4 text-center text-gray-500">행사를 찾을 수 없습니다.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SEO 
        title={event.title} 
        description={event.description}
        image={event.image}
      />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLocation("/events")}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="back-button"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-semibold text-gray-900">행사 상세</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
              data-testid="share-kakao"
              title="카카오톡 공유"
            >
              <MessageCircle className="w-5 h-5 text-yellow-500" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="share-sms"
              title="문자 공유"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="pb-24">
        <div className="relative h-56 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
              {event.tag}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              event.status === "모집중" 
                ? "bg-amber-400 text-amber-900" 
                : "bg-gray-400 text-white"
            }`}>
              {event.status}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
        </div>

        <div className="p-4 bg-white border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">행사 정보</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{event.date}</p>
                <p className="text-sm text-gray-500">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{event.location}</p>
                <p className="text-sm text-gray-500">{event.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">참가 인원</p>
                <p className="text-sm text-gray-500">{event.participants}/{event.maxParticipants}명</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">프로그램 일정</h3>
          <div className="relative">
            {event.schedule.map((item, index) => (
              <div key={index} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 z-10" />
                  {index < event.schedule.length - 1 && (
                    <div className="w-0.5 bg-primary/30 flex-1 min-h-[40px]" />
                  )}
                </div>
                <div className="pb-4">
                  <span className="text-sm font-semibold text-primary">{item.time}</span>
                  <p className="text-sm text-gray-700 mt-0.5">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">참가자 혜택</h3>
          <div className="space-y-3">
            {event.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg">
                <div className="text-primary flex-shrink-0">
                  {getBenefitIcon(benefit.icon)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {event.promotions.length > 0 && (
          <div className="p-4 bg-white border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">특별 프로모션</h3>
            <div className="space-y-3">
              {event.promotions.map((promo, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-sm font-medium text-amber-900">{promo.title}</p>
                  <p className="text-sm text-amber-700 mt-1">{promo.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-white border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">주최측 정보</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{event.organizer.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">담당자: {event.organizer.manager}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">{event.organizer.contact}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">{event.organizer.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">안내사항</h3>
          <ul className="space-y-2">
            {event.notes.map((note, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

              </div>
    {event.status === "모집중" && (
        <div className="sticky bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40">
          <button 
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
            data-testid="apply-event-button"
          >
            신청하기
          </button>
        </div>
      )}
    </AppLayout>
  );
}