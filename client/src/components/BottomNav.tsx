import { Home, Search, Gift, Calendar, User } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { icon: Home, label: "홈", path: "/" },
  { icon: Search, label: "탐색", path: "/search" },
  { icon: Gift, label: "선물관", path: "/gifts" },
  { icon: Calendar, label: "행사", path: "/events" },
  { icon: User, label: "마이", path: "/mypage" },
];

export function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white border-t border-gray-100 px-2 py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path === "/" && location === "/");
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              data-testid={`nav-${item.label}`}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "text-primary" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}