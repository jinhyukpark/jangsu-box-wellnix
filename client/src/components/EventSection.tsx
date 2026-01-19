import { ChevronRight, Calendar, MapPin, Users } from "lucide-react";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { images } from "@/lib/images";

interface Event {
  id: number;
  title: string;
  description?: string;
  date?: string;
  endDate?: string;
  time?: string;
  location?: string;
  locationType?: string;
  detailedAddress?: string;
  image?: string;
  tag?: string;
  category?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  status: string;
  benefits?: string[];
}

interface MainPageSettings {
  eventsCriteria: "active" | "manual";
  eventsManualIds: number[];
  eventsLimit: number;
}

export function EventSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: allEvents = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const { data: settings } = useQuery<MainPageSettings>({
    queryKey: ["/api/main-page-settings"],
    queryFn: async () => {
      const res = await fetch("/api/main-page-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const getFilteredEvents = () => {
    const limit = settings?.eventsLimit || 4;
    const activeEvents = allEvents.filter(e => e.status === "active" || e.status === "upcoming" || e.status === "recruiting");
    
    if (settings?.eventsCriteria === "manual" && settings.eventsManualIds?.length > 0) {
      return activeEvents
        .filter(e => settings.eventsManualIds.includes(e.id))
        .slice(0, limit);
    }
    return activeEvents.slice(0, limit);
  };

  const events = getFilteredEvents();

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} (${days[date.getDay()]})`;
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-5">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">건강 행사 & 일정</h2>
          <p className="text-sm text-gray-500 mt-0.5">다양한 건강 프로그램에 참여하세요</p>
        </div>
        <Link href="/events">
          <button 
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            data-testid="events-more"
          >
            더보기 <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
      
      <div 
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <div 
              className="flex-shrink-0 w-80 snap-start rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-36 overflow-hidden">
                <img 
                  src={event.image || images.seniorsHealthTourEvent} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  {event.tag && (
                    <span className="inline-block bg-[#006861] text-white text-xs font-bold px-2 py-1 rounded mb-1">
                      {event.tag}
                    </span>
                  )}
                  <h3 className="text-white font-bold text-base leading-tight">{event.title}</h3>
                  {event.category && (
                    <p className="text-white/80 text-xs">{event.category}</p>
                  )}
                </div>
              </div>
              
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-[#006861]" />
                  <span className="font-medium text-gray-900">
                    {formatDate(event.date)}
                  </span>
                </div>
                
                {event.location && (
                  <div className="bg-stone-50 rounded-lg p-3">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#006861]" />
                        <div className="w-0.5 h-8 bg-gray-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">출발 {event.time || "07:00"}</p>
                          <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">도착 10:30</p>
                          <p className="text-sm font-semibold text-gray-900">{event.detailedAddress || "강원도 평창 힐링리조트"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {event.benefits && event.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {event.benefits.slice(0, 4).map((benefit: any, idx: number) => (
                      <span key={idx} className="text-xs border border-gray-300 text-gray-600 px-2 py-1 rounded">
                        {typeof benefit === 'string' ? benefit : benefit.title}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">150,000원</span>
                    <span className="text-base font-bold text-gray-900">89,000원</span>
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
          </Link>
        ))}
      </div>
    </section>
  );
}