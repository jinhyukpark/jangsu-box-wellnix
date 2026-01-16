import { useLocation } from "wouter";
import { Bell, ShoppingCart, ChevronRight, Gift, Package, Heart, Star, Truck, Award } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";
import happySeniorsImage from "@assets/generated_images/happy_seniors_receiving_gift.png";

const recentOrders = [
  { image: giftBoxImage, name: "[2026] 설 프리미엄 홍삼 선물세트", status: "배송중", date: "01.12 도착예정" },
  { image: giftBoxImage, name: "유기농 벌꿀 & 호두 세트", status: "구매확정", date: "01.08 배송완료" },
];

export default function MyPage() {
  const [, setLocation] = useLocation();

  const handleMenuClick = (item: string) => {
    if (item === "회원정보 수정") {
      setLocation("/mypage/profile");
    } else if (item === "나의 리뷰") {
      setLocation("/mypage/reviews");
    } else if (item === "찜한 상품") {
      setLocation("/mypage/wishlist");
    } else if (item === "최근 본 상품") {
      setLocation("/mypage/recent");
    } else if (item === "간편결제 관리") {
      setLocation("/mypage/payment");
    } else if (item === "배송지 관리") {
      setLocation("/mypage/shipping");
    } else if (item === "알림 설정") {
      setLocation("/mypage/notifications");
    } else if (item === "공지사항") {
      setLocation("/notices");
    } else if (item === "자주 묻는 질문") {
      setLocation("/faq");
    } else if (item === "1:1 문의") {
      setLocation("/inquiry");
    }
  };

  return (
    <AppLayout>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLocation("/corporate-inquiry")}
              className="px-3 py-1.5 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors" 
              data-testid="corporate-inquiry"
            >
              기업문의
            </button>
            <button className="p-2 relative" data-testid="notifications">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 relative" data-testid="cart">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pb-24">
        <div className="relative bg-gradient-to-br from-[#006861] via-[#007a6a] to-[#005850] p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" /> VIP 회원
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">김건강님, 안녕하세요!</h2>
            <p className="text-white/70 text-sm mb-4">웰닉스와 함께한 지 <span className="text-amber-300 font-semibold">365일</span>이 되었어요</p>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Package, label: "주문", value: "5" },
                { icon: Heart, label: "찜", value: "12" },
                { icon: Star, label: "리뷰", value: "8" },
                { icon: Gift, label: "쿠폰", value: "3" },
              ].map((item) => (
                <button key={item.label} className="bg-white/10 backdrop-blur rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
                  <item.icon className="w-5 h-5 text-white/80 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{item.value}</p>
                  <p className="text-xs text-white/60">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">장수박스 구독중</p>
                  <p className="text-xs text-gray-500">매월 15일 정기배송</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-amber-400 text-white text-xs font-bold rounded">D-3</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">적립 마일리지</p>
                <p className="text-lg font-bold text-primary">12,500P</p>
              </div>
              <div className="flex-1 bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">이번달 혜택</p>
                <p className="text-lg font-bold text-amber-600">15% 할인</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">최근 주문</h3>
            <button className="text-sm text-gray-500 flex items-center">전체보기 <ChevronRight className="w-4 h-4" /></button>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={order.image} alt={order.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{order.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      order.status === "배송중" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                    }`}>
                      {order.status === "배송중" && <Truck className="w-3 h-3 inline mr-1" />}
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-500">{order.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-6 relative rounded-lg overflow-hidden">
          <img src={happySeniorsImage} alt="친구 추천" className="w-full h-28 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="absolute inset-0 p-4 flex items-center">
            <div>
              <p className="text-white font-bold">친구 초대하고 함께 혜택받기</p>
              <p className="text-white/70 text-sm">초대 1명당 5,000P 적립!</p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4 mb-6">
          {[
            { title: "내 정보", items: ["회원정보 수정"] },
            { title: "나의 활동", items: ["나의 리뷰", "찜한 상품", "최근 본 상품"] },
            { title: "결제/배송", items: ["간편결제 관리", "배송지 관리", "알림 설정"] },
            { title: "고객지원", items: ["공지사항", "자주 묻는 질문", "1:1 문의"] },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-sm text-gray-500 mb-2">{section.title}</h3>
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {section.items.map((item) => (
                  <button 
                    key={item} 
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    onClick={() => handleMenuClick(item)}
                  >
                    <span className="font-medium text-gray-800">{item}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 text-center text-sm text-gray-400 pb-4">
          <p>웰닉스 v2.1.8</p>
        </div>
      </div>
    </AppLayout>
  );
}