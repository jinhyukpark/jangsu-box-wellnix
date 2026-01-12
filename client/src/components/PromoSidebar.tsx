import { Gift, Truck, Shield, Phone, ArrowRight, Headphones, Smartphone, Building2 } from "lucide-react";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

export function PromoSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[420px] h-screen bg-background sticky top-0 mr-8">
      <div className="flex flex-col h-full justify-center p-8 overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-emerald-700 font-serif tracking-tight">
            웰닉스
          </h1>
        </div>
        
        <div className="flex flex-col">
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded p-6 mb-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl" />
            </div>
            
            <div className="relative z-10">
              <div className="w-full aspect-[4/3] rounded overflow-hidden mb-5 shadow-2xl bg-white/10">
                <img 
                  src={giftBoxImage} 
                  alt="장수 박스 선물세트"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center">
                <span className="inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  2026 설 얼리버드
                </span>
                <h2 className="text-2xl font-bold text-white mb-2 font-serif leading-tight">
                  차이를 안다면,
                </h2>
                <h2 className="text-2xl font-bold text-white mb-3 font-serif leading-tight">
                  선물은 웰닉스
                </h2>
                <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                  부모님의 건강을 생각하는 당신을 위한<br />
                  프리미엄 건강식품 선물세트
                </p>
                
                <button 
                  className="w-full bg-white text-emerald-700 font-bold py-4 rounded flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
                  data-testid="sidebar-cta"
                >
                  지금 구매하기
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-stone-200/80 hover:bg-stone-200 rounded p-4 flex items-center gap-4 transition-all group">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6 text-stone-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-stone-800 text-sm">기업 구매 전용 페이지</h3>
                <p className="text-xs text-stone-500">바로가기</p>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="w-full bg-emerald-50/80 hover:bg-emerald-100/80 rounded p-4 flex items-center gap-4 transition-all group">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm">
                <Headphones className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-stone-800 text-sm">받는 분 맞춤 컨시어지 서비스</h3>
                <p className="text-xs text-stone-500">웰닉스 에디션에서 보기</p>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="w-full bg-amber-50/80 hover:bg-amber-100/80 rounded p-4 flex items-center gap-4 transition-all group">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm">
                <Smartphone className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-stone-800 text-sm">웰닉스 모바일 앱 설치하고</h3>
                <p className="text-xs text-stone-500">다양한 혜택 받아보세요</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-md p-1 shadow-sm">
                <div className="w-full h-full bg-stone-800 rounded-sm grid grid-cols-4 grid-rows-4 gap-0.5 p-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.3 ? 'bg-white' : 'bg-stone-800'}`} />
                  ))}
                </div>
              </div>
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-stone-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <Gift className="w-4 h-4" />
                <span>프리미엄 선물 포장</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <Truck className="w-4 h-4" />
                <span>전국 무료 배송</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <Shield className="w-4 h-4" />
                <span>100% 품질 보증</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <Phone className="w-4 h-4" />
                <span>24시간 고객센터</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}