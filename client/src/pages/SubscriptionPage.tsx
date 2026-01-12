import { useState, useRef } from "react";
import { ArrowLeft, ShoppingCart, Gift, ChevronRight, Heart, Calendar, Users, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";
import happySeniorsImage from "@assets/generated_images/happy_seniors_receiving_gift.png";

const recipientTabs = ["소중한 분", "연인", "부부", "친구", "조카"];

const subscriptionPlans = [
  { 
    id: "basic", 
    name: "베이직 박스", 
    price: 89000, 
    originalPrice: 120000,
    description: "매월 엄선된 건강식품 3~4종",
    features: ["홍삼/건강즙 포함", "계절별 맞춤 구성", "무료 배송"],
    popular: false
  },
  { 
    id: "premium", 
    name: "프리미엄 박스", 
    price: 159000, 
    originalPrice: 200000,
    description: "프리미엄 건강식품 5~6종 + 특별선물",
    features: ["고급 홍삼/녹용 포함", "시즌 한정 특별구성", "고급 포장 & 손편지"],
    popular: true
  },
  { 
    id: "vip", 
    name: "VIP 박스", 
    price: 289000, 
    originalPrice: 350000,
    description: "최상급 건강식품 8종 + VIP 혜택",
    features: ["최상급 산삼/녹용", "1:1 건강상담", "VIP 전용 이벤트"],
    popular: false
  },
];

const monthlyStories = [
  { month: "1월", theme: "새해 건강 기원", highlight: "6년근 홍삼정과 세트", image: giftBoxImage },
  { month: "2월", theme: "사랑을 전하는 설날", highlight: "프리미엄 한우 세트", image: giftBoxImage },
  { month: "3월", theme: "봄맞이 활력충전", highlight: "유기농 꿀 & 견과류", image: giftBoxImage },
];

const popularGifts = [
  { id: "1", name: "설 숙성한우 선물세트", price: 138000, tag: "최대 2.5만원 보자기 증정", option: "13.8만원 ~ 100만원(17타입)" },
  { id: "2", name: "프레스티지 숙성한우 선물세트", price: 620000, tag: "특별 제작 한정 판매", option: "62만원 ~ 100만원(3타입)" },
  { id: "3", name: "한우 에너지바 세트", price: 45000, originalPrice: 61000, tag: "신년 기획전", option: "45g / 45g*24" },
];

export default function SubscriptionPage() {
  const [selectedTab, setSelectedTab] = useState("소중한 분");
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <AppLayout>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/")} className="p-1 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">장수박스</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-primary text-primary text-sm font-medium rounded-lg">기업문의</button>
            <button className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pb-24">
        <div className="relative h-56 overflow-hidden">
          <img src={happySeniorsImage} alt="장수박스" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-amber-300 text-sm font-medium mb-1">매달 찾아가는 건강 선물</p>
            <h2 className="text-white text-2xl font-bold mb-2">선물은 역시,<br/>장수박스</h2>
            <p className="text-white/70 text-sm">부모님께 매달 건강과 사랑을 전하세요</p>
          </div>
          <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur px-2 py-1 rounded text-white text-xs">1 / 2</div>
        </div>

        <button className="w-full bg-amber-50 border-y border-amber-100 p-4 flex items-center gap-3 hover:bg-amber-100 transition-colors">
          <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-800">마음 전하는 '선물하기' 설명서</p>
            <p className="text-sm text-gray-500">장수박스 구독 방법 알아보기</p>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-500" />
        </button>

        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1">장수박스란?</h3>
          <p className="text-sm text-gray-600 mb-4">
            매달 부모님께 건강식품과 따뜻한 마음을 담아 보내는 정기 구독 선물 서비스입니다. 
            계절과 건강 트렌드에 맞춰 전문가가 엄선한 프리미엄 건강식품을 정성스럽게 포장하여 배송해 드립니다.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { icon: Calendar, label: "매월 정기배송", desc: "15일 자동발송" },
              { icon: Heart, label: "맞춤 구성", desc: "건강상태 맞춤" },
              { icon: Users, label: "손편지 동봉", desc: "마음을 전해요" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            구독 플랜 선택
          </h3>
          
          <div className="space-y-3">
            {subscriptionPlans.map((plan) => (
              <button
                key={plan.id}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  plan.popular 
                    ? "border-primary bg-white shadow-lg" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-0.5 rounded mb-2">
                    BEST
                  </span>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{plan.name}</h4>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 line-through">{plan.originalPrice.toLocaleString()}원</p>
                    <p className="text-lg font-bold text-primary">{plan.price.toLocaleString()}원<span className="text-sm font-normal text-gray-500">/월</span></p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {plan.features.map((f) => (
                    <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">매월 장수박스 이야기</h3>
          <div 
            ref={scrollRef}
            onWheel={handleWheel}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          >
            {monthlyStories.map((story) => (
              <div key={story.month} className="flex-shrink-0 w-40">
                <div className="relative rounded-xl overflow-hidden mb-2">
                  <img src={story.image} alt={story.theme} className="w-full aspect-square object-cover" />
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">{story.month}</span>
                </div>
                <p className="font-semibold text-sm text-gray-800 truncate">{story.theme}</p>
                <p className="text-xs text-gray-500 truncate">{story.highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 bg-gray-100" />

        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            차이를 안다면, 웰닉스 <span className="text-xl">🎁</span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">떠오르는 분에게 맞춤 선물</p>
          
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {recipientTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTab === tab 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {popularGifts.map((gift) => (
              <div key={gift.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={giftBoxImage} alt={gift.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-amber-600 font-medium">{gift.tag}</span>
                  <h4 className="font-semibold text-gray-800 text-sm mt-0.5 truncate">{gift.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{gift.option}</p>
                  <p className="text-base font-bold text-gray-900 mt-1">
                    {gift.price.toLocaleString()}원~
                  </p>
                </div>
                <button className="self-end p-2 bg-white rounded-lg shadow-sm">
                  <Gift className="w-5 h-5 text-primary" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}