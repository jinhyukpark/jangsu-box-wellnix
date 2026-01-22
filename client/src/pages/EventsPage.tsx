import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Users, ShoppingCart } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/use-auth";
import type { Event } from "@shared/schema";

const months = [
  { id: "2026-01", label: "1월", year: "2026" },
  { id: "2026-02", label: "2월", year: "2026" },
  { id: "2026-03", label: "3월", year: "2026" },
  { id: "2026-04", label: "4월", year: "2026" },
  { id: "2026-05", label: "5월", year: "2026" },
  { id: "2026-06", label: "6월", year: "2026" },
];

const categories = ["전체", "여행", "건강식품", "화장품", "운동", "요리"];


export default function EventsPage() {
  const [, setLocation] = useLocation();
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const { user } = useAuth();

  const { data: cartItems = [] } = useQuery<any[]>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user,
    staleTime: 30000,
  });

  const cartCount = cartItems.length;

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "recruiting": return "모집중";
      case "closed": return "마감됨";
      case "completed": return "종료";
      default: return status;
    }
  };

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} (${days[date.getDay()]})`;
  };

  const filteredEvents = events.filter((event) => {
    const statusLabel = getStatusLabel(event.status || "");
    if (selectedStatus !== "전체" && statusLabel !== selectedStatus) return false;
    if (selectedCategory !== "전체" && event.category !== selectedCategory) return false;
    
    // Month filtering
    if (event.date) {
      const eventDate = new Date(event.date);
      const eventYearMonth = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, "0")}`;
      if (eventYearMonth !== selectedMonth) return false;
    }
    
    return true;
  });

  return (
    <AppLayout>
      <SEO 
        title="건강 행사" 
        description="웰닉스가 준비한 다양한 건강 행사와 클래스를 확인해보세요."
      />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="p-4 pb-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">건강 행사</h1>
          <button
            onClick={() => setLocation("/cart")}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="cart-button"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
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
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">로딩중...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">등록된 행사가 없습니다.</div>
            ) : filteredEvents.map((event) => (
              <div 
                key={event.id}
                onClick={() => setLocation(`/events/${event.id}`)}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                data-testid={`event-${event.id}`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={event.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {event.tag && (
                      <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {event.tag}
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      event.status === "recruiting" 
                        ? "bg-amber-400 text-amber-900" 
                        : "bg-gray-400 text-white"
                    }`}>
                      {getStatusLabel(event.status || "")}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)} {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{event.currentParticipants || 0}/{event.maxParticipants || 0}명</span>
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