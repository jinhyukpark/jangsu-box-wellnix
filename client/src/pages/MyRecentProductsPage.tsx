import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Trash2, Calendar, Check, ShoppingCart, Clock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { images } from "@/lib/images";

const giftBoxImage = images.premiumKoreanHealthGiftBox;
const ginsengImage = images.koreanRedGinsengJeonggwa;
const jujubeImage = images.koreanDriedJujubeChips;

// Mock data for recently viewed items
const initialRecentList = [
  {
    id: 1,
    productId: "1",
    productName: "6년근 홍삼 정과 선물세트",
    price: 89000,
    image: ginsengImage,
    viewedDate: "2026.01.15 14:30",
    status: "sale"
  },
  {
    id: 2,
    productId: "2",
    productName: "국산 대추칩 80g",
    price: 12000,
    image: jujubeImage,
    viewedDate: "2026.01.15 14:25",
    status: "sale"
  },
  {
    id: 3,
    productId: "3",
    productName: "프리미엄 산삼배양근 세트",
    price: 158000,
    image: giftBoxImage,
    viewedDate: "2026.01.14 20:10",
    status: "sale"
  },
  {
    id: 4,
    productId: "4",
    productName: "[품절] 제주 감귤 비타민",
    price: 32000,
    image: giftBoxImage,
    viewedDate: "2026.01.12 09:45",
    status: "soldout"
  },
  {
    id: 5,
    productId: "5",
    productName: "건강한 하루 종합비타민",
    price: 32000,
    image: giftBoxImage,
    viewedDate: "2026.01.10 18:20",
    status: "sale"
  }
];

export default function MyRecentProductsPage() {
  const [, setLocation] = useLocation();
  const [recentList, setRecentList] = useState(initialRecentList);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleProductClick = (productId: string) => {
    setLocation(`/products/${productId}`);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    
    if (confirm(`선택한 ${selectedIds.length}개의 기록을 삭제하시겠습니까?`)) {
      setRecentList(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      toast.success("최근 본 상품 기록이 삭제되었습니다.");
    }
  };

  const filteredList = useMemo(() => {
    return recentList.filter(item => {
      if (!startDate && !endDate) return true;
      
      const viewedDate = new Date(item.viewedDate.replace(/\./g, '-').split(' ')[0]);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && viewedDate < start) return false;
      if (end && viewedDate > end) return false;
      
      return true;
    });
  }, [recentList, startDate, endDate]);

  return (
    <AppLayout hideNav>
      <SEO title="최근 본 상품 | 웰닉스" description="내가 최근에 본 상품 목록입니다." />
      
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
              <h1 className="font-bold text-lg text-gray-900">최근 본 상품</h1>
            </div>
            
            {selectedIds.length > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="text-red-500 font-medium text-sm flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors animate-in fade-in"
              >
                <Trash2 className="w-4 h-4" />
                삭제 ({selectedIds.length})
              </button>
            )}
          </div>
        </header>

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
            <span>총 <span className="font-bold text-primary">{filteredList.length}</span>개</span>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-xs text-gray-400 underline"
              >
                필터 초기화
              </button>
            )}
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-300" />
              </div>
              <p>최근 본 상품이 없습니다.</p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                  selectedIds.includes(item.id) ? "border-primary ring-1 ring-primary bg-primary/5" : "border-gray-100"
                }`}
              >
                <div className="flex gap-4">
                  {/* Checkbox Area */}
                  <div className="flex items-center">
                    <button 
                      onClick={() => toggleSelection(item.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        selectedIds.includes(item.id) 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white border-gray-300 text-transparent hover:border-gray-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Image */}
                  <div 
                    className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 cursor-pointer relative"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.productName} 
                      className={`w-full h-full object-cover ${item.status === 'soldout' ? 'grayscale opacity-70' : ''}`}
                    />
                    {item.status === 'soldout' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className="text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">품절</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 
                        className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 cursor-pointer"
                        onClick={() => handleProductClick(item.productId)}
                      >
                        {item.productName}
                      </h3>
                      <p className="text-sm font-bold text-primary">
                        {item.price.toLocaleString()}원
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.viewedDate}
                      </span>
                      
                      <button 
                        className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => toast.success("장바구니에 담겼습니다.")}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}