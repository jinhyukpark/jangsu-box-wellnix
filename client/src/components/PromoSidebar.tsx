import { Gift, Truck, Shield, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { images } from "@/lib/images";
import { Link } from "wouter";

interface BrandingItem {
  key: string;
  title: string | null;
  subtitle: string | null;
  image: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  linkUrl: string | null;
  linkText: string | null;
  isActive: boolean;
}

const defaultImages: Record<string, string> = {
  hero: images.happySeniorsReceivingGift,
  banner1: images.smilingOfficeWorkersTeam,
  banner2: images.koreanHealthGiftSet,
  banner3: images.customerServiceRepresentativeHeadset,
};

const defaultData: Record<string, Partial<BrandingItem>> = {
  hero: {
    title: "건강한 삶의 명가, 부모님 효도는 웰닉스",
    subtitle: "부모님의 건강을 생각하는 당신을 위한 프리미엄 건강식품 선물세트",
    backgroundColor: "#f5f5f0",
    textColor: "#ffffff",
  },
  banner1: {
    title: "기업 구매 전용 페이지",
    subtitle: "바로가기",
    backgroundColor: "#f5f5f4",
    linkUrl: "/corporate",
  },
  banner2: {
    title: "365일 장수박스 서비스",
    subtitle: "웰닉스 에디션에서 보기",
    backgroundColor: "#e8f4f3",
    linkUrl: "/subscription",
  },
  banner3: {
    title: "고객센터 1588-0000",
    subtitle: "평일 09:00 - 18:00",
    backgroundColor: "#ecfdf5",
    linkUrl: "/support",
  },
};

export function PromoSidebar() {
  const { data: brandingData = [] } = useQuery<BrandingItem[]>({
    queryKey: ["branding"],
    queryFn: async () => {
      const res = await fetch("/api/branding");
      if (!res.ok) throw new Error("Failed to fetch branding");
      return res.json();
    },
  });

  const getBranding = (key: string): BrandingItem & { displayImage: string } => {
    const item = brandingData.find((b) => b.key === key);
    const defaults = defaultData[key] || {};
    return {
      key,
      title: item?.title ?? defaults.title ?? null,
      subtitle: item?.subtitle ?? defaults.subtitle ?? null,
      image: item?.image ?? null,
      backgroundColor: item?.backgroundColor ?? defaults.backgroundColor ?? "#ffffff",
      textColor: item?.textColor ?? defaults.textColor ?? "#333333",
      linkUrl: item?.linkUrl ?? defaults.linkUrl ?? null,
      linkText: item?.linkText ?? defaults.subtitle ?? null,
      isActive: item?.isActive ?? true,
      displayImage: item?.image || defaultImages[key] || images.happySeniorsReceivingGift,
    };
  };

  const hero = getBranding("hero");
  const banner1 = getBranding("banner1");
  const banner2 = getBranding("banner2");
  const banner3 = getBranding("banner3");

  const renderBanner = (banner: ReturnType<typeof getBranding>, bgGradient: string) => {
    if (!banner.isActive) return null;
    
    const content = (
      <button 
        className="w-full rounded overflow-hidden flex items-center transition-all group relative h-24"
        style={{ backgroundColor: banner.backgroundColor || undefined }}
      >
        <div className="text-left flex-1 p-4 z-10">
          <h3 className="font-semibold text-stone-800 text-sm">{banner.title}</h3>
          <p className="text-xs text-stone-500">{banner.subtitle}</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-32">
          <img 
            src={banner.displayImage}
            alt={banner.title || "배너"}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `linear-gradient(to right, ${banner.backgroundColor}, transparent)` 
            }} 
          />
        </div>
      </button>
    );

    if (banner.linkUrl) {
      return (
        <Link href={banner.linkUrl} key={banner.key}>
          {content}
        </Link>
      );
    }
    return <div key={banner.key}>{content}</div>;
  };

  const heroTitleParts = (hero.title || "").split(",").map((s) => s.trim());

  return (
    <aside className="hidden lg:flex flex-col w-[420px] h-screen bg-background sticky top-0 mr-16">
      <div className="flex flex-col h-full justify-center p-8 overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#006861] font-serif tracking-tight">
            웰닉스
          </h1>
        </div>
        
        <div className="flex flex-col">
          {hero.isActive && (
            <div className="relative rounded overflow-hidden mb-6 shadow-xl">
              <img 
                src={hero.displayImage}
                alt="행복한 부모님"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="text-center">
                  {heroTitleParts.map((part, i) => (
                    <h2 
                      key={i} 
                      className="text-2xl font-bold mb-2 font-serif leading-tight"
                      style={{ color: hero.textColor || "#ffffff" }}
                    >
                      {part}{i < heroTitleParts.length - 1 ? "," : ""}
                    </h2>
                  ))}
                  <p className="text-white/80 text-sm leading-relaxed">
                    {hero.subtitle?.split("<br />").map((line, i) => (
                      <span key={i}>{line}{i < (hero.subtitle?.split("<br />").length || 1) - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {renderBanner(banner1, "from-stone-100")}
            {renderBanner(banner2, "from-[#e8f4f3]")}
            {renderBanner(banner3, "from-emerald-50")}
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
