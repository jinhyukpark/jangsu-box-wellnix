import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Home, ShoppingCart, Star, Heart, Gift, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/AppLayout";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [showRefundInfo, setShowRefundInfo] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("상품을 불러올 수 없습니다");
      return res.json();
    },
  });

  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ["/api/products", id, "reviews"],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}/reviews`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!id,
  });

  const isLoading = isProductLoading || isReviewsLoading;

  const allMedia: { type: 'image' | 'video'; url: string }[] = reviews.flatMap((r: any) => {
    const images = Array.isArray(r.images) ? r.images : [];
    const videos = Array.isArray(r.videos) ? r.videos : [];
    return [
      ...images.map((url: string) => ({ type: 'image' as const, url })),
      ...videos.map((url: string) => ({ type: 'video' as const, url })),
    ];
  }).slice(0, 20);

  const handleAddToCart = () => {
    toast({
      title: "장바구니에 담았습니다",
      description: `${product?.name} ${quantity}개가 장바구니에 추가되었습니다.`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "구매 페이지로 이동합니다",
      description: "로그인이 필요합니다.",
    });
    setLocation("/mypage");
  };

  const handleGift = () => {
    toast({
      title: "선물하기",
      description: "선물 받는 분의 정보를 입력해주세요.",
    });
  };

  if (isLoading) {
    return (
      <AppLayout hideNav>
        <div className="min-h-screen bg-white pb-24">
          {/* Header Skeleton */}
          <div className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="relative aspect-square bg-gray-200 animate-pulse" />

          {/* Product Info Skeleton */}
          <div className="p-4 space-y-4">
            {/* Badge & Title */}
            <div className="space-y-2">
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <div className="w-28 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-36 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-4 border-b pt-4">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Content Skeleton */}
            <div className="space-y-3 pt-4">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-40 bg-gray-200 rounded animate-pulse mt-4" />
            </div>
          </div>

          {/* Bottom Bar Skeleton */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-[430px] mx-auto flex gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout hideNav>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 mb-4">상품을 찾을 수 없습니다</p>
          <Button onClick={() => setLocation("/gifts")}>상품 목록으로</Button>
        </div>
      </AppLayout>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r: any) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => window.history.back()} className="p-1" data-testid="button-back">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <span className="text-base font-medium text-gray-900">상품 상세</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation("/")} className="p-1" data-testid="button-home">
                <Home className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={() => setLocation("/mypage")} className="p-1" data-testid="button-cart">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

      <div className="relative">
        <div className="aspect-square bg-gray-100">
          <img
            src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1} / 1
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        {discountPercent > 0 && (
          <span className="text-xs text-orange-500 font-medium">최대 {discountPercent}% 할인</span>
        )}
        <h2 className="text-lg font-bold text-gray-900 mt-1">{product.name}</h2>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1">{product.description.substring(0, 50)}...</p>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()}원</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{avgRating}</span>
            <span className="text-sm text-gray-400">({reviews.length.toLocaleString()})</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">배송비</span>
          <span className="font-medium text-gray-900">3,500원 (70,000원 이상 구매 시 무료)</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className="text-blue-600">🌙 새벽 배송</span>
          <span className="text-gray-600">~2월 4일 배송일 선택 가능</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="text-orange-500">🚚 일반 배송</span>
          <span className="text-gray-600">~2월 4일 배송일 선택 가능</span>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-white border-b border-gray-200 rounded-none h-12 p-0">
          <TabsTrigger 
            value="description" 
            className="h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent -mb-px"
          >
            상품 설명
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent -mb-px"
          >
            상품 리뷰 ({reviews.length})
          </TabsTrigger>
          <TabsTrigger 
            value="info" 
            className="h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent -mb-px"
          >
            상품 정보
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-4">
          <div className={`relative ${!showFullDescription ? 'max-h-[600px] overflow-hidden' : ''}`}>
            {product.descriptionMarkdown ? (
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-bold prose-h4:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-600 prose-img:rounded-lg prose-img:w-full prose-img:mb-4">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img {...props} className="rounded-lg w-full mb-4" loading="lazy" />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-xl font-bold text-gray-900 mb-4 mt-6" />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 {...props} className="text-lg font-bold text-gray-900 mb-3 mt-4" />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 {...props} className="font-bold text-gray-900 mb-3" />
                    ),
                    p: ({ node, children, ...props }) => {
                      const childArray = Array.isArray(children) ? children : [children];
                      const hasVideo = childArray.some((child: any) => 
                        typeof child === 'object' && child?.type === 'video'
                      );
                      if (hasVideo) {
                        return <div className="mb-4">{children}</div>;
                      }
                      return <p {...props} className="text-sm text-gray-700 leading-relaxed mb-4">{children}</p>;
                    },
                    ul: ({ node, ...props }) => (
                      <ul {...props} className="text-sm text-gray-600 space-y-2 mb-6" />
                    ),
                    li: ({ node, ...props }) => (
                      <li {...props} className="text-sm text-gray-600" />
                    ),
                    table: ({ node, ...props }) => (
                      <table {...props} className="w-full text-sm border-collapse border border-gray-200 mb-6" />
                    ),
                    th: ({ node, ...props }) => (
                      <th {...props} className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium" />
                    ),
                    td: ({ node, ...props }) => (
                      <td {...props} className="border border-gray-200 px-3 py-2" />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote {...props} className="border-l-4 border-primary pl-4 italic text-gray-600 mb-4" />
                    ),
                    hr: () => (
                      <hr className="my-6 border-gray-200" />
                    ),
                  }}
                >
                  {product.descriptionMarkdown}
                </ReactMarkdown>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-4">상품 구성 미리보기</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"}
                    alt="상품 구성"
                    className="w-full rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {product.description || "건강을 생각하는 프리미엄 건강식품입니다. 엄선된 원재료로 만들어 안심하고 드실 수 있습니다."}
                  </p>
                </div>
              </>
            )}

            {!showFullDescription && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowFullDescription(!showFullDescription)}
            data-testid="button-show-more-description"
          >
            {showFullDescription ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                접기
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                상품 설명 더보기
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="reviews" className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">상품 리뷰</h3>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">구매자 평점</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{avgRating}</span>
              </div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{star}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${reviews.length > 0 ? (ratingCounts[star - 1] / reviews.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {allMedia.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">포토 & 동영상 리뷰</h4>
                <button 
                  className="text-sm text-primary font-medium"
                  onClick={() => setLocation(`/products/${id}/gallery`)}
                  data-testid="button-view-all-photos"
                >
                  전체보기
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {allMedia.map((media, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative"
                  >
                    {media.type === 'video' ? (
                      <>
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </>
                    ) : (
                      <img 
                        src={media.url} 
                        alt={`리뷰 미디어 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" className="w-full mb-6" data-testid="button-write-review">
            상품 리뷰 작성하기
          </Button>

          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{review.memberName || "익명"}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
                
                {((review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)) && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {(review.images || []).map((img: string, idx: number) => (
                      <img 
                        key={`img-${idx}`}
                        src={img} 
                        alt={`리뷰 이미지 ${idx + 1}`}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ))}
                    {(review.videos || []).map((video: string, idx: number) => (
                      <div 
                        key={`vid-${idx}`}
                        className="w-16 h-16 rounded-lg bg-gray-300 flex items-center justify-center flex-shrink-0"
                      >
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    ))}
                  </div>
                )}
                
                {review.adminReply && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">판매자</span>
                      {review.adminReplyAt && (
                        <span className="text-xs text-gray-400">
                          {new Date(review.adminReplyAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{review.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info" className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">상품 필수 정보</h3>
          <p className="text-xs text-gray-500 mb-4">전자상거래 등에서의 상품정보 제공 고시에 따라 작성되었어요.</p>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="bg-gray-50 px-4 py-3 text-gray-500 w-1/3">제품명</td>
                  <td className="px-4 py-3 text-gray-900">{product.name}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="bg-gray-50 px-4 py-3 text-gray-500">원산지</td>
                  <td className="px-4 py-3 text-gray-900">국내산</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="bg-gray-50 px-4 py-3 text-gray-500">생산자</td>
                  <td className="px-4 py-3 text-gray-900">웰닉스(주)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="bg-gray-50 px-4 py-3 text-gray-500">소비기한</td>
                  <td className="px-4 py-3 text-gray-900">별도 표시</td>
                </tr>
                <tr>
                  <td className="bg-gray-50 px-4 py-3 text-gray-500">보관방법</td>
                  <td className="px-4 py-3 text-gray-900">직사광선을 피해 서늘한 곳에 보관</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <button 
              className="w-full flex items-center justify-between py-4"
              onClick={() => setShowShippingInfo(!showShippingInfo)}
            >
              <span className="text-lg font-bold text-gray-900">배송 정보</span>
              {showShippingInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showShippingInfo && (
              <div className="pb-4 text-sm text-gray-600 space-y-2">
                <p className="font-medium text-gray-900">공통</p>
                <p>• 기본 배송비는 3,500원이에요.</p>
                <p>• 70,000원 이상 구매 시 무료 배송해 드려요.</p>
                <p>• 명절이나 공휴일 등 배송을 운영하지 않는 휴무일은 공지에서 확인하세요.</p>
                <p className="font-medium text-gray-900 mt-4">🌙 새벽 배송</p>
                <p>• 오후 7시 전까지 주문 시, 다음 날 아침 9시 전에 상품을 수령할 수 있어요.</p>
                <p>• 서울 전체 지역과 일부 시군구 지역에만 배송 가능해요.</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200">
            <button 
              className="w-full flex items-center justify-between py-4"
              onClick={() => setShowRefundInfo(!showRefundInfo)}
            >
              <span className="text-lg font-bold text-gray-900">교환 및 환불</span>
              {showRefundInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showRefundInfo && (
              <div className="pb-4 text-sm text-gray-600 space-y-2">
                <p className="font-medium text-gray-900">공통</p>
                <p>• 제품에 문제가 있는 경우, 상품 수령일로부터 2일 이내에 사진과 함께 고객센터로 접수해 주세요.</p>
                <p>• 사진이 없으면, 교환 및 환불이 어려워요.</p>
                <p className="font-medium text-gray-900 mt-4">신선 식품</p>
                <p>• 신선식품 특성상 단순 변심으로 인한 교환 및 환불은 어려우니 양해 부탁드려요.</p>
                <p className="font-medium text-gray-900 mt-4">일반 제품</p>
                <p>• 일반 제품의 경우 구매일로부터 7일 이내 교환 및 반품 신청이 가능하며, 단순 변심인 경우 왕복 배송비 7,000원이 부과돼요.</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">사업자 정보</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">웰닉스 (주)</p>
              <p>대표자: 김건강</p>
              <p>개인정보 관리 책임자: 이웰빙</p>
              <p>사업자 등록번호: 123-45-67890</p>
              <p>통신판매업 신고번호: 2024-서울강남-0001</p>
              <p>서울시 강남구 테헤란로 123</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

        <div className="h-20" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 text-base font-medium"
            onClick={handleGift}
            data-testid="button-gift"
          >
            <Gift className="w-5 h-5 mr-2" />
            선물하기
          </Button>
          <Button 
            className="flex-1 h-12 text-base font-medium bg-primary hover:bg-primary/90"
            onClick={handleBuyNow}
            data-testid="button-buy"
          >
            바로 구매하기
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
