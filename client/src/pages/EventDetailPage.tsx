import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, Users, Gift, Utensils, Bus, CheckCircle, MessageCircle, Share2, Building2, Phone, User, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Event } from "@shared/schema";

const getBenefitIcon = (icon: string) => {
  switch (icon) {
    case "meal": return <Utensils className="w-5 h-5" />;
    case "gift": return <Gift className="w-5 h-5" />;
    case "transport": return <Bus className="w-5 h-5" />;
    case "check": return <CheckCircle className="w-5 h-5" />;
    default: return <Gift className="w-5 h-5" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "recruiting": return "모집중";
    case "active": return "진행중";
    case "upcoming": return "예정";
    case "completed": return "완료";
    case "closed": return "마감";
    default: return status;
  }
};

const getStatusStyle = (status: string) => {
  if (status === "recruiting" || status === "active" || status === "upcoming") {
    return "bg-amber-400 text-amber-900";
  }
  return "bg-gray-400 text-white";
};

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ["event", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${params.id}`);
      if (!res.ok) throw new Error("이벤트를 불러올 수 없습니다");
      return res.json();
    },
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error || !event) {
    return (
      <AppLayout>
        <div className="p-4 text-center text-gray-500">행사를 찾을 수 없습니다.</div>
      </AppLayout>
    );
  }

  const formattedDate = event.date 
    ? format(new Date(event.date), "yyyy.MM.dd (EEE)", { locale: ko })
    : "";

  const schedule = (event.programSchedule as { time: string; description: string }[] | null) || [];
  const benefits = (event.benefits as { icon: string; title: string; description: string }[] | null) || [];
  const promotions = (event.promotions as { title: string; description: string }[] | null) || [];
  const notices = (event.notices as string[] | null) || [];
  const organizer = event.organizerInfo as { company: string; contact: string; phone: string; email: string } | null;

  const allImages = [
    event.image,
    ...(event.images || [])
  ].filter(Boolean) as string[];
  
  const hasMultipleImages = allImages.length > 1;
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  const isClosed = event.status === "closed" || event.status === "completed";

  return (
    <AppLayout>
      <SEO 
        title={event.title} 
        description={event.description || ""}
        image={event.image || ""}
      />
      <div className="flex flex-col h-[calc(100vh-60px)]">
        <header className="flex-shrink-0 bg-white border-b border-gray-100">
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

        <div className="flex-1 overflow-y-auto">
        <div className="relative h-56 overflow-hidden">
          {allImages.length > 0 ? (
            <>
              <img 
                src={allImages[currentImageIndex]} 
                alt={`${event.title} - ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    data-testid="carousel-prev"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    data-testid="carousel-next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                        data-testid={`carousel-dot-${index}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">이미지 없음</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {event.tag && (
              <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                {event.tag}
              </span>
            )}
            {event.status && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getStatusStyle(event.status)}`}>
                {getStatusLabel(event.status)}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
          {event.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
          )}
        </div>

        <div className="p-4 bg-white border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">행사 정보</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
                {event.time && <p className="text-sm text-gray-500">{event.time}</p>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{event.location || "장소 미정"}</p>
                {event.detailedAddress && (
                  <p className="text-sm text-gray-500">{event.detailedAddress}</p>
                )}
              </div>
            </div>
            {event.maxParticipants && (
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">참가 인원</p>
                  <p className="text-sm text-gray-500">
                    {event.currentParticipants || 0}/{event.maxParticipants}명
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {schedule.length > 0 && (
          <div className="p-4 bg-white border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">프로그램 일정</h3>
            <div className="relative">
              {schedule.map((item, index) => (
                <div key={index} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 z-10" />
                    {index < schedule.length - 1 && (
                      <div className="w-0.5 bg-primary/30 flex-1 min-h-[40px]" />
                    )}
                  </div>
                  <div className="pb-4">
                    <span className="text-sm font-semibold text-primary">{item.time}</span>
                    <p className="text-sm text-gray-700 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {benefits.length > 0 && (
          <div className="p-4 bg-white border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">참가자 혜택</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
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
        )}

        {promotions.length > 0 && (
          <div className="p-4 bg-white border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">특별 프로모션</h3>
            <div className="space-y-3">
              {promotions.map((promo, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-sm font-medium text-amber-900">{promo.title}</p>
                  <p className="text-sm text-amber-700 mt-1">{promo.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {organizer && (
          <div className="p-4 bg-white border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">주최측 정보</h3>
            <div className="space-y-3">
              {organizer.company && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-gray-900">{organizer.company}</p>
                </div>
              )}
              {organizer.contact && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">담당자: {organizer.contact}</p>
                </div>
              )}
              {organizer.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{organizer.phone}</p>
                </div>
              )}
              {organizer.email && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{organizer.email}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {notices.length > 0 && (
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-3">안내사항</h3>
            <ul className="space-y-2">
              {notices.map((note, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>

        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
          <button 
            className={`w-full font-semibold py-3 rounded-lg transition-colors ${
              isClosed 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            disabled={isClosed}
            data-testid="apply-event-button"
          >
            {isClosed ? "신청 마감됨" : "신청하기"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
