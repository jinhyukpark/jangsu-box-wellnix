import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface MainPageSettings {
  heroImage: string | null;
  heroLink: string | null;
  heroEnabled: boolean;
}

function HeroBannerSkeleton() {
  return (
    <div className="relative min-h-[280px] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
    </div>
  );
}

export function HeroBanner() {
  // 메인 페이지 설정에서 히어로 배너 가져오기
  const { data: settings, isLoading: settingsLoading } = useQuery<MainPageSettings>({
    queryKey: ["/api/main-page-settings"],
    queryFn: async () => {
      const res = await fetch("/api/main-page-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });

  // 기존 branding API도 fallback으로 사용
  const { data: brandingData = [], isLoading: brandingLoading } = useQuery({
    queryKey: ["/api/branding"],
    queryFn: async () => {
      const res = await fetch("/api/branding");
      return res.json();
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });

  const isLoading = settingsLoading || brandingLoading;
  const heroItem = brandingData.find((item: any) => item.key === "hero" && item.isActive);

  // 메인 페이지 설정의 히어로 배너가 있으면 우선 사용, 없으면 기존 branding 사용
  const heroImage = settings?.heroEnabled && settings?.heroImage 
    ? settings.heroImage 
    : (heroItem?.image || null);
  const heroLink = settings?.heroLink || heroItem?.linkUrl || null;

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <HeroBannerSkeleton />;
  }

  // 데이터가 없으면 표시하지 않음
  if (!heroImage) {
    return null;
  }

  const content = (
    <div 
      className="relative w-full h-[280px] bg-gray-50 flex items-center justify-center overflow-hidden"
      data-testid="hero-banner"
    >
      <img
        src={heroImage}
        alt="프로모션 이미지"
        fetchPriority="high"
        className="w-full h-full object-contain"
      />
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      {heroLink ? (
        <Link href={heroLink}>
          <a className="block cursor-pointer">{content}</a>
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
