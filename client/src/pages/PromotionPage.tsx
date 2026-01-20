import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

interface Promotion {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  period: string | null;
  heroImage: string | null;
  bannerImages: string[];
  benefits: { title: string; description: string }[];
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: string;
  reviewCount?: number;
}

export default function PromotionPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "seol-gift";

  const { data: dbPromotion, isLoading: promotionLoading } = useQuery<{ promotion: Promotion; products: Product[] } | null>({
    queryKey: ["/api/promotions", slug],
    queryFn: async () => {
      const res = await fetch(`/api/promotions/${slug}`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // 로딩 중이거나 데이터가 없으면 로딩 표시
  if (promotionLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!dbPromotion?.promotion) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white">
          <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="flex items-center px-4 py-3">
              <Link href="/">
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
              </Link>
              <h1 className="flex-1 text-center text-lg font-bold">프로모션</h1>
              <div className="w-9" />
            </div>
          </header>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-500">프로모션을 찾을 수 없습니다</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const promotion = dbPromotion.promotion;
  const filteredProducts = dbPromotion.products && dbPromotion.products.length > 0
    ? dbPromotion.products
    : allProducts.filter((p) => p.isFeatured);

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="flex items-center px-4 py-3">
            <Link href="/">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            </Link>
            <h1 className="flex-1 text-center text-lg font-bold">{promotion.title}</h1>
            <div className="w-9" />
          </div>
        </header>

        <div className="bg-gradient-to-b from-amber-50 to-white">
          <div className="text-center py-6">
            {promotion.period && (
              <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 text-sm rounded-full mb-4">
                {promotion.period}
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{promotion.title}</h2>
            {promotion.subtitle && (
              <p className="text-gray-600 text-sm px-6">{promotion.subtitle}</p>
            )}
          </div>

          {promotion.heroImage && (
            <div className="relative aspect-[4/3] mx-4 mb-6 rounded-xl overflow-hidden shadow-lg">
              <img
                src={promotion.heroImage}
                alt={promotion.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {promotion.benefits && promotion.benefits.length > 0 && (
            <div className="bg-white mx-4 mb-6 rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-center mb-4">혜택</h3>
              <div className="grid grid-cols-2 gap-3">
                {promotion.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${index === 0 ? "bg-amber-50 col-span-2" : "bg-gray-50"}`}
                  >
                    <p className="font-bold text-gray-900 text-sm">{benefit.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {promotion.bannerImages && promotion.bannerImages.length > 1 && (
            <div className="px-4 mb-6">
              {promotion.bannerImages.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-md mb-4"
                >
                  <img
                    src={img}
                    alt={`${promotion.title} 배너 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">관련 상품</h3>
            <span className="text-sm text-gray-500">{filteredProducts.length}개 상품</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-3">
                    {product.shortDescription && (
                      <p className="text-xs text-primary font-medium mb-1 truncate">
                        {product.shortDescription}
                      </p>
                    )}
                    <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-red-500 font-bold text-sm">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                          <span className="text-gray-400 text-xs line-through">
                            {product.originalPrice.toLocaleString()}원
                          </span>
                        </>
                      )}
                    </div>
                    <p className="font-bold text-gray-900">
                      {product.price.toLocaleString()}원
                    </p>
                    {product.reviewCount && product.reviewCount > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs text-gray-500">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">상품 준비 중입니다</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[430px] mx-auto">
          <div className="flex items-center justify-center gap-4">
            <Link href="/subscription" className="flex-1">
              <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                {slug === "jangsu-box" ? "장수박스 구독하기" : "상품 더보기"}
              </button>
            </Link>
          </div>
        </div>

        <div className="h-20" />
      </div>
    </AppLayout>
  );
}
