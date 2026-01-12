import { Heart, Check, ArrowRight } from "lucide-react";
import happySeniorsImage from "@assets/generated_images/happy_seniors_opening_gift_box.png";

export function SubscriptionBanner() {
  return (
    <div className="mx-4 my-5 rounded overflow-hidden relative">
      <img 
        src={happySeniorsImage} 
        alt="장수박스를 받은 행복한 부모님"
        className="w-full h-80 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <span className="text-rose-300 text-sm font-medium">장수 박스 정기구독</span>
        </div>
        <h3 className="text-white text-xl font-bold mb-2 leading-snug font-serif">
          단순한 선물이 아닌,<br />추억과 마음을 전합니다
        </h3>
        <p className="text-white/70 text-sm mb-4">
          매달 부모님께 건강과 사랑을 담아 보내드려요
        </p>
        
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Check className="w-4 h-4 text-rose-400" />
            <span>손편지와 함께 전하는 마음</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Check className="w-4 h-4 text-rose-400" />
            <span>매달 새로운 건강 테마 상품</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Check className="w-4 h-4 text-rose-400" />
            <span>언제든 해지 가능</span>
          </div>
        </div>
        
        <button 
          className="w-full bg-white text-[#006861] font-semibold py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          data-testid="subscribe-cta"
        >
          구독 시작하기
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
          <span className="text-white/60 text-sm">첫 달 특별가</span>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 text-sm line-through">89,000원</span>
            <span className="text-white text-xl font-bold">59,000원</span>
          </div>
        </div>
      </div>
    </div>
  );
}