import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const banners = [
  {
    id: 1,
    title: "2026 설 얼리버드",
    subtitle: "장수 박스로 부모님께\n건강을 선물하세요",
    badge: "최대 40% 할인",
    image: giftBoxImage,
    bgColor: "bg-gradient-to-br from-emerald-600 to-emerald-800",
  },
  {
    id: 2,
    title: "매주 목요일은",
    subtitle: "웰닉스 구독자\n특별 할인의 날",
    badge: "구독 혜택",
    image: giftBoxImage,
    bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  {
    id: 3,
    title: "신규 가입 특별 혜택",
    subtitle: "첫 구독 시\n30% 할인 + 무료배송",
    badge: "신규 회원",
    image: giftBoxImage,
    bgColor: "bg-gradient-to-br from-purple-600 to-indigo-700",
  },
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };
  
  const banner = banners[currentIndex];

  return (
    <div className="relative overflow-hidden">
      <div 
        className={`${banner.bgColor} px-4 py-6 min-h-[200px] transition-all duration-500 relative`}
        data-testid="hero-banner"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 space-y-2">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
              {banner.badge}
            </span>
            <p className="text-white/80 text-sm font-medium">{banner.title}</p>
            <h2 className="text-white text-xl font-bold leading-tight whitespace-pre-line">
              {banner.subtitle}
            </h2>
          </div>
          <div className="w-32 h-32 rounded overflow-hidden shadow-2xl flex-shrink-0 relative">
            <img 
              src={banner.image} 
              alt="프로모션 이미지"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 right-1.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
              {currentIndex + 1} / {banners.length}
            </span>
          </div>
        </div>
        
      </div>
      
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
        data-testid="banner-prev"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
        data-testid="banner-next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}