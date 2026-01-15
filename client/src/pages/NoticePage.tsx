import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronDown, ChevronUp, Megaphone, Info, AlertCircle, Calendar } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";

// Mock data for notices
const notices = [
  {
    id: 1,
    type: "important",
    title: "[중요] 개인정보 처리방침 변경 안내",
    date: "2026.01.10",
    content: `안녕하세요, 웰닉스입니다.

보다 나은 서비스 제공을 위해 개인정보 처리방침이 변경될 예정입니다.
변경된 내용은 2026년 2월 1일부터 적용됩니다.

주요 변경 사항:
- 마케팅 정보 수신 동의 항목 세분화
- 장기 미접속 회원 휴면 정책 변경

자세한 내용은 고객센터 공지사항을 확인해 주세요.
감사합니다.`
  },
  {
    id: 2,
    type: "event",
    title: "설날 맞이 '효심 박스' 특별 할인 이벤트",
    date: "2026.01.05",
    content: `민족 대명절 설날을 맞아 웰닉스가 준비했습니다!

기간: 1월 10일 ~ 1월 24일
대상: 전 회원
내용: 효심 박스 20% 즉시 할인 + 무료 배송

부모님께 건강을 선물하세요.
사랑하는 마음을 담아 정성껏 포장해 드립니다.`
  },
  {
    id: 3,
    type: "system",
    title: "시스템 정기 점검 안내 (1/20 02:00~06:00)",
    date: "2026.01.03",
    content: `안정적인 서비스 제공을 위한 시스템 정기 점검이 진행됩니다.

일시: 2026년 1월 20일(화) 02:00 ~ 06:00 (4시간)
내용: 서버 안정화 및 보안 업데이트
영향: 점검 시간 동안 서비스 접속 및 이용 불가

이용에 불편을 드려 죄송합니다.
더 나은 서비스를 위해 최선을 다하겠습니다.`
  },
  {
    id: 4,
    type: "general",
    title: "웰닉스 앱 리뷰 작성 시 포인트 지급 안내",
    date: "2025.12.28",
    content: `웰닉스 앱을 이용해 주시는 고객님들께 감사드립니다.

앱 리뷰를 작성해 주시는 모든 분들께 현금처럼 사용 가능한
포인트 1,000P를 적립해 드립니다!

참여 방법:
1. 마이페이지 > 나의 리뷰 메뉴에서 리뷰 작성
2. 사진 첨부 시 500P 추가 지급

많은 참여 부탁드립니다.`
  },
  {
    id: 5,
    type: "general",
    title: "12월 베스트 리뷰 당첨자 발표",
    date: "2025.12.25",
    content: `12월 한 달간 정성스러운 리뷰를 남겨주신 고객님들 중
베스트 리뷰어로 선정되신 분들을 발표합니다.

[당첨자 명단]
김*수 (010-****-1234)
이*영 (010-****-5678)
박*민 (010-****-9012)

축하드립니다!
당첨되신 분들께는 개별 문자로 경품 안내를 드렸습니다.`
  }
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case "important":
      return { 
        label: "중요", 
        className: "bg-red-50 text-red-600 border-red-100",
        icon: AlertCircle
      };
    case "event":
      return { 
        label: "이벤트", 
        className: "bg-primary/10 text-primary border-primary/20",
        icon: Calendar
      };
    case "system":
      return { 
        label: "점검", 
        className: "bg-orange-50 text-orange-600 border-orange-100",
        icon: Info
      };
    default:
      return { 
        label: "공지", 
        className: "bg-gray-100 text-gray-600 border-gray-200",
        icon: Megaphone
      };
  }
};

export default function NoticePage() {
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AppLayout hideNav>
      <SEO title="공지사항 | 웰닉스" description="웰닉스의 새로운 소식과 안내사항을 확인하세요." />
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLocation("/mypage")} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">공지사항</h1>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-3">
          {notices.map((notice) => {
            const { label, className, icon: Icon } = getTypeStyles(notice.type);
            const isExpanded = expandedId === notice.id;

            return (
              <div 
                key={notice.id} 
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? "border-primary shadow-md" : "border-gray-100 shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleExpand(notice.id)}
                  className="w-full text-left p-4 flex items-start gap-3"
                >
                  <div className={`flex-shrink-0 px-2 py-1 rounded text-xs font-bold border flex items-center gap-1 ${className}`}>
                    {notice.type === 'important' && <AlertCircle className="w-3 h-3" />}
                    {label}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium mb-1 transition-colors ${isExpanded ? "text-primary" : "text-gray-900"}`}>
                      {notice.title}
                    </h3>
                    <p className="text-xs text-gray-400">{notice.date}</p>
                  </div>

                  <div className="flex-shrink-0 text-gray-400 pt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-5 pt-1">
                    <div className="h-px bg-gray-100 mb-4" />
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                      {notice.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}