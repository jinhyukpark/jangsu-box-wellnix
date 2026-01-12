import { ChevronRight, Calendar, MapPin, Bus } from "lucide-react";
import tourEventImage from "@assets/generated_images/seniors_health_tour_event.png";

const healthTour = {
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
  image: tourEventImage,
  included: ["왕복 버스", "점심 식사", "힐링 프로그램", "기념품"],
};

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
      
      <div className="px-4">
        <div className="rounded overflow-hidden bg-white border border-gray-100 shadow-sm">
          <div className="relative h-40 overflow-hidden">
            <img 
              src={healthTour.image} 
              alt={healthTour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-block bg-[#006861] text-white text-xs font-bold px-2 py-1 rounded mb-2">
                {healthTour.company}
              </span>
              <h3 className="text-white font-bold text-lg leading-tight">{healthTour.title}</h3>
              <p className="text-white/80 text-sm">{healthTour.subtitle}</p>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#006861]" />
              <span className="font-medium text-gray-900">{healthTour.date}</span>
            </div>
            
            <div className="bg-gray-50 rounded p-3 space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#006861] border-2 border-white shadow" />
                  <div className="w-0.5 h-8 bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">출발 {healthTour.departureTime}</p>
                    <p className="text-sm font-medium text-gray-900">{healthTour.departure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">도착 {healthTour.arrivalTime}</p>
                    <p className="text-sm font-medium text-gray-900">{healthTour.arrival}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {healthTour.included.map((item) => (
                <span key={item} className="text-xs bg-[#006861]/10 text-[#006861] px-2 py-1 rounded">
                  {item}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-400 line-through">{healthTour.originalPrice.toLocaleString()}원</span>
                <span className="text-lg font-bold text-[#006861] ml-2">{healthTour.price.toLocaleString()}원</span>
              </div>
              <button 
                className="bg-[#006861] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#005550] transition-colors"
                data-testid="event-apply"
              >
                신청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}