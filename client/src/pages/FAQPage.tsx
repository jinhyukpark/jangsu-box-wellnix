import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";

// Mock data for FAQs
const faqs = [
  {
    id: 1,
    category: "장수박스",
    question: "장수박스 구독은 어떻게 신청하나요?",
    answer: "장수박스 구독은 메인 홈의 '정기구독' 탭이나 상품 상세 페이지에서 신청하실 수 있습니다. 원하시는 플랜(효심/장수/천수)을 선택하고 결제 수단을 등록하시면 매월 정기적으로 배송됩니다."
  },
  {
    id: 2,
    category: "장수박스",
    question: "구독 상품 구성은 매월 변경되나요?",
    answer: "네, 그렇습니다. 장수박스는 매월 그 달의 절기와 제철 건강 식품을 테마로 하여 전문가가 엄선한 새로운 상품들로 구성됩니다. 매월 1일에 이달의 구성을 미리 확인하실 수 있습니다."
  },
  {
    id: 3,
    category: "배송",
    question: "배송 기간은 얼마나 걸리나요?",
    answer: "평일 오후 2시 이전 주문 건은 당일 출고되어, 일반적으로 다음 날 받아보실 수 있습니다. 도서 산간 지역은 1-2일 정도 더 소요될 수 있습니다. 정기구독 상품은 매월 지정된 발송일(15일)에 일괄 배송됩니다."
  },
  {
    id: 4,
    category: "배송",
    question: "배송지 변경은 가능한가요?",
    answer: "주문 상태가 '결제완료' 단계일 경우 마이페이지 > 주문내역에서 직접 변경 가능합니다. '상품준비중' 이후 단계에서는 고객센터(1:1문의)로 문의 부탁드립니다. 정기구독의 경우 매월 10일까지 변경된 주소가 당월 배송에 반영됩니다."
  },
  {
    id: 5,
    category: "행사/이벤트",
    question: "진행 중인 이벤트는 어디서 확인하나요?",
    answer: "메인 화면의 배너나 하단 메뉴의 '이벤트' 탭에서 현재 진행 중인 모든 행사와 이벤트를 확인하실 수 있습니다. 마이페이지 > 알림 설정을 켜두시면 새로운 이벤트 소식을 가장 먼저 받아보실 수 있습니다."
  },
  {
    id: 6,
    category: "교환/환불",
    question: "단순 변심으로 인한 반품이 가능한가요?",
    answer: "식품 특성상 제품의 하자가 아닌 단순 변심으로 인한 교환 및 환불은 제한될 수 있습니다. 다만, 포장을 개봉하지 않은 상태에서 수령 후 7일 이내라면 반품 배송비를 부담하시고 환불이 가능합니다."
  },
  {
    id: 7,
    category: "교환/환불",
    question: "상품에 문제가 있어서 교환하고 싶어요.",
    answer: "상품 수령 후 파손이나 변질 등 문제가 발견된 경우, 수령일로부터 7일 이내에 사진과 함께 1:1 문의를 남겨주시면 확인 후 신속하게 재발송 또는 환불 처리해 드립니다."
  },
  {
    id: 8,
    category: "기타",
    question: "회원 탈퇴는 어떻게 하나요?",
    answer: "마이페이지 > 내 정보 관리 하단에 있는 '회원 탈퇴' 버튼을 통해 진행하실 수 있습니다. 탈퇴 시 보유하고 계신 쿠폰과 포인트는 모두 소멸되며, 재가입 시에도 복구되지 않으니 유의해 주세요."
  }
];

const categories = ["전체", "장수박스", "배송", "행사/이벤트", "교환/환불", "기타"];

export default function FAQPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      // Category filter
      if (selectedCategory !== "전체" && faq.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <AppLayout hideNav>
      <SEO title="자주 묻는 질문 | 웰닉스" description="궁금한 점을 확인해 보세요." />
      
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
              <h1 className="font-bold text-lg text-gray-900">자주 묻는 질문</h1>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white px-4 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="궁금한 점을 검색해보세요"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex overflow-x-auto px-4 py-3 gap-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isExpanded = expandedId === faq.id;

              return (
                <div 
                  key={faq.id} 
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded ? "border-primary shadow-md" : "border-gray-100 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left p-5 flex items-start gap-3"
                  >
                    <span className="text-primary font-bold text-lg leading-none mt-0.5">Q.</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">[{faq.category}]</div>
                      <h3 className={`font-medium transition-colors ${isExpanded ? "text-primary" : "text-gray-900"}`}>
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 text-gray-400 pt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 bg-gray-50/50">
                      <div className="flex gap-3">
                        <span className="text-gray-400 font-bold text-lg leading-none mt-0.5">A.</span>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Bottom Contact Info */}
        <div className="px-4 py-8 text-center">
          <p className="text-gray-500 text-sm mb-4">원하는 답변을 찾지 못하셨나요?</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => setLocation("/corporate-inquiry")}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              1:1 문의하기
            </button>
            <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              고객센터 연결
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}