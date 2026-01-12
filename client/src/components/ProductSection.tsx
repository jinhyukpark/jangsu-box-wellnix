import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function ProductSection({ title, subtitle, products }: ProductSectionProps) {
  return (
    <section className="py-5">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <button 
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          data-testid={`section-more-${title}`}
        >
          더보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}