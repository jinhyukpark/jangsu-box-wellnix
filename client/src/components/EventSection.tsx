import { ChevronRight, Calendar } from "lucide-react";
import { useRef } from "react";
import { images } from "@/lib/images";

const events = [
  {
    id: 1,
    company: "3H 웰니스 솔루션",
    title: "2026 봄맞이 건강 힐링투어",
    subtitle: "자연 속에서 건강을 찾다",
    date: "2026.03.15 (토)",
    departure: "서울 강남역 2번 출구",
    departureTime: "07:00",
    arrival: "강원도 평창 힐링리조트",
    arrivalTime: "10:30",
    price: 89000,
    originalPrice: 150000,
    image: images.seniorsHealthTourEvent,
    included: ["왕복 버스", "점심 식사", "힐링 프로그램", "기념품"],
  },
  {
    id: 2,
    company: "웰닉스 아카데미",
    title: "시니어 요가 & 명상 클래스",
    subtitle: "마음의 평화를 찾는 시간",
    date: "매주 수요일 10:00",
    departure: "온라인 ZOOM",
    departureTime: "10:00",
    arrival: "자택에서 편하게",
    arrivalTime: "11:30",
    price: 29000,
    originalPrice: 50000,
    image: images.seniorsHealthTourEvent,
    included: ["온라인 강의", "교재 제공", "수료증"],
  },
  {
    id: 3,
    company: "대한홍삼협회",
    title: "홍삼 건강법 특강",
    subtitle: "전문가에게 배우는 건강 비법",
    date: "2026.02.01 (토)",
    departure: "부산 해운대역 1번 출구",
    departureTime: "14:00",
    arrival: "해운대 컨벤션센터",
    arrivalTime: "14:30",
    price: 0,
    originalPrice: 30000,
    image: images.seniorsHealthTourEvent,
    included: ["무료 세미나", "홍삼 시음", "선물 증정"],
  },
];

export function EventSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

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
      
      <div 
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {events.map((event) => (
          <div 
            key={event.id}
            className="flex-shrink-0 w-[85%] snap-start rounded overflow-hidden bg-white border border-gray-100 shadow-sm"
          >
            <div className="relative h-36 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block bg-[#006861] text-white text-xs font-bold px-2 py-1 rounded mb-1">
                  {event.company}
                </span>
                <h3 className="text-white font-bold text-base leading-tight">{event.title}</h3>
                <p className="text-white/80 text-xs">{event.subtitle}</p>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[#006861]" />
                <span className="font-medium text-gray-900">{event.date}</span>
              </div>
              
              <div className="bg-gray-50 rounded p-3 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#006861] border-2 border-white shadow" />
                    <div className="w-0.5 h-6 bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">출발 {event.departureTime}</p>
                      <p className="text-sm font-medium text-gray-900">{event.departure}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">도착 {event.arrivalTime}</p>
                      <p className="text-sm font-medium text-gray-900">{event.arrival}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {event.included.map((item) => (
                  <span key={item} className="text-xs bg-[#006861]/10 text-[#006861] px-2 py-1 rounded">
                    {item}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  {event.originalPrice > 0 && (
                    <span className="text-xs text-gray-400 line-through">{event.originalPrice.toLocaleString()}원</span>
                  )}
                  <span className="text-lg font-bold text-[#006861] ml-2">
                    {event.price === 0 ? "무료" : `${event.price.toLocaleString()}원`}
                  </span>
                </div>
                <button 
                  className="bg-[#006861] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#005550] transition-colors"
                  data-testid={`event-apply-${event.id}`}
                >
                  신청하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}