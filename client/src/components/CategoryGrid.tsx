import { Leaf, Heart, Pill, Apple, Sun, Moon, Coffee, Flower2, Sparkles, Zap } from "lucide-react";

const categories = [
  { icon: Leaf, label: "홍삼", color: "bg-red-50 text-red-600" },
  { icon: Heart, label: "혈압건강", color: "bg-pink-50 text-pink-600" },
  { icon: Pill, label: "영양제", color: "bg-blue-50 text-blue-600" },
  { icon: Apple, label: "과일선물", color: "bg-green-50 text-green-600" },
  { icon: Sun, label: "비타민", color: "bg-yellow-50 text-yellow-600" },
  { icon: Moon, label: "수면건강", color: "bg-indigo-50 text-indigo-600" },
  { icon: Coffee, label: "차/음료", color: "bg-amber-50 text-amber-700" },
  { icon: Flower2, label: "관절건강", color: "bg-teal-50 text-teal-600" },
  { icon: Sparkles, label: "프리미엄", color: "bg-purple-50 text-purple-600" },
  { icon: Zap, label: "활력증진", color: "bg-orange-50 text-orange-600" },
];

export function CategoryGrid() {
  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-5 gap-3">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.label}
              data-testid={`category-${cat.label}`}
              className="flex flex-col items-center gap-2 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md`}>
                <Icon className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <span className="text-xs font-medium text-gray-700">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}