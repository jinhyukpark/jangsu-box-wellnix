import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, Calendar, Plus, ChevronDown, ChevronUp, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

// Mock data for inquiries
const initialInquiries = [
  {
    id: 1,
    category: "배송",
    title: "배송이 언제쯤 도착하나요?",
    content: "주문한지 3일이 지났는데 아직도 배송준비중이라고 뜹니다. 언제 발송되나요?",
    date: "2026.01.12",
    status: "answered", // waiting, answered
    answer: "안녕하세요, 웰닉스입니다.\n주문하신 상품은 주문 폭주로 인해 발송이 조금 지연되고 있습니다.\n내일(1/16) 출고 예정이며, 출고 후 1-2일 내 수령 가능하십니다.\n이용에 불편을 드려 죄송합니다.",
    answerDate: "2026.01.13"
  },
  {
    id: 2,
    category: "상품",
    title: "장수박스 구성품 변경 가능한가요?",
    content: "이번 달 장수박스 구성 중에 홍삼 제품을 다른 걸로 변경하고 싶은데 가능한지 궁금합니다.",
    date: "2026.01.05",
    status: "answered",
    answer: "안녕하세요, 웰닉스입니다.\n죄송하지만 장수박스는 매월 정해진 테마와 구성으로 기획되어 개별 구성 변경은 어렵습니다.\n다만 알레르기 등의 이유로 특정 식품을 제외하셔야 한다면 고객센터로 연락 주시면 상담 도와드리겠습니다.\n감사합니다.",
    answerDate: "2026.01.05"
  },
  {
    id: 3,
    category: "기타",
    title: "회원 등급 기준이 궁금합니다.",
    content: "VIP 회원이 되려면 구매 금액이 얼마나 되어야 하나요?",
    date: "2026.01.14",
    status: "waiting",
    answer: null,
    answerDate: null
  }
];

const categories = ["배송", "상품", "주문/결제", "교환/환불", "기타"];

export default function MyInquiryPage() {
  const [, setLocation] = useLocation();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [isWriting, setIsWriting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Write form state
  const [formData, setFormData] = useState({
    category: "배송",
    title: "",
    content: ""
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const newInquiry = {
      id: Date.now(),
      category: formData.category,
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      status: "waiting",
      answer: null,
      answerDate: null
    };

    setInquiries([newInquiry, ...inquiries]);
    setIsWriting(false);
    setFormData({ category: "배송", title: "", content: "" });
    toast.success("문의가 등록되었습니다.");
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesContent = item.content.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent) return false;
      }
      
      // Date filter
      if (startDate || endDate) {
        const itemDate = new Date(item.date.replace(/\./g, '-'));
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && itemDate < start) return false;
        if (end && itemDate > end) return false;
      }
      
      return true;
    });
  }, [inquiries, searchQuery, startDate, endDate]);

  return (
    <AppLayout hideNav>
      <SEO title="1:1 문의 | 웰닉스" description="궁금한 점을 문의해주세요." />
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => isWriting ? setIsWriting(false) : setLocation("/mypage")} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">
                {isWriting ? "문의하기" : "1:1 문의"}
              </h1>
            </div>
            {!isWriting && (
              <button 
                onClick={() => setIsWriting(true)}
                className="text-primary font-medium text-sm hover:bg-primary/5 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                문의작성
              </button>
            )}
          </div>
        </header>

        {isWriting ? (
          <form onSubmit={handleSubmit} className="p-4 space-y-4 animate-in slide-in-from-right-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의 유형</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                        formData.category === cat
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  placeholder="제목을 입력해주세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  placeholder="문의하실 내용을 자세히 적어주세요."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              등록하기
            </button>
          </form>
        ) : (
          <>
            {/* Filter Section */}
            <div className="bg-white p-4 border-b border-gray-100 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="제목, 내용 검색"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">기간</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <span className="text-gray-400">~</span>
                  <div className="relative flex-1">
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="text-sm text-gray-600 flex justify-between items-center px-1">
                <span>총 <span className="font-bold text-primary">{filteredInquiries.length}</span>건</span>
                {(searchQuery || startDate || endDate) && (
                  <button 
                    onClick={() => { setSearchQuery(""); setStartDate(""); setEndDate(""); }}
                    className="text-xs text-gray-400 underline"
                  >
                    필터 초기화
                  </button>
                )}
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>문의 내역이 없습니다.</p>
                </div>
              ) : (
                filteredInquiries.map((inquiry) => {
                  const isExpanded = expandedId === inquiry.id;
                  const isAnswered = inquiry.status === "answered";

                  return (
                    <div 
                      key={inquiry.id} 
                      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                        isExpanded ? "border-primary shadow-md" : "border-gray-100 shadow-sm"
                      }`}
                    >
                      <button
                        onClick={() => toggleExpand(inquiry.id)}
                        className="w-full text-left p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                              isAnswered 
                                ? "bg-primary/10 text-primary" 
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {isAnswered ? "답변완료" : "답변대기"}
                            </span>
                            <span className="text-xs text-gray-400 border-l border-gray-200 pl-2">
                              {inquiry.category}
                            </span>
                            <span className="text-xs text-gray-400 border-l border-gray-200 pl-2">
                              {inquiry.date}
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                        
                        <h3 className={`text-sm font-medium transition-colors line-clamp-1 ${isExpanded ? "text-primary" : "text-gray-900"}`}>
                          {inquiry.title}
                        </h3>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-5">
                          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            {inquiry.content}
                          </div>

                          {isAnswered ? (
                            <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold text-primary">웰닉스 답변</span>
                                <span className="text-xs text-gray-400 ml-auto">{inquiry.answerDate}</span>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                {inquiry.answer}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 border-dashed justify-center">
                              <Clock className="w-4 h-4" />
                              담당자가 내용을 확인하고 있습니다.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}