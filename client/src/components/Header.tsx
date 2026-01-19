import { Bell, ShoppingCart, Search } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const defaultMenuItems = [
  { label: "홈", href: "/" },
  { label: "설 선물세트", href: "/promotion/seol-gift" },
  { label: "장수박스", href: "/promotion/jangsu-box" },
  { label: "건강 여행", href: "/promotion/health-travel" },
  { label: "인기 상품", href: "/promotion/popular" },
];

export function Header() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: promotions = [] } = useQuery<any[]>({
    queryKey: ["/api/promotions"],
    queryFn: async () => {
      const res = await fetch("/api/promotions");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const menuItems = promotions.length > 0
    ? [
        { label: "홈", href: "/" },
        ...promotions
          .filter((p: any) => p.isActive)
          .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((p: any) => ({ label: p.title, href: `/promotion/${p.slug}` }))
      ]
    : defaultMenuItems;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/">
          <h1 className="text-xl font-bold text-primary font-serif cursor-pointer">웰닉스</h1>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/search">
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              data-testid="header-search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <Link href="/mypage/notifications">
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative"
              data-testid="header-notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </Link>
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative"
            data-testid="header-cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`px-4 pb-3 overflow-x-auto scrollbar-hide ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
      >
        <div className="flex gap-2">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <button
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(item.href)
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid={`tab-${item.label}`}
              >
                {item.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}