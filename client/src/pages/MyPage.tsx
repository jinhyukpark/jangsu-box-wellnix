import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, ShoppingCart, ChevronRight, Gift, Package, Heart, Star, Truck, Award, Mail, User } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";
import happySeniorsImage from "@assets/generated_images/happy_seniors_receiving_gift.png";
import { toast } from "sonner";

const recentOrders = [
  { image: giftBoxImage, name: "[2026] 설 프리미엄 홍삼 선물세트", status: "배송중", date: "01.12 도착예정" },
  { image: giftBoxImage, name: "유기농 벌꿀 & 호두 세트", status: "구매확정", date: "01.08 배송완료" },
];

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialLogin = (provider: string) => {
    toast.success(`${provider} 로그인 진행 중...`);
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    toast.success("로그인 성공!");
    onLogin();
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
        <p className="text-sm text-gray-500">웰닉스의 다양한 서비스를 이용해보세요</p>
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleSocialLogin("카카오")}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#FEE500] rounded-lg font-medium text-[#3C1E1E] hover:bg-[#FDD835] transition-colors"
          data-testid="btn-kakao-login"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3C1E1E">
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.031 5.903-.162.606-.583 2.19-.667 2.531-.104.422.155.416.326.303.135-.09 2.145-1.456 3.013-2.046.429.061.869.093 1.297.093 5.523 0 10-3.477 10-7.784C20 6.477 17.523 3 12 3z"/>
          </svg>
          카카오로 시작하기
        </button>

        <button
          onClick={() => handleSocialLogin("Apple")}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-black rounded-lg font-medium text-white hover:bg-gray-800 transition-colors"
          data-testid="btn-apple-login"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple로 시작하기
        </button>

        <div className="relative flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {showEmailLogin ? (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                data-testid="input-email"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                data-testid="input-password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              data-testid="btn-email-submit"
            >
              이메일로 로그인
            </button>
            <button
              type="button"
              onClick={() => setShowEmailLogin(false)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              다른 방법으로 로그인
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowEmailLogin(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            data-testid="btn-email-login"
          >
            <Mail className="w-5 h-5" />
            이메일로 로그인
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          로그인 시 <span className="text-primary underline">이용약관</span> 및{" "}
          <span className="text-primary underline">개인정보처리방침</span>에 동의합니다.
        </p>
      </div>
    </div>
  );
}

export default function MyPage() {
  const [, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success("로그인되었습니다!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success("로그아웃되었습니다.");
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
        {!isLoggedIn ? (
          <>
            <LoginForm onLogin={handleLogin} />
            
            <div className="px-4 space-y-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-2">고객지원</h3>
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  {["공지사항", "자주 묻는 질문", "1:1 문의"].map((item) => (
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
            </div>

            <div className="px-4 text-center text-sm text-gray-400 pb-4">
              <p>웰닉스 v2.1.8</p>
            </div>
          </>
        ) : (
          <>
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

            <div className="px-4 mb-6">
              <button
                onClick={handleLogout}
                className="w-full py-3 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
                data-testid="btn-logout"
              >
                로그아웃
              </button>
            </div>

            <div className="px-4 text-center text-sm text-gray-400 pb-4">
              <p>웰닉스 v2.1.8</p>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
