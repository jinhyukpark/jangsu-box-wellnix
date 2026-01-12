import { Filter, ChevronDown } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PromoSidebar } from "@/components/PromoSidebar";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const categories = ["전체", "홍삼", "건강식품", "차/음료", "프리미엄", "효도선물"];

const products = [
  { id: "1", name: "6년근 홍삼 정과 선물세트", price: 89000, originalPrice: 120000, image: giftBoxImage, rating: 4.9, reviewCount: 1247 },
  { id: "2", name: "유기농 벌꿀 & 호두 세트", price: 45000, originalPrice: 58000, image: giftBoxImage, rating: 4.8, reviewCount: 892 },
  { id: "3", name: "프리미엄 산삼배양근 세트", price: 158000, originalPrice: 198000, image: giftBoxImage, rating: 4.9, reviewCount: 456 },
  { id: "4", name: "건강한 하루 종합비타민", price: 32000, image: giftBoxImage, rating: 4.7, reviewCount: 2134 },
  { id: "5", name: "관절엔 콘드로이친 골드", price: 68000, originalPrice: 85000, image: giftBoxImage, rating: 4.8, reviewCount: 678 },
  { id: "6", name: "2026 설 한정 프리미엄 홍삼", price: 129000, originalPrice: 168000, image: giftBoxImage, rating: 5.0, reviewCount: 89 },
];

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-xl">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900">선물관</h1>
            <p className="text-sm text-gray-500 mt-0.5">소중한 분께 건강을 선물하세요</p>
          </div>
          
          <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {categories.map((cat, index) => (
                <button
                  key={cat}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    index === 0 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-testid={`gift-cat-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="px-4 pb-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">총 {products.length}개 상품</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-sm text-gray-600" data-testid="sort-btn">
                인기순 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100" data-testid="filter-btn">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </header>
        
        <div className="pb-24 p-4">
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer" data-testid={`gift-product-${product.id}`}>
                <div className="relative rounded-2xl overflow-hidden bg-gray-50 mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1">{product.name}</h3>
                <div className="flex items-center gap-1">
                  {product.originalPrice && (
                    <span className="text-sm font-bold text-red-500">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                  <span className="text-base font-bold text-gray-900">
                    {product.price.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <span className="text-yellow-500">★</span>
                  <span>{product.rating}</span>
                  <span>({product.reviewCount})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <BottomNav />
      </main>
    </div>
  );
}