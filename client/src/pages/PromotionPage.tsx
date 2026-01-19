import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { images } from "@/lib/images";

interface PromotionConfig {
  title: string;
  subtitle: string;
  description: string;
  period: string;
  heroImage: string;
  bannerImages: string[];
  benefits: { title: string; description: string }[];
  categoryIds?: number[];
}

const promotionConfigs: Record<string, PromotionConfig> = {
  "seol-gift": {
    title: "2026 설 선물세트",
    subtitle: "새해 첫 선물로, 특별함과 다양함을 담은 세트를 추천해요.",
    description: "부모님께 전하는 건강한 설 선물",
    period: "1. 12(월) ~ 2. 27(목)",
    heroImage: images.luxuryKoreanHealthGiftSet,
    bannerImages: [
      images.luxuryKoreanHealthGiftSet,
      images.premiumLuxuryGiftBox,
    ],
    benefits: [
      { title: "얼리버드 혜택", description: "1.12 ~ 1.29 기간 주문 시 추가 할인" },
      { title: "보자기 포장 제공", description: "100% 국내산 보자기 포장 제공" },
      { title: "세뱃돈 봉투 3종", description: "프리미엄 세트 구매 시 증정" },
    ],
    categoryIds: [8, 10, 11],
  },
  "jangsu-box": {
    title: "장수박스",
    subtitle: "매월 정기 배송되는 프리미엄 건강 선물 세트",
    description: "부모님의 건강을 매달 챙겨드립니다",
    period: "매월 정기 배송",
    heroImage: images.happySeniorsOpeningGiftBox,
    bannerImages: [
      images.happySeniorsOpeningGiftBox,
      images.koreanHealthGiftSet,
    ],
    benefits: [
      { title: "정기 배송 할인", description: "매월 10% 추가 할인 적용" },
      { title: "무료 배송", description: "전 상품 무료 배송" },
      { title: "구독 선물", description: "3개월 구독 시 건강즙 세트 증정" },
    ],
    categoryIds: [8, 9, 10],
  },
  "health-travel": {
    title: "건강 여행",
    subtitle: "건강한 여행을 위한 필수 아이템",
    description: "여행길에도 건강을 챙기세요",
    period: "상시 진행",
    heroImage: images.koreanTempleAutumnTravel,
    bannerImages: [
      images.koreanTempleAutumnTravel,
    ],
    benefits: [
      { title: "휴대용 세트", description: "여행에 편리한 휴대용 포장" },
      { title: "여행 할인", description: "여행 시즌 특별 할인" },
    ],
    categoryIds: [10, 14],
  },
  "popular": {
    title: "인기 상품",
    subtitle: "고객님들이 가장 많이 찾는 베스트셀러",
    description: "믿고 구매하는 인기 상품",
    period: "실시간 인기 순위",
    heroImage: images.koreanRedGinsengRoots,
    bannerImages: [
      images.koreanRedGinsengRoots,
      images.vitaminSupplementsPills,
    ],
    benefits: [
      { title: "베스트셀러", description: "검증된 인기 상품만 모았습니다" },
      { title: "고객 후기", description: "수천 건의 실제 구매 후기" },
    ],
    categoryIds: undefined,
  },
};

export default function PromotionPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "seol-gift";
  const staticConfig = promotionConfigs[slug] || promotionConfigs["seol-gift"];

  const { data: dbPromotion } = useQuery<{ promotion: any; products: any[] }>({
    queryKey: ["/api/promotions", slug],
    queryFn: async () => {
      const res = await fetch(`/api/promotions/${slug}`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const config = dbPromotion?.promotion ? {
    title: dbPromotion.promotion.title,
    subtitle: dbPromotion.promotion.subtitle || "",
    description: dbPromotion.promotion.description || "",
    period: dbPromotion.promotion.period || "",
    heroImage: dbPromotion.promotion.heroImage || staticConfig.heroImage,
    bannerImages: dbPromotion.promotion.bannerImages || [],
    benefits: dbPromotion.promotion.benefits || [],
    categoryIds: undefined,
  } : staticConfig;

  const filteredProducts = dbPromotion?.products && dbPromotion.products.length > 0
    ? dbPromotion.products
    : staticConfig.categoryIds
      ? allProducts.filter((p) => staticConfig.categoryIds?.includes(p.categoryId))
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
            <h1 className="flex-1 text-center text-lg font-bold">{config.title}</h1>
            <div className="w-9" />
          </div>
        </header>

        <div className="bg-gradient-to-b from-amber-50 to-white">
          <div className="text-center py-6">
            <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 text-sm rounded-full mb-4">
              {config.period}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
            <p className="text-gray-600 text-sm px-6">{config.subtitle}</p>
          </div>

          <div className="relative aspect-[4/3] mx-4 mb-6 rounded-xl overflow-hidden shadow-lg">
            <img
              src={config.heroImage}
              alt={config.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white mx-4 mb-6 rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-center mb-4">혜택</h3>
            <div className="grid grid-cols-2 gap-3">
              {config.benefits.map((benefit, index) => (
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

          {config.bannerImages.length > 1 && (
            <div className="px-4 mb-6">
              {config.bannerImages.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-md mb-4"
                >
                  <img
                    src={img}
                    alt={`${config.title} 배너 ${index + 1}`}
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
                    {product.reviewCount > 0 && (
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
