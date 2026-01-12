import { Gift, Truck, Shield, Phone, ArrowRight, Smartphone } from "lucide-react";
import happySeniorsImage from "@assets/generated_images/happy_seniors_receiving_gift.png";
import officeTeamImage from "@assets/generated_images/smiling_office_workers_team.png";
import giftSetImage from "@assets/generated_images/korean_health_gift_set.png";

export function PromoSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[420px] h-screen bg-background sticky top-0 mr-8">
      <div className="flex flex-col h-full justify-center p-8 overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#006861] font-serif tracking-tight">
            웰닉스
          </h1>
        </div>
        
        <div className="flex flex-col">
          <div className="relative rounded overflow-hidden mb-6 shadow-xl">
            <img 
              src={happySeniorsImage} 
              alt="행복한 부모님"
              className="w-full aspect-[3/4] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-6">
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
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  부모님의 건강을 생각하는 당신을 위한<br />
                  프리미엄 건강식품 선물세트
                </p>
                
                <button 
                  className="w-full bg-white text-[#006861] font-bold py-4 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
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
              <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={officeTeamImage} 
                  alt="기업 구매"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-stone-800 text-sm">기업 구매 전용 페이지</h3>
                <p className="text-xs text-stone-500">바로가기</p>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="w-full bg-[#006861]/10 hover:bg-[#006861]/20 rounded p-4 flex items-center gap-4 transition-all group">
              <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={giftSetImage} 
                  alt="장수박스"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-stone-800 text-sm">365일 장수박스 서비스</h3>
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
                    <div key={i} className={`rounded-sm ${i % 3 === 0 ? 'bg-white' : 'bg-stone-800'}`} />
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