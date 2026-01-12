import ginsengImg from "@assets/generated_images/korean_red_ginseng_roots.png";
import heartImg from "@assets/generated_images/heart_health_supplements.png";
import vitaminImg from "@assets/generated_images/vitamin_supplements_pills.png";
import fruitImg from "@assets/generated_images/fresh_fruit_gift_basket.png";
import cosmeticsImg from "@assets/generated_images/luxury_cosmetics_skincare_set.png";
import sleepImg from "@assets/generated_images/sleep_health_supplements.png";
import teaImg from "@assets/generated_images/korean_tea_set.png";
import jointImg from "@assets/generated_images/joint_health_supplements.png";
import petImg from "@assets/generated_images/pet_care_health_products.png";
import energyImg from "@assets/generated_images/energy_boosting_supplements.png";

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
  { image: energyImg, label: "활력증진" },
];

export function CategoryGrid() {
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
            >
              <div className="w-14 h-14 rounded overflow-hidden bg-gray-50 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
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