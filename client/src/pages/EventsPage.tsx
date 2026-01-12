import { useState } from "react";
import { useLocation } from "wouter";
import { Calendar, MapPin, Users } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import templeImage from "@assets/generated_images/korean_temple_autumn_travel.png";
import hqImage from "@assets/generated_images/modern_wellness_company_hq.png";
import rehabImage from "@assets/generated_images/senior_rehab_therapy_equipment.png";

const months = [
  { id: "2026-01", label: "1월", year: "2026" },
  { id: "2026-02", label: "2월", year: "2026" },
  { id: "2026-03", label: "3월", year: "2026" },
  { id: "2026-04", label: "4월", year: "2026" },
  { id: "2026-05", label: "5월", year: "2026" },
  { id: "2026-06", label: "6월", year: "2026" },
];

const categories = ["전체", "여행", "건강식품", "화장품", "운동", "요리"];

const upcomingEvents = [
  {
    id: "1",
    title: "2026 건강한 설맞이 특별 세미나",
    date: "2026.01.25 (토)",
    time: "14:00 - 16:00",
    location: "서울 강남구 웰닉스홀",
    participants: 127,
    maxParticipants: 150,
    image: hqImage,
    tag: "무료 세미나", status: "모집중",
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
    image: rehabImage,
    tag: "정기 클래스", status: "모집중",
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
    image: templeImage,
    tag: "건강 강좌", status: "마감됨",
    description: "홍삼의 효능과 올바른 섭취 방법에 대해 배워봅니다.",
  },
];


export default function EventsPage() {
  const [, setLocation] = useLocation();
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");

  return (
    <AppLayout>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="p-4 pb-2">
          <h1 className="text-xl font-bold text-gray-900">건강 행사</h1>
        </div>
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {months.map((month) => (
            <button
              key={month.id}
              onClick={() => setSelectedMonth(month.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedMonth === month.id 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedCategory === category 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>
      
      <div className="pb-24">
        <section className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              예정된 행사
            </h2>
            <div className="flex gap-1.5">
              {["전체", "모집중", "마감됨"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedStatus === status
                      ? status === "모집중" ? "bg-amber-400 text-amber-900"
                        : status === "마감됨" ? "bg-gray-400 text-white"
                        : "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents
              .filter((event) => selectedStatus === "전체" || event.status === selectedStatus)
              .map((event) => (
              <div 
                key={event.id}
                onClick={() => setLocation(`/events/${event.id}`)}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                data-testid={`event-${event.id}`}
              >
                <div className="relative h-40 overflow-hidden">
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
                  
                                  </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}