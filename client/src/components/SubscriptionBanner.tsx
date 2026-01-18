import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { images } from "@/lib/images";

interface MainPageSettings {
  adBannerImage: string | null;
  adBannerLink: string | null;
  adBannerEnabled: boolean;
}

export function SubscriptionBanner() {
  const { data: settings } = useQuery<MainPageSettings>({
    queryKey: ["/api/main-page-settings"],
    queryFn: async () => {
      const res = await fetch("/api/main-page-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  if (settings?.adBannerEnabled === false) {
    return null;
  }

  const bannerImage = settings?.adBannerImage || images.happySeniorsOpeningGiftBox;
  const bannerLink = settings?.adBannerLink || "/subscription";

  const content = (
    <div className="mx-4 my-5 rounded overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity">
      <img 
        src={bannerImage} 
        alt="장수박스를 받은 행복한 부모님"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <h3 className="text-white text-xl font-bold mb-2 leading-snug font-serif drop-shadow-lg">
          <span className="underline decoration-amber-400 decoration-2 underline-offset-4">장수박스</span>로 부모님께<br />추억과 마음을 전하세요
        </h3>
        <p className="text-white/80 text-sm drop-shadow">
          매달 부모님께 건강과 사랑을 담아 보내드려요
        </p>
      </div>
    </div>
  );

  if (bannerLink) {
    return <Link href={bannerLink}>{content}</Link>;
  }

  return content;
}