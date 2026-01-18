import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";

interface FAQ {
  id: number;
  category: string | null;
  question: string;
  answer: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function FAQPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: faqs = [], isLoading } = useQuery<FAQ[]>({
    queryKey: ["/api/faqs"],
    queryFn: async () => {
      const res = await fetch("/api/faqs");
      if (!res.ok) throw new Error("FAQ 목록을 불러올 수 없습니다");
      return res.json();
    },
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const activeFaqs = useMemo(() => {
    return faqs.filter(faq => faq.isActive);
  }, [faqs]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    activeFaqs.forEach(faq => {
      if (faq.category) cats.add(faq.category);
    });
    return ["전체", ...Array.from(cats)];
  }, [activeFaqs]);

  const filteredFAQs = useMemo(() => {
    return activeFaqs.filter(faq => {
      if (selectedCategory !== "전체" && faq.category !== selectedCategory) {
        return false;
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        );
      }
      
      return true;
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [activeFaqs, selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <AppLayout hideNav>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

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
              <p>{searchQuery ? "검색 결과가 없습니다." : "등록된 FAQ가 없습니다."}</p>
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
                      {faq.category && (
                        <div className="text-xs text-gray-500 mb-1">[{faq.category}]</div>
                      )}
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
                        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
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
