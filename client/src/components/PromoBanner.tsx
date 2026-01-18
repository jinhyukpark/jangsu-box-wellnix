import { images } from "@/lib/images";

export function PromoBanner() {
  return (
    <div className="px-4 py-4 space-y-3">
      <button
        className="w-full bg-stone-100 hover:bg-stone-200 rounded overflow-hidden flex items-center transition-all group relative h-28"
        data-testid="promo-corporate"
      >
        <div className="text-left flex-1 p-4 z-10">
          <h3 className="font-semibold text-stone-800 text-lg">기업 구매 전용 페이지</h3>
          <p className="text-sm text-stone-500">바로가기</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-36">
          <img 
            src={images.smilingOfficeWorkersTeam} 
            alt="기업 구매" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-transparent" />
        </div>
      </button>
      
      <button
        className="w-full bg-amber-50 hover:bg-amber-100 rounded overflow-hidden flex items-center transition-all group relative h-28"
        data-testid="promo-subscription"
      >
        <div className="text-left flex-1 p-4 z-10">
          <h3 className="font-semibold text-stone-800 text-lg">365일 장수박스 서비스</h3>
          <p className="text-sm text-stone-500">웰닉스 에디션에서 보기</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-36">
          <img 
            src={images.premiumKoreanHealthGiftBox} 
            alt="장수박스" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent" />
        </div>
      </button>
      
      <button
        className="w-full bg-emerald-50 hover:bg-emerald-100 rounded overflow-hidden flex items-center transition-all group relative h-28"
        data-testid="promo-customer-service"
      >
        <div className="text-left flex-1 p-4 z-10">
          <h3 className="font-semibold text-stone-800 text-lg">고객센터 1588-0000</h3>
          <p className="text-sm text-stone-500">평일 09:00 - 18:00</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-36">
          <img 
            src={images.customerServiceRepresentativeHeadset} 
            alt="고객센터" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent" />
        </div>
      </button>
    </div>
  );
}