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
        className="w-full bg-emerald-50 border border-emerald-100 rounded overflow-hidden flex items-center justify-between group transition-all duration-200 hover:shadow-md"
        data-testid="promo-customer-service"
      >
        <div className="text-left p-4">
          <h3 className="font-semibold text-gray-800 text-lg">고객센터 1588-0000</h3>
          <p className="text-sm text-gray-500">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
        </div>
        <div className="h-24 w-28 overflow-hidden">
          <img 
            src={customerServiceImage} 
            alt="고객센터" 
            className="w-full h-full object-cover"
          />
        </div>
      </button>
    </div>
  );
}