import { X } from "lucide-react";
import { useState } from "react";

export function CouponBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-amber-500 text-white px-4 py-2.5 flex items-center justify-between">
      <div className="flex-1 text-center">
        <span className="text-sm font-medium">
          🎁 카카오톡 채널 추가하고 <strong>10% 쿠폰</strong> 받기
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
        data-testid="coupon-close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}