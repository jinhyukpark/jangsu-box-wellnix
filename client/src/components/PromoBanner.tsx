import { ArrowRight, Building2, Headphones, Smartphone } from "lucide-react";

const promos = [
  {
    icon: Building2,
    title: "기업 구매 전용 페이지",
    subtitle: "대량 구매 할인 혜택",
    color: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    icon: Headphones,
    title: "맞춤 컨시어지 서비스",
    subtitle: "건강 전문가 상담 받기",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Smartphone,
    title: "웰닉스 앱 설치하고",
    subtitle: "다양한 혜택 받아보세요",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export function PromoBanner() {
  return (
    <div className="px-4 py-4 space-y-3">
      {promos.map((promo, index) => {
        const Icon = promo.icon;
        return (
          <button
            key={promo.title}
            className={`w-full ${promo.color} rounded p-4 flex items-center justify-between group transition-all duration-200 hover:shadow-md animate-slide-up`}
            style={{ animationDelay: `${index * 100}ms` }}
            data-testid={`promo-${index}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded bg-white flex items-center justify-center ${promo.iconColor}`}>
                <Icon className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 text-sm">{promo.title}</h3>
                <p className="text-xs text-gray-500">{promo.subtitle}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>
        );
      })}
    </div>
  );
}