import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Star, MoreVertical, AlertCircle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

// Mock data for user reviews
const myReviews = [
  {
    id: 1,
    productId: "1",
    productName: "6년근 홍삼 정과 선물세트",
    productImage: giftBoxImage,
    rating: 5,
    date: "2026.01.10",
    content: "부모님이 정말 좋아하세요! 포장도 고급스럽고 맛도 좋다고 하시네요. 다음 명절에도 또 구매할 예정입니다.",
    options: "옵션: 1.5kg (30뿌리)"
  },
  {
    id: 2,
    productId: "2",
    productName: "유기농 벌꿀 & 호두 세트",
    productImage: giftBoxImage,
    rating: 4,
    date: "2025.12.25",
    content: "구성은 좋은데 배송이 조금 늦었어요. 그래도 상품 품질은 아주 만족스럽습니다.",
    options: "옵션: 선물포장 포함"
  },
  {
    id: 3,
    productId: null, // Deleted product
    productName: "[판매종료] 프리미엄 녹용 진액",
    productImage: giftBoxImage,
    rating: 5,
    date: "2025.11.15",
    content: "기력 회복에 이만한 게 없네요. 부모님이 드시고 나서 피로가 덜하다고 하십니다.",
    options: "옵션: 30포 1박스"
  },
  {
    id: 4,
    productId: "4",
    productName: "건강한 하루 종합비타민",
    productImage: giftBoxImage,
    rating: 5,
    date: "2025.10.08",
    content: "매일 챙겨드리기 좋은 구성이에요. 알약 크기도 적당해서 목넘김이 편하다고 하시네요.",
    options: "옵션: 3개월분"
  }
];

export default function MyReviewsPage() {
  const [, setLocation] = useLocation();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleProductClick = (productId: string | null) => {
    if (!productId) {
      toast.error("현재 판매가 종료되었거나 삭제된 상품입니다.", {
        position: "top-center",
        duration: 2000,
      });
      setShowDeleteAlert(true);
      setTimeout(() => setShowDeleteAlert(false), 3000);
      return;
    }
    // Navigate to product detail (assuming route exists, or just mock navigation)
    // For now, let's assume /products/:id
    setLocation(`/products/${productId}`);
  };

  return (
    <AppLayout hideNav>
      <SEO title="나의 리뷰 | 웰닉스" description="내가 작성한 리뷰를 확인하세요." />
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <button 
              onClick={() => setLocation("/mypage")} 
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="font-bold text-lg text-gray-900">나의 리뷰</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {showDeleteAlert && (
          <div className="bg-red-50 text-red-600 px-4 py-3 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>현재 판매가 종료되었거나 삭제된 상품입니다.</span>
          </div>
        )}

        <div className="p-4 space-y-4">
          <div className="text-sm text-gray-600 mb-2">
            총 <span className="font-bold text-primary">{myReviews.length}</span>개의 리뷰가 있습니다.
          </div>

          {myReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="flex gap-3 cursor-pointer group"
                  onClick={() => handleProductClick(review.productId)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                    <img 
                      src={review.productImage} 
                      alt={review.productName} 
                      className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${!review.productId ? 'grayscale opacity-70' : ''}`}
                    />
                  </div>
                  <div>
                    <h3 className={`font-medium text-sm line-clamp-2 mb-1 ${!review.productId ? 'text-gray-400' : 'text-gray-900 group-hover:text-primary transition-colors'}`}>
                      {review.productName}
                    </h3>
                    <p className="text-xs text-gray-400">{review.options}</p>
                  </div>
                </div>
                <button className="text-gray-400 p-1 hover:bg-gray-50 rounded-full">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-200"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}