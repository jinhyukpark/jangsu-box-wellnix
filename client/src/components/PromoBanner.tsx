import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { images } from "@/lib/images";

interface PromoBannerProps {
  onCustomerServiceClick?: () => void;
}

export function PromoBanner({ onCustomerServiceClick }: PromoBannerProps) {
  const { data: brandingData = [] } = useQuery({
    queryKey: ["/api/branding"],
    queryFn: async () => {
      const res = await fetch("/api/branding");
      return res.json();
    },
  });
  
  const banners = brandingData
    .filter((item: any) => item.key.startsWith("banner") && item.isActive)
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {banners.map((banner: any) => {
        if (banner.image) {
          if (banner.linkUrl) {
            return (
              <Link key={banner.key} href={banner.linkUrl}>
                <a className="block w-full rounded-lg overflow-hidden" data-testid={`promo-${banner.key}`}>
                  <img 
                    src={banner.image} 
                    alt="프로모션 배너"
                    className="w-full h-auto object-cover"
                  />
                </a>
              </Link>
            );
          } else {
            return (
              <div key={banner.key} className="w-full rounded-lg overflow-hidden" data-testid={`promo-${banner.key}`}>
                <img 
                  src={banner.image} 
                  alt="프로모션 배너"
                  className="w-full h-auto object-cover"
                />
              </div>
            );
          }
        }
        return null;
      })}
      
      <button
        onClick={onCustomerServiceClick}
        className="w-full rounded-lg overflow-hidden flex items-center transition-all group relative h-28"
        style={{ backgroundColor: "#e8f4f8" }}
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
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #e8f4f8, transparent)" }} />
        </div>
      </button>
    </div>
  );
}
