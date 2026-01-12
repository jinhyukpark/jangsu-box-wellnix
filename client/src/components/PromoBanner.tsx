import { Smartphone, Phone, Clock, MapPin } from "lucide-react";
import officeWorkersImage from "@assets/generated_images/smiling_office_workers_team.png";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";
import customerServiceImage from "@assets/generated_images/customer_service_representative_headset.png";

export function PromoBanner() {
  return (
    <div className="px-4 py-4 space-y-3">
      <button
        className="w-full bg-slate-100 rounded overflow-hidden flex items-center justify-between group transition-all duration-200 hover:shadow-md"
        data-testid="promo-corporate"
      >
        <div className="text-left p-4">
          <h3 className="font-semibold text-gray-800 text-lg">기업 구매 전용 페이지</h3>
          <p className="text-sm text-gray-500">바로가기</p>
        </div>
        <div className="h-24 w-32 overflow-hidden">
          <img 
            src={officeWorkersImage} 
            alt="기업 구매" 
            className="w-full h-full object-cover object-top"
          />
        </div>
      </button>
      
      <button
        className="w-full bg-amber-50 border border-amber-200 rounded overflow-hidden flex items-center justify-between group transition-all duration-200 hover:shadow-md"
        data-testid="promo-subscription"
      >
        <div className="text-left p-4">
          <h3 className="font-semibold text-gray-800 text-lg">365일 장수박스 서비스</h3>
          <p className="text-sm text-gray-500">웰닉스 에디션에서 보기</p>
        </div>
        <div className="h-24 w-32 overflow-hidden">
          <img 
            src={giftBoxImage} 
            alt="장수박스" 
            className="w-full h-full object-cover"
          />
        </div>
      </button>
      
      <button
        className="w-full bg-white border border-gray-200 rounded p-4 flex items-center justify-between group transition-all duration-200 hover:shadow-md"
        data-testid="promo-app"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border-2 border-amber-400 flex items-center justify-center text-amber-500">
            <Smartphone className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">웰닉스 모바일 앱 설치하고</h3>
            <p className="text-sm text-gray-500">다양한 혜택 받아보세요</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-900 rounded p-1">
          <div className="w-full h-full grid grid-cols-5 gap-0.5">
            {[1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1].map((v, i) => (
              <div key={i} className={v ? "bg-white" : "bg-gray-900"} />
            ))}
          </div>
        </div>
      </button>
      
      <div className="h-px bg-gray-200 my-4" />
      
      <div className="bg-[#006861] rounded-lg overflow-hidden flex items-stretch">
        <div className="flex-1 p-5 text-white">
          <h3 className="font-bold text-lg mb-1">고객센터</h3>
          <p className="text-2xl font-bold mb-3">1588-0000</p>
          <div className="space-y-1.5 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>평일 09:00 - 18:00</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>점심 12:00 - 13:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>주말/공휴일 휴무</span>
            </div>
          </div>
        </div>
        <div className="w-28 overflow-hidden">
          <img 
            src={customerServiceImage} 
            alt="고객센터" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}