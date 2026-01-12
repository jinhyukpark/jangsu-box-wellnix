import { Gift, Truck, Shield, Phone } from "lucide-react";
import happySeniorsImage from "@assets/generated_images/happy_seniors_receiving_gift.png";
import officeTeamImage from "@assets/generated_images/smiling_office_workers_team.png";
import giftSetImage from "@assets/generated_images/korean_health_gift_set.png";
import customerServiceImage from "@assets/generated_images/customer_service_representative_headset.png";

export function PromoSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[420px] h-screen bg-background sticky top-0 mr-16">
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
                <h2 className="text-2xl font-bold text-white mb-2 font-serif leading-tight">
                  차이를 안다면,
                </h2>
                <h2 className="text-2xl font-bold text-white mb-3 font-serif leading-tight">
                  선물은 웰닉스
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  부모님의 건강을 생각하는 당신을 위한<br />
                  프리미엄 건강식품 선물세트
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-stone-100 hover:bg-stone-200 rounded overflow-hidden flex items-center transition-all group relative h-24">
              <div className="text-left flex-1 p-4 z-10">
                <h3 className="font-semibold text-stone-800 text-sm">기업 구매 전용 페이지</h3>
                <p className="text-xs text-stone-500">바로가기</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-32">
                <img 
                  src={officeTeamImage} 
                  alt="기업 구매"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-transparent" />
              </div>
            </button>
            
            <button className="w-full bg-[#e8f4f3] hover:bg-[#d8edeb] rounded overflow-hidden flex items-center transition-all group relative h-24">
              <div className="text-left flex-1 p-4 z-10">
                <h3 className="font-semibold text-stone-800 text-sm">365일 장수박스 서비스</h3>
                <p className="text-xs text-stone-500">웰닉스 에디션에서 보기</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-32">
                <img 
                  src={giftSetImage} 
                  alt="장수박스"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#e8f4f3] to-transparent" />
              </div>
            </button>
            
            <button className="w-full bg-emerald-50 hover:bg-emerald-100 rounded overflow-hidden flex items-center transition-all group relative h-24">
              <div className="text-left flex-1 p-4 z-10">
                <h3 className="font-semibold text-stone-800 text-sm">고객센터 1588-0000</h3>
                <p className="text-xs text-stone-500">평일 09:00 - 18:00</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-32">
                <img 
                  src={customerServiceImage} 
                  alt="고객센터"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent" />
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