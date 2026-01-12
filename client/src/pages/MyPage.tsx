import { User, Package, Heart, Bell, Settings, HelpCircle, LogOut, ChevronRight, Gift, Calendar, Star } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PromoSidebar } from "@/components/PromoSidebar";

const menuItems = [
  { icon: Package, label: "주문/배송 조회", badge: "2" },
  { icon: Heart, label: "찜한 상품", badge: "12" },
  { icon: Gift, label: "구독 관리" },
  { icon: Calendar, label: "예약한 행사", badge: "1" },
  { icon: Star, label: "리뷰 관리" },
  { icon: Bell, label: "알림 설정" },
  { icon: Settings, label: "계정 설정" },
  { icon: HelpCircle, label: "고객센터" },
];

const stats = [
  { label: "적립금", value: "12,500P" },
  { label: "쿠폰", value: "3장" },
  { label: "리뷰", value: "8개" },
];

export default function MyPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-xl">
        <header className="bg-gradient-to-br from-primary to-emerald-600 p-6 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">마이페이지</h1>
            <button data-testid="settings-btn">
              <Settings className="w-6 h-6 text-white/80" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">김건강 님</h2>
              <p className="text-sm text-white/80">wellnix@example.com</p>
            </div>
            <button 
              className="px-3 py-1.5 bg-white/20 rounded-lg text-sm text-white font-medium"
              data-testid="edit-profile"
            >
              프로필 수정
            </button>
          </div>
        </header>
        
        <div className="-mt-12 mx-4 bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-around">
            {stats.map((stat) => (
              <button key={stat.label} className="text-center" data-testid={`stat-${stat.label}`}>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mx-4 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">장수 박스 구독중</p>
                <p className="text-sm text-gray-500">다음 배송: 2026.01.20</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="pb-24 px-4">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    index < menuItems.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                  data-testid={`menu-${item.label}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
          
          <button 
            className="w-full flex items-center justify-center gap-2 mt-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
            data-testid="logout"
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
        
        <BottomNav />
      </main>
    </div>
  );
}