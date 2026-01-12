import { Gift, Truck, Shield, Phone, ArrowRight } from "lucide-react";
import bgImage from "@assets/generated_images/organic_gradient_health_background.png";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const features = [
  { icon: Gift, text: "프리미엄 선물 포장" },
  { icon: Truck, text: "전국 무료 배송" },
  { icon: Shield, text: "100% 품질 보증" },
  { icon: Phone, text: "24시간 고객센터" },
];

export function PromoSidebar() {
  return (
    <aside 
      className="hidden lg:flex flex-col w-[400px] min-h-screen relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-emerald-800/70 to-teal-900/80" />
      
      <div className="relative z-10 flex flex-col h-full p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 font-serif">
            웰닉스
          </h1>
          <p className="text-emerald-200 text-sm">장수를 위한 건강 선물</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6">
            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 shadow-2xl">
              <img 
                src={giftBoxImage} 
                alt="장수 박스 선물세트"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center mb-6">
              <span className="inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                2026 설 얼리버드
              </span>
              <h2 className="text-2xl font-bold text-white mb-2 font-serif leading-tight">
                차이를 안다면,<br />선물은 웰닉스
              </h2>
              <p className="text-emerald-200 text-sm">
                부모님의 건강을 생각하는 당신을 위한<br />
                프리미엄 건강식품 선물세트
              </p>
            </div>
            
            <button 
              className="w-full bg-white text-emerald-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg"
              data-testid="sidebar-cta"
            >
              지금 구매하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.text}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-emerald-200/70 text-xs text-center">
            © 2026 웰닉스. 모든 권리 보유.
          </p>
        </div>
      </div>
    </aside>
  );
}