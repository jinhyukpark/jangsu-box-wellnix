import { useState, useRef } from "react";
import { Filter, ChevronDown, ArrowLeft, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
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

const categoryImages = [
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

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  rating?: string;
  reviewCount?: number;
  categoryId?: number;
  status: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function GiftsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const activeProducts = products.filter(p => p.status === "active");
  const filteredProducts = selectedCategory
    ? activeProducts.filter(p => p.categoryId === selectedCategory)
    : activeProducts;

  const getCategoryImage = (categoryName: string) => {
    const found = categoryImages.find(c => categoryName?.includes(c.label) || c.label.includes(categoryName || ""));
    return found?.image || categoryImages[0].image;
  };

  return (
    <AppLayout>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLocation("/")}
              className="p-1 hover:bg-gray-100 rounded-full"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">선물관</h1>
          </div>
          <button className="relative p-2" data-testid="cart-btn">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        
        <div 
          ref={scrollRef}
          onWheel={handleWheel}
          className="px-4 pb-4 overflow-x-auto scrollbar-hide"
        >
          <div className="flex gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`flex flex-col items-center gap-2 min-w-[60px] transition-all ${
                    isSelected || selectedCategory === null ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                  data-testid={`gift-cat-${cat.slug}`}
                >
                  <div className={`w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center transition-all border-2 ${
                    isSelected ? "border-[#006861]" : "border-transparent"
                  }`}>
                    <img 
                      src={getCategoryImage(cat.name)} 
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    isSelected ? "text-[#006861]" : "text-gray-700"
                  }`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="px-4 pb-3 flex items-center justify-between border-t border-gray-50 pt-3">
          <span className="text-sm text-gray-500">
            {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name} ` : "전체 "}
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
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            등록된 상품이 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const discountPercent = product.originalPrice && product.originalPrice > product.price
                ? Math.round((1 - product.price / product.originalPrice) * 100)
                : 0;
              return (
                <div 
                  key={product.id} 
                  className="group cursor-pointer" 
                  data-testid={`gift-product-${product.id}`}
                  onClick={() => setLocation(`/products/${product.id}`)}
                >
                  <div className="relative rounded-lg overflow-hidden bg-gray-50 mb-2">
                    <img 
                      src={product.image || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400"} 
                      alt={product.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    {discountPercent > 0 && (
                      <span className="text-sm font-bold text-red-500">
                        {discountPercent}%
                      </span>
                    )}
                    <span className="text-base font-bold text-gray-900">
                      {product.price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <span className="text-yellow-500">★</span>
                    <span>{product.rating || "0.0"}</span>
                    <span>({(product.reviewCount || 0).toLocaleString()})</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
