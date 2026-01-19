import { useState, useRef } from "react";
import { Filter, ChevronDown, ArrowLeft, ShoppingCart, Check, Search, X } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { images } from "@/lib/images";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const categoryImageMap: Record<string, string> = {
  "hongsam": images.koreanRedGinsengRoots,
  "blood-pressure": images.heartHealthSupplements,
  "supplements": images.vitaminSupplementsPills,
  "fruit-gift": images.freshFruitGiftBasket,
  "cosmetics": images.luxuryCosmeticsSkincareSet,
  "sleep-health": images.sleepHealthSupplements,
  "tea-drinks": images.koreanTeaSet,
  "joint-health": images.jointHealthSupplements,
  "pets": images.cuteDogAndCatTogether,
  "living-goods": images.dailyToiletriesProducts,
};

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
  image?: string;
}

type SortOption = "popular" | "newest" | "price-low" | "price-high" | "rating";
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "인기순" },
  { value: "newest", label: "최신순" },
  { value: "price-low", label: "낮은가격순" },
  { value: "price-high", label: "높은가격순" },
  { value: "rating", label: "평점순" },
];

export default function GiftsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [filterOnlyDiscount, setFilterOnlyDiscount] = useState(false);
  const [filterPriceOption, setFilterPriceOption] = useState<string>("all");
  const [filterMinRating, setFilterMinRating] = useState(0);

  const priceOptions = [
    { value: "all", label: "전체", min: 0, max: Infinity },
    { value: "under50", label: "5만원 이하", min: 0, max: 50000 },
    { value: "50to100", label: "5~10만원", min: 50000, max: 100000 },
    { value: "100to200", label: "10~20만원", min: 100000, max: 200000 },
    { value: "over200", label: "20만원 이상", min: 200000, max: Infinity },
  ];

  const getFilterPriceRange = () => {
    const option = priceOptions.find(o => o.value === filterPriceOption);
    return option ? [option.min, option.max] : [0, Infinity];
  };

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
  
  let filteredProducts = selectedCategory
    ? activeProducts.filter(p => p.categoryId === selectedCategory)
    : activeProducts;
  
  if (filterOnlyDiscount) {
    filteredProducts = filteredProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
  }
  
  const priceRange = getFilterPriceRange();
  filteredProducts = filteredProducts.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );
  
  if (filterMinRating > 0) {
    filteredProducts = filteredProducts.filter(p => parseFloat(p.rating || "0") >= filterMinRating);
  }
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case "newest":
        return b.id - a.id;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setFilterOnlyDiscount(false);
    setFilterPriceOption("all");
    setFilterMinRating(0);
  };

  const hasActiveFilters = filterOnlyDiscount || filterPriceOption !== "all" || filterMinRating > 0;

  const getCategoryImage = (cat: Category) => {
    if (cat.image) return cat.image;
    return categoryImageMap[cat.slug] || images.koreanRedGinsengRoots;
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
          <div className="flex items-center gap-1">
            <Link href="/search">
              <button className="p-2 hover:bg-gray-100 rounded-full" data-testid="search-btn">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <button className="relative p-2" data-testid="cart-btn">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
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
                      src={getCategoryImage(cat)} 
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
            {sortedProducts.length}개 상품
          </span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-sm text-gray-600"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                data-testid="sort-btn"
              >
                {sortOptions.find(o => o.value === sortBy)?.label} <ChevronDown className="w-4 h-4" />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 ${
                          sortBy === option.value ? "text-primary font-medium" : "text-gray-600"
                        }`}
                        onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                        data-testid={`sort-${option.value}`}
                      >
                        {option.label}
                        {sortBy === option.value && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              className={`p-2 rounded-lg hover:bg-gray-100 relative ${hasActiveFilters ? "text-primary" : ""}`}
              onClick={() => setShowFilterModal(true)}
              data-testid="filter-btn"
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      <div className="p-4 pb-24">
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {hasActiveFilters ? "조건에 맞는 상품이 없습니다" : "등록된 상품이 없습니다"}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map((product) => {
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

      {showFilterModal && (
        <>
          <div 
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => setShowFilterModal(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 animate-in slide-in-from-bottom duration-300">
            <div className="relative p-4">
              <button 
                onClick={() => setShowFilterModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h3 className="text-lg font-bold text-center mb-4">필터</h3>
              
              <div className="space-y-5 pb-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox 
                      checked={filterOnlyDiscount}
                      onCheckedChange={(checked) => setFilterOnlyDiscount(!!checked)}
                    />
                    <span className="text-sm font-medium">할인 상품만 보기</span>
                  </label>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">가격대</h4>
                  <div className="flex flex-wrap gap-2">
                    {priceOptions.map(option => (
                      <button
                        key={option.value}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          filterPriceOption === option.value
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setFilterPriceOption(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">최소 평점</h4>
                  <div className="flex flex-wrap gap-2">
                    {[0, 3, 3.5, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          filterMinRating === rating 
                            ? "bg-primary text-white border-primary" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setFilterMinRating(rating)}
                      >
                        {rating === 0 ? "전체" : `${rating}★ 이상`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 pb-4">
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                  초기화
                </Button>
                <Button className="flex-1" onClick={() => setShowFilterModal(false)}>
                  적용하기
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
