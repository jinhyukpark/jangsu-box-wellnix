import { ArrowLeft, Share2, Heart, Calendar, Package, Gift, CheckCircle, Building2, MapPin } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { images } from "@/lib/images";

const giftBoxImage = images.premiumKoreanHealthGiftBox;
const luckyPouchImage = images.koreanLuckyPouchBokjumeoni;
const ginsengImage = images.koreanRedGinsengJeonggwa;
const jujubeImage = images.koreanDriedJujubeChips;
const walnutImage = images.organicWalnutsInBowl;
const hangwaImage = images.traditionalKoreanHangwaCookies;

const storiesData: Record<string, {
  month: string;
  theme: string;
  highlight: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  sections: { title: string; content: string; image?: string }[];
  memoryBox: { title: string; story: string; item: string; image: string };
  products: { name: string; benefit: string; desc: string; image: string }[];
  healthTips: { title: string; tips: { tip: string; detail: string }[] };
  suppliers: { name: string; location: string; specialty: string }[];
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
        content: "홍삼은 재배 기간에 따라 그 효능이 달라집니다. 6년근 홍삼은 사포닌 함량이 가장 높아 면역력 증진과 피로 회복에 탁월한 효과가 있습니다. 웰닉스는 금산 지역의 GAP 인증 농가에서 직접 계약 재배한 최상급 6년근만을 사용합니다.",
        image: ginsengImage
      },
      {
        title: "정성을 담은 정과 제조법",
        content: "전통 방식 그대로, 홍삼을 꿀에 오랜 시간 절여 만든 정과는 쓴맛이 덜하고 부드러워 어르신들도 부담 없이 드실 수 있습니다. 하루 한 조각, 따뜻한 차와 함께 드시면 더욱 좋습니다."
      },
      {
        title: "이번 달 구성품 소개",
        content: "1월 장수박스에는 6년근 홍삼정과 외에도 국산 대추칩, 유기농 호두, 그리고 전통 한과가 함께 담겨있습니다. 모든 제품은 무방부제, 무색소 원칙을 지키며 건강한 원재료만을 사용했습니다.",
        image: giftBoxImage
      }
    ],
    memoryBox: {
      title: "1월 추억상자",
      item: "새해 복주머니 카드",
      story: "올해도 건강하시길 바라는 마음을 담아, 전통 복주머니 모양의 새해 인사 카드를 넣어드렸어요. 손자녀의 사진과 함께 새해 인사를 적어 보내보세요. 부모님께서 정말 좋아하실 거예요!",
      image: luckyPouchImage
    },
    products: [
      { name: "6년근 홍삼정과 150g", benefit: "면역력 증진", desc: "금산 GAP인증 농가 직거래, 전통 꿀 절임 방식", image: ginsengImage },
      { name: "국산 대추칩 80g", benefit: "혈액순환 개선", desc: "경북 경산 대추, 무첨가 자연건조", image: jujubeImage },
      { name: "유기농 호두 100g", benefit: "두뇌 건강", desc: "국산 유기농 인증, 저온 로스팅", image: walnutImage },
      { name: "전통 한과 세트", benefit: "기력 보충", desc: "수제 유과, 약과 5종 구성", image: hangwaImage },
    ],
    healthTips: {
      title: "1월 건강 지킴 수칙",
      tips: [
        { tip: "아침 공복에 따뜻한 물 한 잔으로 하루를 시작하세요", detail: "자는 동안 탈수된 몸에 수분을 공급하고, 장 운동을 활성화해 아침 배변을 도와줍니다. 체온과 비슷한 40도 정도의 물이 가장 좋아요." },
        { tip: "실내 습도 50-60%를 유지해 호흡기 건강을 지키세요", detail: "겨울철 난방으로 건조해진 실내는 바이러스가 번식하기 좋은 환경입니다. 가습기를 사용하거나 젖은 수건을 걸어 적정 습도를 유지해주세요." },
        { tip: "하루 30분 이상 햇빛을 쬐어 비타민D를 보충하세요", detail: "비타민D는 뼈 건강과 면역력에 필수적입니다. 오전 10시~오후 2시 사이 햇빛이 가장 좋으며, 유리창을 통한 햇빛은 효과가 떨어집니다." },
        { tip: "홍삼은 아침 식후에 드시면 흡수율이 높아집니다", detail: "공복에 드시면 위장에 부담을 줄 수 있어요. 아침 식사 후 30분 뒤 따뜻한 물과 함께 드시면 사포닌 성분의 흡수율이 최대로 높아집니다." }
      ]
    },
    suppliers: [
      { name: "금산인삼농협", location: "충남 금산군", specialty: "6년근 홍삼 전문" },
      { name: "경산대추영농조합", location: "경북 경산시", specialty: "친환경 대추 재배" },
      { name: "전통한과명인 김순희", location: "전북 전주시", specialty: "전통 한과 40년 명인" },
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
        content: "한우는 등급에 따라 맛과 품질이 크게 달라집니다. 1++ 등급은 전체 한우 중 상위 5%에만 부여되는 최고 등급으로, 마블링이 풍부하고 육질이 부드러워 입안에서 살살 녹습니다.",
        image: giftBoxImage
      },
      {
        title: "숙성의 기술",
        content: "웰닉스의 한우는 28일간 저온 숙성 과정을 거칩니다. 이 과정에서 고기의 단백질이 아미노산으로 분해되어 감칠맛이 깊어지고, 육질은 더욱 연해집니다."
      },
      {
        title: "설 특선 구성",
        content: "2월 장수박스에는 한우 등심과 안심 외에도 명절 한정 떡국떡, 전통 식혜, 고급 견과류가 함께 담겨 있어 온 가족이 함께 즐기실 수 있습니다.",
        image: hangwaImage
      }
    ],
    memoryBox: {
      title: "2월 추억상자",
      item: "쫀득이 찹쌀떡",
      story: "설날 하면 떠오르는 쫀득한 찹쌀떡! 이번 추억상자에는 전통 방식으로 만든 '쫀득이' 찹쌀떡을 넣어드렸어요. 80년 전통 떡집에서 직접 빚은 찹쌀떡으로, 어린 시절 명절마다 할머니가 해주시던 그 맛을 담았습니다.",
      image: hangwaImage
    },
    products: [
      { name: "1++ 한우 등심 300g", benefit: "고단백 철분", desc: "횡성한우 1++ 등급, 28일 숙성", image: giftBoxImage },
      { name: "1++ 한우 안심 200g", benefit: "저지방 고단백", desc: "가장 부드러운 부위, 스테이크용", image: giftBoxImage },
      { name: "명절 떡국떡 500g", benefit: "에너지 보충", desc: "국산 쌀 100%, 쫄깃한 식감", image: hangwaImage },
      { name: "전통 식혜 1L", benefit: "소화 촉진", desc: "무설탕, 국산 엿기름 사용", image: jujubeImage },
    ],
    healthTips: {
      title: "2월 건강 지킴 수칙",
      tips: [
        { tip: "명절 과식 후에는 식혜나 수정과로 소화를 도우세요", detail: "식혜에 함유된 엿기름의 아밀라아제 효소가 탄수화물 소화를 돕고, 수정과의 생강 성분이 위장 운동을 활발하게 해줍니다." },
        { tip: "기름진 음식 섭취 후 따뜻한 녹차가 좋습니다", detail: "녹차의 카테킨 성분이 지방 분해를 돕고, 따뜻한 온도가 소화액 분비를 촉진합니다. 단, 식사 직후보다 30분 후에 드세요." },
        { tip: "가족과 함께 가벼운 산책으로 소화를 촉진하세요", detail: "식후 15-20분 정도의 가벼운 산책은 혈당 조절과 소화에 도움이 됩니다. 격렬한 운동보다 천천히 걷는 것이 더 효과적이에요." },
        { tip: "고기는 쌈채소와 함께 드시면 영양 균형이 좋아요", detail: "상추, 깻잎 등 쌈채소의 식이섬유가 고기의 지방 흡수를 줄이고, 비타민C가 철분 흡수를 높여줍니다. 고기 3 : 채소 7 비율이 이상적입니다." }
      ]
    },
    suppliers: [
      { name: "횡성한우조합", location: "강원 횡성군", specialty: "1++ 등급 한우 전문" },
      { name: "이천쌀농협", location: "경기 이천시", specialty: "임금님표 이천쌀" },
      { name: "전통주가 박막례", location: "경북 안동시", specialty: "전통 식혜/수정과 명인" },
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
        content: "지리산 해발 700m 이상의 고지대에서 채취한 야생화 꿀은 다양한 야생화의 화분이 섞여 있어 영양이 풍부합니다. 인공 사양을 전혀 하지 않은 순수 자연산 꿀로, 은은한 꽃향이 특징입니다.",
        image: ginsengImage
      },
      {
        title: "견과류의 건강 효능",
        content: "아몬드, 호두, 캐슈넛 등 견과류는 '자연이 준 비타민'이라 불립니다. 불포화지방산과 비타민E가 풍부해 혈관 건강과 피부 노화 방지에 효과적입니다."
      },
      {
        title: "봄철 면역력 관리",
        content: "환절기에는 면역력이 떨어지기 쉽습니다. 매일 아침 따뜻한 물에 꿀을 타서 드시면 목 건강과 면역력 증진에 도움이 됩니다. 견과류 한 줌과 함께 드시면 더욱 좋습니다.",
        image: walnutImage
      }
    ],
    memoryBox: {
      title: "3월 추억상자",
      item: "봄꽃 씨앗 카드",
      story: "봄을 맞아 특별한 선물을 준비했어요. 심으면 꽃이 피어나는 씨앗 카드입니다! 물에 담가두면 코스모스, 해바라기 씨앗이 싹을 틔워요. 부모님과 함께 베란다에서 꽃을 키우며 봄의 설렘을 나눠보세요.",
      image: luckyPouchImage
    },
    products: [
      { name: "지리산 야생화 꿀 500g", benefit: "면역력 증진", desc: "해발 700m 고지대 채취, 비가열 생꿀", image: ginsengImage },
      { name: "국산 아몬드 150g", benefit: "혈관 건강", desc: "저온 로스팅, 무염 무첨가", image: walnutImage },
      { name: "볶음 호두 100g", benefit: "두뇌 건강", desc: "국산 100%, 껍질째 볶음", image: walnutImage },
      { name: "캐슈넛 100g", benefit: "뼈 건강", desc: "베트남 직수입, 경화유 無", image: jujubeImage },
    ],
    healthTips: {
      title: "3월 건강 지킴 수칙",
      tips: [
        { tip: "환절기 면역력을 위해 아침마다 꿀물을 드세요", detail: "꿀의 천연 항균 성분이 목 건강을 지켜주고, 포도당이 아침 에너지원이 됩니다. 40도 이하 미지근한 물에 타야 영양소가 파괴되지 않아요." },
        { tip: "미세먼지가 심한 날은 외출을 자제하세요", detail: "미세먼지 '나쁨' 이상인 날은 외출을 줄이고, 외출 시 KF94 마스크를 착용하세요. 귀가 후에는 손과 얼굴을 깨끗이 씻어주세요." },
        { tip: "봄나물로 겨우내 부족한 비타민을 보충하세요", detail: "냉이, 달래, 씀바귀 등 봄나물은 비타민A, C, 철분이 풍부합니다. 데쳐서 나물로 먹거나 된장국에 넣어 드시면 좋아요." },
        { tip: "견과류는 하루 한 줌(30g)이 적당합니다", detail: "견과류는 건강에 좋지만 칼로리가 높아 과식하면 체중 증가의 원인이 됩니다. 호두 3-4개, 아몬드 7-8개가 하루 적정량이에요." }
      ]
    },
    suppliers: [
      { name: "지리산벌꿀영농조합", location: "전남 구례군", specialty: "지리산 천연 생꿀" },
      { name: "김천견과류농장", location: "경북 김천시", specialty: "국산 호두/아몬드" },
      { name: "하동녹차마을", location: "경남 하동군", specialty: "유기농 녹차/꿀차" },
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
      <SEO 
        title={`${story.month} ${story.theme} - 장수박스`} 
        description={story.intro}
      />
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
              {section.image && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={section.image} alt={section.title} className="w-full aspect-video object-cover" />
                </div>
              )}
              <p className="text-gray-600 leading-relaxed text-[15px]">{section.content}</p>
            </div>
          ))}

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600" />
              {story.memoryBox.title}: {story.memoryBox.item}
            </h3>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={story.memoryBox.image} alt={story.memoryBox.item} className="w-full h-full object-cover" />
              </div>
              <p className="text-amber-900/80 text-sm leading-relaxed flex-1">
                {story.memoryBox.story}
              </p>
            </div>
          </div>

          <div className="bg-stone-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {story.month} 박스 구성품
            </h3>
            <div className="space-y-4">
              {story.products.map((product, idx) => (
                <div key={idx} className="flex gap-3 pb-4 border-b border-stone-200 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">{product.benefit}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{product.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {story.healthTips.title}
            </h3>
            <div className="space-y-4">
              {story.healthTips.tips.map((item, idx) => (
                <div key={idx} className="border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="font-medium text-gray-800 text-sm">{item.tip}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed ml-8">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              제휴 업체 정보
            </h3>
            <div className="space-y-3">
              {story.suppliers.map((supplier, idx) => (
                <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{supplier.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {supplier.location}
                      </span>
                      <span>·</span>
                      <span>{supplier.specialty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-center text-sm text-gray-600 mb-2">
              이 박스가 마음에 드시나요?
            </p>
            <p className="text-center text-xs text-gray-500">
              구독하시면 매월 새로운 테마의 장수박스를 받아보실 수 있어요
            </p>
          </div>

          <div className="flex gap-3 mt-6 mb-4">
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