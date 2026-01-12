import { Bell, ShoppingCart, ChevronRight, Gift } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const stats = [
  { label: "주문 내역", value: "2건" },
  { label: "마일리지", value: "12,500원" },
  { label: "쿠폰", value: "3장" },
  { label: "선물함", value: "1건" },
];

const recentOrder = {
  image: giftBoxImage,
  name: "[2026] 설 프리미엄 홍삼 선물...",
  quantity: "1개",
  option: "시그니처 A",
  status: "구매확정",
};

const shoppingMenus = [
  { label: "나의 리뷰", value: "2건" },
  { label: "전체 리뷰" },
  { label: "간편 결제 관리" },
  { label: "배송지 목록" },
  { label: "알림 설정", action: "알림 설정하고 설로인 혜택 받기" },
];

const eventMenus = [
  { label: "기획전/이벤트" },
  { label: "친구 추천", action: "마일리지+쿠폰 받기" },
];

const supportMenus = [
  { label: "공지사항", badge: "N" },
  { label: "고객센터" },
  { label: "자주 묻는 질문" },
];

export default function MyPage() {
  return (
    <AppLayout>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-amber-500 text-amber-500 text-sm font-medium rounded-lg" data-testid="corporate-inquiry">
              기업문의
            </button>
            <button className="p-2" data-testid="notifications">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2" data-testid="cart">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="pb-24">
        <div className="bg-gradient-to-b from-amber-50 to-white p-4">
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded">웰닉스 등급</span>
            <span className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded">등급 안내</span>
          </div>
          
          <div className="flex items-center gap-1 mb-1">
            <h2 className="text-xl font-bold text-gray-900">안녕하세요. 김건강님</h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-amber-600 mb-4">주문 금액의 0.5% 적립</p>
          
          <div className="bg-white rounded-xl border border-gray-100 grid grid-cols-2 divide-x divide-y divide-gray-100">
            {stats.map((stat) => (
              <button 
                key={stat.label}
                className="p-4 text-left hover:bg-gray-50 transition-colors"
                data-testid={`stat-${stat.label}`}
              >
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">주문배송내역</h3>
              <span className="text-amber-500 font-bold">2</span>
            </div>
            <button className="flex items-center text-sm text-gray-500" data-testid="view-all-orders">
              전체보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
              <img src={recentOrder.image} alt={recentOrder.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">{recentOrder.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{recentOrder.quantity} | {recentOrder.option}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{recentOrder.status}</p>
            </div>
          </div>
        </div>

        <div className="mx-4 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">친구 좋고 나도 좋은 설로인 친구 추천</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              추가 혜택도 받아가세요! <ChevronRight className="w-4 h-4" />
            </p>
          </div>
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-amber-200">
            <Gift className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="px-4 mb-6">
          <h3 className="text-sm text-gray-500 mb-2">나의 쇼핑</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {shoppingMenus.map((item, index) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index < shoppingMenus.length - 1 ? "border-b border-gray-100" : ""
                }`}
                data-testid={`menu-${item.label}`}
              >
                <span className="font-medium text-gray-800">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-gray-500">{item.value}</span>}
                  {item.action && <span className="text-amber-500 text-sm">{item.action}</span>}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mb-6">
          <h3 className="text-sm text-gray-500 mb-2">이벤트</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {eventMenus.map((item, index) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index < eventMenus.length - 1 ? "border-b border-gray-100" : ""
                }`}
                data-testid={`menu-${item.label}`}
              >
                <span className="font-medium text-gray-800">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.action && <span className="text-amber-500 text-sm">{item.action}</span>}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mb-6">
          <h3 className="text-sm text-gray-500 mb-2">고객센터</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {supportMenus.map((item, index) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index < supportMenus.length - 1 ? "border-b border-gray-100" : ""
                }`}
                data-testid={`menu-${item.label}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mb-6">
          <h3 className="text-sm text-gray-500 mb-2">기업 구매</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              data-testid="menu-corporate"
            >
              <span className="font-medium text-gray-800">기업 구매</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 flex items-center justify-between text-sm text-gray-400">
          <span>앱 버전</span>
          <span>2.1.8</span>
        </div>
      </div>
    </AppLayout>
  );
}