import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export function PromoBanner() {
  const { data: brandingData = [] } = useQuery({
    queryKey: ["/api/branding"],
    queryFn: async () => {
      const res = await fetch("/api/branding");
      return res.json();
    },
  });
  
  const banners = brandingData
    .filter((item: any) => item.key.startsWith("banner") && item.isActive && item.image)
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {banners.map((banner: any) => (
        banner.linkUrl ? (
          <Link key={banner.key} href={banner.linkUrl}>
            <a className="block w-full rounded-lg overflow-hidden" data-testid={`promo-${banner.key}`}>
              <img 
                src={banner.image} 
                alt="프로모션 배너"
                className="w-full h-auto object-cover"
              />
            </a>
          </Link>
        ) : (
          <div key={banner.key} className="w-full rounded-lg overflow-hidden" data-testid={`promo-${banner.key}`}>
            <img 
              src={banner.image} 
              alt="프로모션 배너"
              className="w-full h-auto object-cover"
            />
          </div>
        )
      ))}
    </div>
  );
}
