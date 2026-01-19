import { Heart, Star } from "lucide-react";
import { Link } from "wouter";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export function ProductCard({ id, name, price, originalPrice, image, rating, reviewCount, badge }: ProductCardProps) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  
  return (
    <Link 
      href={`/products/${id}`}
      className="flex-shrink-0 w-40 group cursor-pointer block"
      data-testid={`product-card-${id}`}
    >
      <div className="relative mb-2 rounded overflow-hidden bg-gray-50">
        <img 
          src={image} 
          alt={name}
          draggable={false}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
        />
        {badge && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-lg">
            {badge}
          </span>
        )}
        <button 
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          data-testid={`wishlist-${id}`}
        >
          <Heart className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{name}</h3>
        <div className="flex items-center gap-1">
          {discount > 0 && (
            <span className="text-sm font-bold text-red-500">{discount}%</span>
          )}
          <span className="text-base font-bold text-gray-900">
            {price.toLocaleString()}원
          </span>
        </div>
        {originalPrice && (
          <span className="text-xs text-gray-400 line-through">
            {originalPrice.toLocaleString()}원
          </span>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span>({reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}