import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PromoSidebar } from "@/components/PromoSidebar";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const upcomingEvents = [
  {
    id: "1",
    title: "2026 건강한 설맞이 특별 세미나",
    date: "2026.01.25 (토)",
    time: "14:00 - 16:00",
    location: "서울 강남구 웰닉스홀",
    participants: 127,
    maxParticipants: 150,
    image: giftBoxImage,
    tag: "무료 세미나",
    description: "새해 건강 관리 비법과 면역력 증진 방법을 전문가와 함께 알아봅니다.",
  },
  {
    id: "2",
    title: "시니어 요가 & 명상 클래스",
    date: "매주 수요일",
    time: "10:00 - 11:00",
    location: "온라인 ZOOM",
    participants: 89,
    maxParticipants: 100,
    image: giftBoxImage,
    tag: "정기 클래스",
    description: "전문 강사와 함께하는 시니어 맞춤 요가와 명상 프로그램입니다.",
  },
  {
    id: "3",
    title: "홍삼 건강법 특강",
    date: "2026.02.01 (토)",
    time: "15:00 - 17:00",
    location: "부산 해운대 컨벤션센터",
    participants: 54,
    maxParticipants: 80,
    image: giftBoxImage,
    tag: "건강 강좌",
    description: "홍삼의 효능과 올바른 섭취 방법에 대해 배워봅니다.",
  },
];

const pastEvents = [
  {
    id: "4",
    title: "2025 연말 건강 콘서트",
    date: "2025.12.20 (토)",
    participants: 245,
    image: giftBoxImage,
  },
  {
    id: "5",
    title: "겨울철 면역력 강화 세미나",
    date: "2025.12.10 (토)",
    participants: 189,
    image: giftBoxImage,
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-xl">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4">
          <h1 className="text-xl font-bold text-gray-900">건강 행사</h1>
          <p className="text-sm text-gray-500 mt-0.5">다양한 건강 프로그램에 참여하세요</p>
        </header>
        
        <div className="pb-24">
          <section className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              예정된 행사
            </h2>
            
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  data-testid={`event-${event.id}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {event.tag}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date} {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{event.participants}/{event.maxParticipants}명</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-100 rounded-full h-2 mr-4">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        />
                      </div>
                      <button 
                        className="flex-shrink-0 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                        data-testid={`apply-${event.id}`}
                      >
                        신청하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <div className="h-2 bg-gray-50" />
          
          <section className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">지난 행사</h2>
              <button className="flex items-center text-sm text-gray-500" data-testid="past-events-more">
                더보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  data-testid={`past-event-${event.id}`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.participants}명 참여</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <BottomNav />
      </main>
    </div>
  );
}