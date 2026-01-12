import { ArrowLeft, Share2, Heart, Calendar, Package } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import giftBoxImage from "@assets/generated_images/premium_korean_health_gift_box.png";

const storiesData: Record<string, {
  month: string;
  theme: string;
  highlight: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  sections: { title: string; content: string; }[];
  products: { name: string; benefit: string; }[];
}> = {
  "1": {
    month: "1월",
    theme: "새해 건강 기원",
    highlight: "6년근 홍삼정과 세트",
    heroTitle: "새해, 건강한 시작을 선물하세요",
    heroSubtitle: "6년근 홍삼의 깊은 맛과 함께하는 1월 장수박스",
    intro: "새해가 밝았습니다. 웰닉스는 사랑하는 부모님의 건강한 한 해를 기원하며, 엄선된 6년근 홍삼정과와 전통 건강식품으로 1월 장수박스를 구성했습니다.",
    sections: [
      {
        title: "왜 6년근 홍삼인가요?",
        content: "홍삼은 재배 기간에 따라 그 효능이 달라집니다. 6년근 홍삼은 사포닌 함량이 가장 높아 면역력 증진과 피로 회복에 탁월한 효과가 있습니다. 웰닉스는 금산 지역의 GAP 인증 농가에서 직접 계약 재배한 최상급 6년근만을 사용합니다."
      },
      {
        title: "정성을 담은 정과 제조법",
        content: "전통 방식 그대로, 홍삼을 꿀에 오랜 시간 절여 만든 정과는 쓴맛이 덜하고 부드러워 어르신들도 부담 없이 드실 수 있습니다. 하루 한 조각, 따뜻한 차와 함께 드시면 더욱 좋습니다."
      },
      {
        title: "이번 달 구성품 소개",
        content: "1월 장수박스에는 6년근 홍삼정과 외에도 국산 대추칩, 유기농 호두, 그리고 전통 한과가 함께 담겨있습니다. 모든 제품은 무방부제, 무색소 원칙을 지키며 건강한 원재료만을 사용했습니다."
      }
    ],
    products: [
      { name: "6년근 홍삼정과 150g", benefit: "면역력 증진, 피로 회복" },
      { name: "국산 대추칩 80g", benefit: "혈액순환, 불면 개선" },
      { name: "유기농 호두 100g", benefit: "두뇌 건강, 노화 방지" },
      { name: "전통 한과 세트", benefit: "소화 촉진, 기력 보충" },
    ]
  },
  "2": {
    month: "2월",
    theme: "사랑을 전하는 설날",
    highlight: "프리미엄 한우 세트",
    heroTitle: "설날, 최고의 선물을 드리세요",
    heroSubtitle: "1++ 한우의 깊은 풍미가 담긴 2월 장수박스",
    intro: "민족 최대의 명절 설날, 웰닉스는 최상급 1++ 한우와 전통 명절 음식으로 특별한 2월 장수박스를 준비했습니다. 부모님께 진심을 담은 선물을 전해보세요.",
    sections: [
      {
        title: "1++ 한우, 왜 특별한가요?",
        content: "한우는 등급에 따라 맛과 품질이 크게 달라집니다. 1++ 등급은 전체 한우 중 상위 5%에만 부여되는 최고 등급으로, 마블링이 풍부하고 육질이 부드러워 입안에서 살살 녹습니다."
      },
      {
        title: "숙성의 기술",
        content: "웰닉스의 한우는 28일간 저온 숙성 과정을 거칩니다. 이 과정에서 고기의 단백질이 아미노산으로 분해되어 감칠맛이 깊어지고, 육질은 더욱 연해집니다."
      },
      {
        title: "설 특선 구성",
        content: "2월 장수박스에는 한우 등심과 안심 외에도 명절 한정 떡국떡, 전통 식혜, 고급 견과류가 함께 담겨 있어 온 가족이 함께 즐기실 수 있습니다."
      }
    ],
    products: [
      { name: "1++ 한우 등심 300g", benefit: "고단백, 철분 보충" },
      { name: "1++ 한우 안심 200g", benefit: "저지방 고단백" },
      { name: "명절 떡국떡 500g", benefit: "소화 용이, 에너지원" },
      { name: "전통 식혜 1L", benefit: "소화 촉진, 갈증 해소" },
    ]
  },
  "3": {
    month: "3월",
    theme: "봄맞이 활력충전",
    highlight: "유기농 꿀 & 견과류",
    heroTitle: "봄의 활력을 선물하세요",
    heroSubtitle: "자연이 선사하는 달콤함, 3월 장수박스",
    intro: "겨우내 움츠렸던 몸에 봄의 생기를 불어넣을 시간입니다. 웰닉스 3월 장수박스는 지리산 야생화 꿀과 국산 견과류로 봄철 건강을 지켜드립니다.",
    sections: [
      {
        title: "지리산 야생화 꿀의 특별함",
        content: "지리산 해발 700m 이상의 고지대에서 채취한 야생화 꿀은 다양한 야생화의 화분이 섞여 있어 영양이 풍부합니다. 인공 사양을 전혀 하지 않은 순수 자연산 꿀로, 은은한 꽃향이 특징입니다."
      },
      {
        title: "견과류의 건강 효능",
        content: "아몬드, 호두, 캐슈넛 등 견과류는 '자연이 준 비타민'이라 불립니다. 불포화지방산과 비타민E가 풍부해 혈관 건강과 피부 노화 방지에 효과적입니다."
      },
      {
        title: "봄철 면역력 관리",
        content: "환절기에는 면역력이 떨어지기 쉽습니다. 매일 아침 따뜻한 물에 꿀을 타서 드시면 목 건강과 면역력 증진에 도움이 됩니다. 견과류 한 줌과 함께 드시면 더욱 좋습니다."
      }
    ],
    products: [
      { name: "지리산 야생화 꿀 500g", benefit: "면역력 증진, 피로 회복" },
      { name: "국산 아몬드 150g", benefit: "혈관 건강, 피부 미용" },
      { name: "볶음 호두 100g", benefit: "두뇌 건강, 기억력 향상" },
      { name: "캐슈넛 100g", benefit: "뼈 건강, 스트레스 완화" },
    ]
  }
};

export default function StoryDetailPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const storyId = params.id || "1";
  const story = storiesData[storyId] || storiesData["1"];

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button onClick={() => setLocation("/subscription")} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900">{story.month} 장수박스</h1>
          <button className="p-1">
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="relative">
          <img src={giftBoxImage} alt={story.theme} className="w-full aspect-[4/3] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-2">{story.month}</span>
            <h2 className="text-xl font-bold text-white mb-1 font-serif">{story.heroTitle}</h2>
            <p className="text-sm text-white/80">{story.heroSubtitle}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              2026년 {story.month}
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {story.highlight}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-8 text-[15px]">
            {story.intro}
          </p>

          {story.sections.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">{section.title}</h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">{section.content}</p>
            </div>
          ))}

          <div className="bg-stone-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {story.month} 박스 구성품
            </h3>
            <div className="space-y-3">
              {story.products.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-200 last:border-0">
                  <span className="font-medium text-gray-800 text-sm">{product.name}</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{product.benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button className="flex-1 bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors">
              이 박스로 구독하기
            </button>
            <button className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
              <Heart className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}