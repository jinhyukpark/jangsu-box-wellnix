import { ChevronRight } from "lucide-react";
import { EventCard } from "./EventCard";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const events = [
  {
    id: "1",
    title: "2026 건강한 설맞이 특별 세미나",
    date: "2026.01.25 (토) 14:00",
    location: "서울 강남구 웰닉스홀",
    participants: 127,
    image: giftBoxImage,
    tag: "무료 세미나",
  },
  {
    id: "2",
    title: "시니어 요가 & 명상 클래스",
    date: "매주 수요일 10:00",
    location: "온라인 ZOOM",
    participants: 89,
    image: giftBoxImage,
    tag: "정기 클래스",
  },
  {
    id: "3",
    title: "홍삼 건강법 특강",
    date: "2026.02.01 (토) 15:00",
    location: "부산 해운대 컨벤션",
    participants: 54,
    image: giftBoxImage,
    tag: "건강 강좌",
  },
];

export function EventSection() {
  return (
    <section className="py-5">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">건강 행사 & 일정</h2>
          <p className="text-sm text-gray-500 mt-0.5">다양한 건강 프로그램에 참여하세요</p>
        </div>
        <button 
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          data-testid="events-more"
        >
          더보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </section>
  );
}