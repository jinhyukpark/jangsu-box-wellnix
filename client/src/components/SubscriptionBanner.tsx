import { Package, Check, ArrowRight } from "lucide-react";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

export function SubscriptionBanner() {
  return (
    <div className="mx-4 my-5 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 rounded-3xl p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-emerald-200" />
              <span className="text-emerald-200 text-sm font-medium">장수 박스 정기구독</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-3 leading-snug">
              매달 엄선된 건강식품을<br />집으로 배송받으세요
            </h3>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>전문가가 엄선한 프리미엄 건강식품</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>매달 새로운 건강 테마 상품</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>언제든 해지 가능</span>
              </div>
            </div>
            <button 
              className="bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-emerald-50 transition-colors"
              data-testid="subscribe-cta"
            >
              구독 시작하기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl ml-3 flex-shrink-0">
            <img src={giftBoxImage} alt="장수 박스" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
          <span className="text-emerald-200 text-sm">첫 달 특별가</span>
          <div className="flex items-baseline gap-2">
            <span className="text-white/60 text-sm line-through">89,000원</span>
            <span className="text-white text-xl font-bold">59,000원</span>
          </div>
        </div>
      </div>
    </div>
  );
}