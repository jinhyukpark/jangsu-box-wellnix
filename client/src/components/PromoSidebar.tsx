import { Gift, Truck, Shield, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

// 스켈레톤 컴포넌트
function PromoSidebarSkeleton() {
  return (
    <aside className="hidden lg:flex flex-col w-[420px] h-screen bg-background sticky top-0 mr-16">
      <div className="flex flex-col h-full justify-center p-8 overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#006861] font-serif tracking-tight">
            웰닉스
          </h1>
        </div>

        <div className="flex flex-col">
          {/* 히어로 이미지 스켈레톤 */}
          <div className="relative rounded overflow-hidden mb-6 shadow-xl">
            <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse" />
          </div>

          {/* 배너 스켈레톤 */}
          <div className="flex flex-col gap-[15px] mt-3">
            <div className="w-full rounded overflow-hidden h-24 bg-gray-200 animate-pulse" />
            <div className="w-full rounded overflow-hidden h-24 bg-gray-200 animate-pulse" />
            <div className="w-full rounded overflow-hidden h-24 bg-gray-200 animate-pulse" />
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

export function PromoSidebar() {
  const { data: brandingData = [], isLoading } = useQuery<BrandingItem[]>({
    queryKey: ["/api/branding"],
    queryFn: async () => {
      const res = await fetch("/api/branding");
      if (!res.ok) throw new Error("Failed to fetch branding");
      return res.json();
    },
  });

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <PromoSidebarSkeleton />;
  }

  const getBranding = (key: string): BrandingItem & { displayImage: string | null } => {
    const item = brandingData.find((b) => b.key === key);
    return {
      key,
      title: item?.title ?? null,
      subtitle: item?.subtitle ?? null,
      image: item?.image ?? null,
      backgroundColor: item?.backgroundColor ?? "#ffffff",
      textColor: item?.textColor ?? "#333333",
      linkUrl: item?.linkUrl ?? null,
      linkText: item?.linkText ?? null,
      isActive: item?.isActive ?? true,
      displayImage: item?.image ?? null,
    };
  };

  const hero = getBranding("hero");
  const banner1 = getBranding("banner1");
  const banner2 = getBranding("banner2");
  const banner3 = getBranding("banner3");

  const renderBanner = (banner: ReturnType<typeof getBranding>) => {
    if (!banner.isActive || !banner.displayImage) return null;

    const content = (
      <div className="w-full rounded overflow-hidden h-24">
        <img
          src={banner.displayImage}
          alt="배너"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    );

    if (banner.linkUrl) {
      return (
        <Link href={banner.linkUrl} key={banner.key} className="block cursor-pointer">
          {content}
        </Link>
      );
    }
    return <div key={banner.key}>{content}</div>;
  };

  return (
    <aside className="hidden lg:flex flex-col w-[420px] h-screen bg-background sticky top-0 mr-16">
      <div className="flex flex-col h-full justify-center p-8 overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#006861] font-serif tracking-tight">
            웰닉스
          </h1>
        </div>
        
        <div className="flex flex-col">
          {hero.isActive && hero.displayImage && (
            <div className="relative rounded overflow-hidden mb-6 shadow-xl">
              {hero.linkUrl ? (
                <Link href={hero.linkUrl}>
                  <img
                    src={hero.displayImage}
                    alt="프로모션"
                    fetchPriority="high"
                    className="w-full aspect-[3/4] object-cover cursor-pointer"
                  />
                </Link>
              ) : (
                <img
                  src={hero.displayImage}
                  alt="프로모션"
                  fetchPriority="high"
                  className="w-full aspect-[3/4] object-cover"
                />
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-[15px] mt-3">
            {renderBanner(banner1)}
            {renderBanner(banner2)}
            {renderBanner(banner3)}
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
