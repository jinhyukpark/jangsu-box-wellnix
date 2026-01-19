import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { PromoSidebar } from "@/components/PromoSidebar";
import { useAuth } from "@/hooks/use-auth";

interface PopularKeyword {
  id: number;
  keyword: string;
  displayOrder: number;
  isActive: boolean;
}

interface RecentSearch {
  id: number;
  memberId: number;
  keyword: string;
  searchedAt: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated;

  const { data: popularKeywords = [] } = useQuery<PopularKeyword[]>({
    queryKey: ["popular-keywords"],
    queryFn: async () => {
      const res = await fetch("/api/search/popular-keywords", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch popular keywords");
      return res.json();
    },
  });

  const { data: recentSearches = [] } = useQuery<RecentSearch[]>({
    queryKey: ["recent-searches"],
    queryFn: async () => {
      const res = await fetch("/api/search/recent", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recent searches");
      return res.json();
    },
    enabled: isLoggedIn,
  });

  const addRecentSearchMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const res = await fetch("/api/search/recent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ keyword }),
      });
      if (!res.ok) throw new Error("Failed to add recent search");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-searches"] });
    },
  });

  const deleteRecentSearchMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const res = await fetch(`/api/search/recent/${encodeURIComponent(keyword)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete recent search");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-searches"] });
    },
  });

  const clearRecentSearchesMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/search/recent", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear recent searches");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-searches"] });
    },
  });

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return;
    
    if (isLoggedIn) {
      addRecentSearchMutation.mutate(keyword.trim());
    }
    
    setLocation(`/products?search=${encodeURIComponent(keyword.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleDeleteRecentSearch = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    deleteRecentSearchMutation.mutate(keyword);
  };

  const handleClearAllRecent = () => {
    clearRecentSearchesMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white h-screen flex flex-col shadow-xl overflow-hidden">
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="건강식품 검색"
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-search"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  data-testid="button-clear-search"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleSearch(query)}
              className="px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              data-testid="button-search"
            >
              검색
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoggedIn && recentSearches.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  최근 검색어
                </h2>
                <button 
                  onClick={handleClearAllRecent}
                  className="text-sm text-gray-500 hover:text-gray-700" 
                  data-testid="button-clear-recent"
                  disabled={clearRecentSearchesMutation.isPending}
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => handleSearch(search.keyword)}
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                    data-testid={`button-recent-${search.id}`}
                  >
                    {search.keyword}
                    <span
                      onClick={(e) => handleDeleteRecentSearch(e, search.keyword)}
                      className="ml-1 hover:text-red-500"
                      data-testid={`button-delete-recent-${search.id}`}
                    >
                      <X className="w-3 h-3" />
                    </span>
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
              {popularKeywords.length > 0 ? (
                popularKeywords.map((keyword, index) => (
                  <button
                    key={keyword.id}
                    onClick={() => handleSearch(keyword.keyword)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    data-testid={`button-popular-${keyword.id}`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center text-sm font-bold rounded ${index < 3 ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                      {index + 1}
                    </span>
                    <span className="text-gray-800">{keyword.keyword}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  인기 검색어가 없습니다
                </div>
              )}
            </div>
          </section>
        </div>
        
        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}
