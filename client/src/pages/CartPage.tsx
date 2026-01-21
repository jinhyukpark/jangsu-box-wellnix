import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Home, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/hooks/use-auth";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  rating?: string;
  reviewCount?: number;
  status: string;
}

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/mypage");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading) {
    return (
      <AppLayout hideNav>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const recommendedProducts = products
    .filter(p => p.status === "active")
    .slice(0, 10)
    .map(p => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || undefined,
      image: p.image,
      rating: parseFloat(p.rating || "4.5"),
      reviewCount: p.reviewCount || 0,
    }));

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => window.history.back()}
              className="w-9 h-9 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold">장바구니</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLocation("/corporate-inquiry")}
                className="text-xs font-medium text-primary border border-primary px-2 py-1 rounded"
              >
                기업문의
              </button>
              <button 
                onClick={() => setLocation("/")}
                className="w-9 h-9 flex items-center justify-center"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white">
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">장바구니가 비었어요.</p>
            <button 
              onClick={() => setLocation("/gifts")}
              className="text-primary font-medium flex items-center gap-1"
            >
              상품 둘러보기 <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        <div className="mt-4 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-1">
              지금 🔥HOT한 설로인 상품
            </h2>
            <button 
              onClick={() => setLocation("/gifts")}
              className="text-sm text-gray-500 flex items-center gap-1"
            >
              전체보기 <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
