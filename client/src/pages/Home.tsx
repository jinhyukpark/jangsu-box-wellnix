import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { CouponBanner } from "@/components/CouponBanner";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductSection } from "@/components/ProductSection";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { PromoBanner } from "@/components/PromoBanner";
import { EventSection } from "@/components/EventSection";
import { AppLayout } from "@/components/AppLayout";
import { useQuery } from "@tanstack/react-query";

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
}

export default function Home() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const activeProducts = products.filter(p => p.status === "active");
  const featuredProducts = activeProducts.filter(p => p.isFeatured);
  
  const bestProducts = featuredProducts.slice(0, 5).map((p, i) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    image: p.image || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400",
    rating: parseFloat(p.rating || "4.5"),
    reviewCount: p.reviewCount || 0,
    badge: i === 0 ? "베스트" : (i === 2 ? "인기" : undefined),
  }));

  const newProducts = activeProducts.slice(0, 5).map((p, i) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    image: p.image || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400",
    rating: parseFloat(p.rating || "4.5"),
    reviewCount: p.reviewCount || 0,
    badge: i === 0 ? "NEW" : undefined,
  }));

  const giftProducts = activeProducts.slice(0, 5).map((p, i) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    image: p.image || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400",
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
        
        <PromoBanner />
      </div>
    </AppLayout>
  );
}