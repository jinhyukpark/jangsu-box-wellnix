import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { CouponBanner } from "@/components/CouponBanner";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductSection } from "@/components/ProductSection";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { Footer } from "@/components/Footer";
import { EventSection } from "@/components/EventSection";
import { AppLayout } from "@/components/AppLayout";
import { CustomerServicePopup } from "@/components/CustomerServicePopup";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  rating?: string;
  reviewCount?: number;
  isFeatured?: boolean;
  status: string;
  createdAt?: string;
}

interface MainPageSettings {
  bestProductsCriteria: "sales" | "manual";
  bestProductsManualIds: number[];
  bestProductsLimit: number;
  adBannerImage: string | null;
  adBannerLink: string | null;
  adBannerEnabled: boolean;
  newProductsCriteria: "recent" | "manual";
  newProductsManualIds: number[];
  newProductsLimit: number;
  newProductsDaysThreshold: number;
  eventsCriteria: "active" | "manual";
  eventsManualIds: number[];
  eventsLimit: number;
}

export default function Home() {
  const [showCustomerService, setShowCustomerService] = useState(false);
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: settings } = useQuery<MainPageSettings>({
    queryKey: ["/api/main-page-settings"],
    queryFn: async () => {
      const res = await fetch("/api/main-page-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const activeProducts = products.filter(p => p.status === "active");
  
  const getBestProducts = () => {
    const limit = settings?.bestProductsLimit || 6;
    if (settings?.bestProductsCriteria === "manual" && settings.bestProductsManualIds?.length > 0) {
      return activeProducts
        .filter(p => settings.bestProductsManualIds.includes(p.id))
        .slice(0, limit);
    }
    return activeProducts.filter(p => p.isFeatured).slice(0, limit);
  };

  const getNewProducts = () => {
    const limit = settings?.newProductsLimit || 6;
    if (settings?.newProductsCriteria === "manual" && settings.newProductsManualIds?.length > 0) {
      return activeProducts
        .filter(p => settings.newProductsManualIds.includes(p.id))
        .slice(0, limit);
    }
    const daysThreshold = settings?.newProductsDaysThreshold || 30;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    return activeProducts
      .filter(p => p.createdAt && new Date(p.createdAt) >= thresholdDate)
      .slice(0, limit);
  };
  
  const bestProducts = getBestProducts().map((p, i) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    image: p.image || "/objects/public/d9f3ffe9-dc92-4270-a08d-699008125503",
    rating: parseFloat(p.rating || "4.5"),
    reviewCount: p.reviewCount || 0,
    badge: i === 0 ? "베스트" : (i === 2 ? "인기" : undefined),
  }));

  const newProducts = getNewProducts().map((p, i) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    image: p.image || "/objects/public/d9f3ffe9-dc92-4270-a08d-699008125503",
    rating: parseFloat(p.rating || "4.5"),
    reviewCount: p.reviewCount || 0,
    badge: i === 0 ? "NEW" : undefined,
  }));

  const giftProducts = activeProducts.slice(0, 5).map((p, i) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    image: p.image || "/objects/public/d9f3ffe9-dc92-4270-a08d-699008125503",
    rating: parseFloat(p.rating || "4.5"),
    reviewCount: p.reviewCount || 0,
    badge: i === 0 ? "선물추천" : (i === 2 ? "인기" : undefined),
  }));
  return (
    <AppLayout>
      <SEO 
        title="홈" 
        description="부모님을 위한 프리미엄 건강식품 큐레이션 서비스, 웰닉스입니다."
      />
      <div className="sticky top-0 z-50">
        <CouponBanner />
        <Header />
      </div>
      
      <div className="pb-20">
        <HeroBanner />
        
        <CategoryGrid />
        
        <div className="h-2 bg-gray-50" />
        
        <ProductSection 
          title="베스트 상품" 
          subtitle="가장 사랑받는 건강식품"
          products={bestProducts}
        />
        
        <SubscriptionBanner />
        
        <ProductSection 
          title="신상품" 
          subtitle="새롭게 출시된 건강식품"
          products={newProducts}
        />
        
        <div className="h-2 bg-gray-50" />
        
        <EventSection />
        
        <div className="h-2 bg-gray-50" />
        
        <ProductSection 
          title="설 선물 추천" 
          subtitle="부모님께 드리는 건강 선물"
          products={giftProducts}
        />
        
        <Footer onCustomerServiceClick={() => setShowCustomerService(true)} />
        
        <CustomerServicePopup 
          open={showCustomerService} 
          onClose={() => setShowCustomerService(false)} 
        />
      </div>
    </AppLayout>
  );
}