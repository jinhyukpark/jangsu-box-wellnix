import { useState } from "react";
import { useLocation } from "wouter";
import { images } from "@/lib/images";

const categories = [
  { image: images.koreanRedGinsengRoots, label: "홍삼", slug: "hongsam" },
  { image: images.heartHealthSupplements, label: "혈압건강", slug: "blood-pressure" },
  { image: images.vitaminSupplementsPills, label: "영양제", slug: "supplements" },
  { image: images.freshFruitGiftBasket, label: "과일선물", slug: "fruit-gift" },
  { image: images.luxuryCosmeticsSkincareSet, label: "화장품", slug: "cosmetics" },
  { image: images.sleepHealthSupplements, label: "수면건강", slug: "sleep-health" },
  { image: images.koreanTeaSet, label: "차/음료", slug: "tea-drinks" },
  { image: images.jointHealthSupplements, label: "관절건강", slug: "joint-health" },
  { image: images.cuteDogAndCatTogether, label: "반려동물", slug: "pets" },
  { image: images.dailyToiletriesProducts, label: "생활용품", slug: "living-goods" },
];

// 개별 카테고리 아이템 컴포넌트 (각각 스켈레톤 처리)
function CategoryItem({ image, label, onClick }: { image: string; label: string; onClick: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      data-testid={`category-${label}`}
      className="flex flex-col items-center gap-2 group"
      onClick={onClick}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md relative">
        {/* 스켈레톤 (이미지 로드 전) */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
        )}
        {/* 실제 이미지 */}
        <img
          src={image}
          alt={label}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      {/* 라벨 스켈레톤 */}
      {!isLoaded ? (
        <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
      ) : (
        <span className="text-xs font-medium text-gray-700">{label}</span>
      )}
    </button>
  );
}

export function CategoryGrid() {
  const [, setLocation] = useLocation();

  const handleCategoryClick = (slug: string) => {
    setLocation(`/gifts?category=${slug}`);
  };

  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-5 gap-3">
        {categories.map((cat) => (
          <CategoryItem
            key={cat.label}
            image={cat.image}
            label={cat.label}
            onClick={() => handleCategoryClick(cat.slug)}
          />
        ))}
      </div>
    </div>
  );
}