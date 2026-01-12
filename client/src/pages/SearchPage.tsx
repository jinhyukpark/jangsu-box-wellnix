import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PromoSidebar } from "@/components/PromoSidebar";

const popularSearches = ["홍삼", "설 선물세트", "비타민", "관절영양제", "프로바이오틱스", "오메가3", "녹용", "콜라겐"];
const recentSearches = ["6년근 홍삼", "부모님 선물", "비타민D"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-xl">
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="건강식품 검색"
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="search-input"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  data-testid="search-clear"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="pb-24 p-4">
          {recentSearches.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  최근 검색어
                </h2>
                <button className="text-sm text-gray-500" data-testid="clear-recent">전체 삭제</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                    data-testid={`recent-${term}`}
                  >
                    {term}
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                ))}
              </div>
            </section>
          )}
          
          <section>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              인기 검색어
            </h2>
            <div className="space-y-2">
              {popularSearches.map((term, index) => (
                <button
                  key={term}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  data-testid={`popular-${index}`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center text-sm font-bold rounded ${index < 3 ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{term}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
        
        <BottomNav />
      </main>
    </div>
  );
}