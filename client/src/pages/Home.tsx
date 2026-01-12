import { Header } from "@/components/Header";
import { CouponBanner } from "@/components/CouponBanner";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductSection } from "@/components/ProductSection";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { PromoBanner } from "@/components/PromoBanner";
import { EventSection } from "@/components/EventSection";
import { BottomNav } from "@/components/BottomNav";
import { PromoSidebar } from "@/components/PromoSidebar";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const bestProducts = [
  { id: "1", name: "6년근 홍삼 정과 선물세트", price: 89000, originalPrice: 120000, image: giftBoxImage, rating: 4.9, reviewCount: 1247, badge: "베스트" },
  { id: "2", name: "유기농 벌꿀 & 호두 세트", price: 45000, originalPrice: 58000, image: giftBoxImage, rating: 4.8, reviewCount: 892 },
  { id: "3", name: "프리미엄 산삼배양근 세트", price: 158000, originalPrice: 198000, image: giftBoxImage, rating: 4.9, reviewCount: 456, badge: "인기" },
  { id: "4", name: "건강한 하루 종합비타민", price: 32000, image: giftBoxImage, rating: 4.7, reviewCount: 2134 },
  { id: "5", name: "관절엔 콘드로이친 골드", price: 68000, originalPrice: 85000, image: giftBoxImage, rating: 4.8, reviewCount: 678 },
];

const newProducts = [
  { id: "6", name: "2026 설 한정 프리미엄 홍삼", price: 129000, originalPrice: 168000, image: giftBoxImage, rating: 5.0, reviewCount: 89, badge: "NEW" },
  { id: "7", name: "유기농 블루베리 건강즙", price: 38000, image: giftBoxImage, rating: 4.8, reviewCount: 234 },
  { id: "8", name: "녹용 & 홍삼 스틱", price: 95000, originalPrice: 120000, image: giftBoxImage, rating: 4.9, reviewCount: 167, badge: "한정" },
  { id: "9", name: "순수 석류 콜라겐", price: 52000, image: giftBoxImage, rating: 4.7, reviewCount: 445 },
  { id: "10", name: "프로바이오틱스 골드", price: 42000, originalPrice: 55000, image: giftBoxImage, rating: 4.8, reviewCount: 892 },
];

const giftProducts = [
  { id: "11", name: "효도 선물 종합세트 A", price: 198000, originalPrice: 250000, image: giftBoxImage, rating: 4.9, reviewCount: 567, badge: "선물추천" },
  { id: "12", name: "부모님 건강 패키지", price: 145000, originalPrice: 180000, image: giftBoxImage, rating: 4.9, reviewCount: 345 },
  { id: "13", name: "장수 기원 선물세트", price: 89000, image: giftBoxImage, rating: 4.8, reviewCount: 234, badge: "인기" },
  { id: "14", name: "VIP 프리미엄 선물함", price: 320000, originalPrice: 400000, image: giftBoxImage, rating: 5.0, reviewCount: 89 },
  { id: "15", name: "건강한 겨울나기 세트", price: 78000, image: giftBoxImage, rating: 4.7, reviewCount: 456 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-xl">
        <CouponBanner />
        <Header />
        
        <div className="pb-24">
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
        
        <BottomNav />
      </main>
    </div>
  );
}