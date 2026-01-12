import { Heart, Check } from "lucide-react";
import happySeniorsImage from "@assets/generated_images/happy_seniors_opening_gift_box.png";

export function SubscriptionBanner() {
  return (
    <div className="mx-4 my-5 rounded overflow-hidden relative">
      <img 
        src={happySeniorsImage} 
        alt="장수박스를 받은 행복한 부모님"
        className="w-full h-72 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-center items-end p-5 text-right">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 text-sm font-medium">장수 박스 정기구독</span>
        </div>
        <h3 className="text-white text-xl font-bold mb-2 leading-snug font-serif drop-shadow-lg">
          단순한 선물이 아닌,<br />추억과 마음을 전합니다
        </h3>
        <p className="text-white/80 text-sm mb-4 drop-shadow">
          매달 부모님께 건강과 사랑을 담아 보내드려요
        </p>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-end gap-2 text-white text-sm drop-shadow-md">
            <span>손편지와 함께 전하는 마음</span>
            <Check className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center justify-end gap-2 text-white text-sm drop-shadow-md">
            <span>매달 새로운 건강 테마 상품</span>
            <Check className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center justify-end gap-2 text-white text-sm drop-shadow-md">
            <span>언제든 해지 가능</span>
            <Check className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
}