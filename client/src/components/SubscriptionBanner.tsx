import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { images } from "@/lib/images";

interface MainPageSettings {
  adBannerImage: string | null;
  adBannerLink: string | null;
  adBannerEnabled: boolean;
}

function SubscriptionBannerSkeleton() {
  return (
    <div className="mx-4 my-5 rounded overflow-hidden relative">
      <div className="w-full h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
      </div>
    </div>
  );
}

export function SubscriptionBanner() {
  const { data: settings, isLoading } = useQuery<MainPageSettings>({
    queryKey: ["/api/main-page-settings"],
    queryFn: async () => {
      const res = await fetch("/api/main-page-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <SubscriptionBannerSkeleton />;
  }

  if (settings?.adBannerEnabled === false) {
    return null;
  }

  const bannerImage = settings?.adBannerImage || images.happySeniorsOpeningGiftBox;
  const bannerLink = settings?.adBannerLink || "/subscription";

  const content = (
    <div className="mx-4 my-5 rounded overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity bg-gray-50">
      <img
        src={bannerImage}
        alt="광고 배너"
        loading="lazy"
        className="w-full h-64 object-contain"
      />
    </div>
  );

  if (bannerLink) {
    return <Link href={bannerLink}>{content}</Link>;
  }

  return content;
}