import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Star, AlertCircle, Trash2, Calendar, Check } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

// Mock data for user reviews with time
const initialReviews = [
  {
    id: 1,
    productId: "1",
    productName: "6년근 홍삼 정과 선물세트",
    productImage: giftBoxImage,
    rating: 5,
    date: "2026.01.10 14:30",
    content: "부모님이 정말 좋아하세요! 포장도 고급스럽고 맛도 좋다고 하시네요. 다음 명절에도 또 구매할 예정입니다.",
    options: "옵션: 1.5kg (30뿌리)"
  },
  {
    id: 11, // Second review for the same product
    productId: "1",
    productName: "6년근 홍삼 정과 선물세트",
    productImage: giftBoxImage,
    rating: 4,
    date: "2025.09.20 10:15",
    content: "지난번보다 배송이 조금 늦었지만 맛은 여전히 훌륭합니다. 재구매했습니다.",
    options: "옵션: 1.5kg (30뿌리)"
  },
  {
    id: 2,
    productId: "2",
    productName: "유기농 벌꿀 & 호두 세트",
    productImage: giftBoxImage,
    rating: 4,
    date: "2025.12.25 09:15",
    content: "구성은 좋은데 배송이 조금 늦었어요. 그래도 상품 품질은 아주 만족스럽습니다.",
    options: "옵션: 선물포장 포함"
  },
  {
    id: 3,
    productId: null, // Deleted product
    productName: "[판매종료] 프리미엄 녹용 진액",
    productImage: giftBoxImage,
    rating: 5,
    date: "2025.11.15 18:45",
    content: "기력 회복에 이만한 게 없네요. 부모님이 드시고 나서 피로가 덜하다고 하십니다.",
    options: "옵션: 30포 1박스"
  },
  {
    id: 4,
    productId: "4",
    productName: "건강한 하루 종합비타민",
    productImage: giftBoxImage,
    rating: 5,
    date: "2025.10.08 11:20",
    content: "매일 챙겨드리기 좋은 구성이에요. 알약 크기도 적당해서 목넘김이 편하다고 하시네요.",
    options: "옵션: 3개월분"
  }
];

export default function MyReviewsPage() {
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState(initialReviews);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedReviewIds, setSelectedReviewIds] = useState<number[]>([]);
  
  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    // Navigate to product detail
    setLocation(`/products/${productId}`);
  };

  const toggleReviewSelection = (id: number) => {
    setSelectedReviewIds(prev => 
      prev.includes(id) 
        ? prev.filter(reviewId => reviewId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedReviewIds.length === 0) return;
    
    if (confirm(`선택한 ${selectedReviewIds.length}개의 리뷰를 삭제하시겠습니까?`)) {
      setReviews(prev => prev.filter(review => !selectedReviewIds.includes(review.id)));
      setSelectedReviewIds([]);
      toast.success("리뷰가 삭제되었습니다.");
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (!startDate && !endDate) return true;
      
      const reviewDate = new Date(review.date.replace(/\./g, '-').split(' ')[0]); // Convert YYYY.MM.DD to Date object
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && reviewDate < start) return false;
      if (end && reviewDate > end) return false;
      
      return true;
    });
  }, [reviews, startDate, endDate]);

  // Group reviews by product
  const groupedReviews = useMemo(() => {
    const groups: { [key: string]: typeof initialReviews } = {};
    filteredReviews.forEach(review => {
      const key = review.productId ? review.productId : `deleted-${review.productName}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(review);
    });
    return Object.values(groups);
  }, [filteredReviews]);

  return (
    <AppLayout hideNav>
      <SEO title="나의 리뷰 | 웰닉스" description="내가 작성한 리뷰를 확인하세요." />
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLocation("/mypage")} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">나의 리뷰</h1>
            </div>
            
            {selectedReviewIds.length > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="text-red-500 font-medium text-sm flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors animate-in fade-in"
              >
                <Trash2 className="w-4 h-4" />
                삭제 ({selectedReviewIds.length})
              </button>
            )}
          </div>
        </header>

        {showDeleteAlert && (
          <div className="bg-red-50 text-red-600 px-4 py-3 text-sm flex items-center gap-2 animate-in slide-in-from-top-2 sticky top-14 z-40">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>현재 판매가 종료되었거나 삭제된 상품입니다.</span>
          </div>
        )}

        {/* Date Filter Section */}
        <div className="bg-white p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">조회 기간 설정</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <span className="text-gray-400">~</span>
            <div className="relative flex-1">
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-sm text-gray-600 mb-2 flex justify-between items-center">
            <span>총 <span className="font-bold text-primary">{filteredReviews.length}</span>개의 리뷰</span>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-xs text-gray-400 underline"
              >
                필터 초기화
              </button>
            )}
          </div>

          {groupedReviews.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>해당 기간에 작성된 리뷰가 없습니다.</p>
            </div>
          ) : (
            groupedReviews.map((group) => {
              const product = group[0]; // Use first review for product info
              
              return (
                <div 
                  key={product.productId || product.id} 
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                >
                  {/* Product Info Header */}
                  <div className="flex gap-3 mb-4 pb-4 border-b border-gray-50">
                    <div 
                      className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 cursor-pointer group"
                      onClick={() => handleProductClick(product.productId)}
                    >
                      <img 
                        src={product.productImage} 
                        alt={product.productName} 
                        className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${!product.productId ? 'grayscale opacity-70' : ''}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 
                        className={`font-medium text-sm line-clamp-1 mb-1 cursor-pointer hover:underline ${!product.productId ? 'text-gray-400' : 'text-gray-900'}`}
                        onClick={() => handleProductClick(product.productId)}
                      >
                        {product.productName}
                      </h3>
                      <p className="text-xs text-gray-400">{product.options}</p>
                    </div>
                  </div>

                  {/* Reviews List for this Product */}
                  <div className="space-y-4">
                    {group.map((review, index) => (
                      <div 
                        key={review.id} 
                        className={`relative ${index !== 0 ? "pt-4 border-t border-gray-50" : ""}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-gray-200"}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => toggleReviewSelection(review.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              selectedReviewIds.includes(review.id) 
                                ? "bg-primary border-primary text-white" 
                                : "bg-white border-gray-300 text-transparent hover:border-gray-400"
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>

                        <p className={`text-gray-700 text-sm leading-relaxed whitespace-pre-line ${selectedReviewIds.includes(review.id) ? "opacity-50" : ""}`}>
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}