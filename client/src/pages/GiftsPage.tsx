import { useState, useRef } from "react";
import { Filter, ChevronDown, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { PromoSidebar } from "@/components/PromoSidebar";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";
import ginsengImg from "@assets/generated_images/korean_red_ginseng_roots.png";
import heartImg from "@assets/generated_images/heart_health_supplements.png";
import vitaminImg from "@assets/generated_images/vitamin_supplements_pills.png";
import fruitImg from "@assets/generated_images/fresh_fruit_gift_basket.png";
import cosmeticsImg from "@assets/generated_images/luxury_cosmetics_skincare_set.png";
import sleepImg from "@assets/generated_images/sleep_health_supplements.png";
import teaImg from "@assets/generated_images/korean_tea_set.png";
import jointImg from "@assets/generated_images/joint_health_supplements.png";
import petImg from "@assets/generated_images/cute_dog_and_cat_together.png";
import dailyImg from "@assets/generated_images/daily_toiletries_products.png";

const categories = [
  { image: ginsengImg, label: "홍삼" },
  { image: heartImg, label: "혈압건강" },
  { image: vitaminImg, label: "영양제" },
  { image: fruitImg, label: "과일선물" },
  { image: cosmeticsImg, label: "화장품" },
  { image: sleepImg, label: "수면건강" },
  { image: teaImg, label: "차/음료" },
  { image: jointImg, label: "관절건강" },
  { image: petImg, label: "반려동물" },
  { image: dailyImg, label: "생활용품" },
];

const products = [
  { id: "1", name: "6년근 홍삼 정과 선물세트", price: 89000, originalPrice: 120000, image: giftBoxImage, rating: 4.9, reviewCount: 1247, category: "홍삼" },
  { id: "2", name: "유기농 벌꿀 & 호두 세트", price: 45000, originalPrice: 58000, image: giftBoxImage, rating: 4.8, reviewCount: 892, category: "영양제" },
  { id: "3", name: "프리미엄 산삼배양근 세트", price: 158000, originalPrice: 198000, image: giftBoxImage, rating: 4.9, reviewCount: 456, category: "홍삼" },
  { id: "4", name: "건강한 하루 종합비타민", price: 32000, image: giftBoxImage, rating: 4.7, reviewCount: 2134, category: "영양제" },
  { id: "5", name: "관절엔 콘드로이친 골드", price: 68000, originalPrice: 85000, image: giftBoxImage, rating: 4.8, reviewCount: 678, category: "관절건강" },
  { id: "6", name: "2026 설 한정 프리미엄 홍삼", price: 129000, originalPrice: 168000, image: giftBoxImage, rating: 5.0, reviewCount: 89, category: "홍삼" },
  { id: "7", name: "프리미엄 과일 선물세트", price: 75000, originalPrice: 95000, image: giftBoxImage, rating: 4.9, reviewCount: 234, category: "과일선물" },
  { id: "8", name: "명품 화장품 세트", price: 189000, originalPrice: 230000, image: giftBoxImage, rating: 4.8, reviewCount: 567, category: "화장품" },
];

export default function GiftsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white shadow-xl">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="p-4 flex items-center gap-3">
            <button 
              onClick={() => setLocation("/")}
              className="p-1 hover:bg-gray-100 rounded-full"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">선물관</h1>
              <p className="text-sm text-gray-500">소중한 분께 건강을 선물하세요</p>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            onWheel={handleWheel}
            className="px-4 pb-4 overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
                  className={`flex flex-col items-center gap-2 min-w-[60px] transition-all ${
                    selectedCategory === cat.label ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                  data-testid={`gift-cat-${cat.label}`}
                >
                  <div className={`w-14 h-14 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center transition-all ${
                    selectedCategory === cat.label ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}>
                    <img 
                      src={cat.image} 
                      alt={cat.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    selectedCategory === cat.label ? "text-primary" : "text-gray-700"
                  }`}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="px-4 pb-3 flex items-center justify-between border-t border-gray-50 pt-3">
            <span className="text-sm text-gray-500">
              {selectedCategory ? `${selectedCategory} ` : "전체 "}
              {filteredProducts.length}개 상품
            </span>
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
        
        <div className="p-4 pb-24">
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer" data-testid={`gift-product-${product.id}`}>
                <div className="relative rounded-lg overflow-hidden bg-gray-50 mb-2">
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
                  <span>({product.reviewCount.toLocaleString()})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="sticky bottom-0 w-full z-50">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}