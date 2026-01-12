import { Bell, ShoppingCart, Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-primary font-serif">웰닉스</h1>
        <div className="flex items-center gap-3">
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            data-testid="header-search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative"
            data-testid="header-notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
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
      
      <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {["홈", "PRESTIGE", "설 얼리버드", "구독 서비스", "건강정보"].map((tab, index) => (
            <button
              key={tab}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                index === 0 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}