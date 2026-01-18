import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { images } from "@/lib/images";

const banners = [
  {
    id: 1,
    title: "2026 설 얼리버드",
    subtitle: "설 선물 웰닉스로\n감사의 인사를 전하세요",
    badge: "최대 40% 할인",
    image: images.luxuryKoreanHealthGiftSet,
  },
  {
    id: 2,
    title: "매주 목요일은",
    subtitle: "웰닉스 구독자\n특별 할인의 날",
    badge: "구독 혜택",
    image: images.luxuryKoreanHealthGiftSet,
  },
  {
    id: 3,
    title: "신규 가입 특별 혜택",
    subtitle: "첫 구독 시\n30% 할인 + 무료배송",
    badge: "신규 회원",
    image: images.luxuryKoreanHealthGiftSet,
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
        className="relative min-h-[220px] transition-all duration-500"
        data-testid="hero-banner"
      >
        <img 
          src={banner.image} 
          alt="프로모션 이미지"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        <div className="relative z-10 px-5 py-6 flex flex-col justify-center min-h-[220px]">
          <span className="inline-block w-fit bg-white/90 text-[#006861] text-xs font-semibold px-3 py-1 rounded-full mb-2">
            {banner.badge}
          </span>
          <p className="text-white/90 text-sm font-medium mb-1">{banner.title}</p>
          <h2 className="text-white text-2xl font-bold leading-tight whitespace-pre-line drop-shadow-lg font-serif">
            {banner.subtitle}
          </h2>
        </div>
        
        <span className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded z-10">
          {currentIndex + 1} / {banners.length}
        </span>
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