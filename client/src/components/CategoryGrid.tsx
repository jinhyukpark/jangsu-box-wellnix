import { useLocation } from "wouter";
import { images } from "@/lib/images";

const categories = [
  { image: images.koreanRedGinsengRoots, label: "홍삼" },
  { image: images.heartHealthSupplements, label: "혈압건강" },
  { image: images.vitaminSupplementsPills, label: "영양제" },
  { image: images.freshFruitGiftBasket, label: "과일선물" },
  { image: images.luxuryCosmeticsSkincareSet, label: "화장품" },
  { image: images.sleepHealthSupplements, label: "수면건강" },
  { image: images.koreanTeaSet, label: "차/음료" },
  { image: images.jointHealthSupplements, label: "관절건강" },
  { image: images.cuteDogAndCatTogether, label: "반려동물" },
  { image: images.dailyToiletriesProducts, label: "생활용품" },
];

export function CategoryGrid() {
  const [, setLocation] = useLocation();

  const handleCategoryClick = () => {
    setLocation("/gifts");
  };

  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-5 gap-3">
        {categories.map((cat, index) => {
          return (
            <button
              key={cat.label}
              data-testid={`category-${cat.label}`}
              className="flex flex-col items-center gap-2 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={handleCategoryClick}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
                <img 
                  src={cat.image} 
                  alt={cat.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-gray-700">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}