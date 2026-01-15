import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Building2, Gift, Users, Calendar, CheckCircle, Send } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import hqImage from "@assets/generated_images/modern_wellness_company_hq.png";

export default function CorporateInquiryPage() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("문의가 성공적으로 접수되었습니다. 담당자가 빠른 시일 내에 연락드리겠습니다.", {
        position: "top-center",
        duration: 3000,
      });
      // Optional: Reset form or navigate back
      // setLocation("/mypage");
    }, 1500);
  };

  return (
    <AppLayout hideNav>
      <SEO 
        title="기업 제휴/단체 구매 문의 | 웰닉스" 
        description="웰닉스의 프리미엄 건강식품으로 임직원과 거래처에 감사의 마음을 전하세요."
      />
      
      <div className="min-h-screen bg-white pb-10">
        <header className="sticky top-0 bg-white/95 backdrop-blur z-20 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setLocation("/mypage")} className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">기업 제휴 문의</h1>
        </header>

        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden">
          <img src={hqImage} alt="Corporate Wellness" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#006861]/90 to-[#006861]/40" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <span className="inline-block bg-white/20 backdrop-blur border border-white/30 text-xs font-bold px-2 py-1 rounded mb-3 w-fit">
              Corporate Membership
            </span>
            <h2 className="text-2xl font-bold mb-2 leading-tight">
              성공적인 비즈니스를 위한<br />
              품격 있는 건강 선물
            </h2>
            <p className="text-white/80 text-sm">
              임직원 복지부터 거래처 명절 선물까지,<br />
              웰닉스가 귀사의 품격을 높여드립니다.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-5 py-8 bg-gray-50">
          <h3 className="font-bold text-gray-900 text-lg mb-1 text-center">기업 회원만의 특별한 혜택</h3>
          <p className="text-gray-500 text-sm text-center mb-8">오직 기업 고객님만을 위해 준비했습니다</p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                icon: Gift, 
                title: "대량 구매 할인", 
                desc: "구매 수량에 따른\n특별 할인율 적용" 
              },
              { 
                icon: Building2, 
                title: "기업 로고 브랜딩", 
                desc: "패키지 및 감사 카드에\n기업 로고 인쇄" 
              },
              { 
                icon: Users, 
                title: "전담 매니저 케어", 
                desc: "견적부터 배송까지\n1:1 전담 관리" 
              },
              { 
                icon: Calendar, 
                title: "지정일 배송", 
                desc: "원하시는 날짜에\n안전하게 일괄 배송" 
              },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="px-5 py-8">
          <h3 className="font-bold text-gray-900 text-lg mb-6">진행 절차</h3>
          <div className="relative flex justify-between">
            {/* Connecting Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -z-10" />
            
            {[
              { step: "01", title: "문의 접수" },
              { step: "02", title: "상담/견적" },
              { step: "03", title: "계약 체결" },
              { step: "04", title: "상품 배송" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white px-2">
                <div className="w-8 h-8 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center mb-2 border-4 border-white">
                  {item.step}
                </div>
                <span className="text-xs font-medium text-gray-600">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 bg-gray-50" />

        {/* Inquiry Form */}
        <div className="px-5 py-8" id="inquiry-form">
          <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            간편 상담 신청
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">기업명 <span className="text-red-500">*</span></label>
              <input 
                required 
                type="text" 
                placeholder="기업명을 입력해주세요" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자명 <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="text" 
                  placeholder="성함" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="tel" 
                  placeholder="010-0000-0000" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-red-500">*</span></label>
              <input 
                required 
                type="email" 
                placeholder="example@company.com" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
              <textarea 
                rows={4}
                placeholder="예상 수량, 예산, 희망 배송일 등 문의하실 내용을 자유롭게 적어주세요." 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="text-xs text-gray-500 leading-relaxed">
                  개인정보 수집 및 이용에 동의합니다. (필수)<br/>
                  <span className="text-gray-400">수집된 정보는 상담 처리 목적으로만 사용됩니다.</span>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? "접수 중..." : "무료 견적/상담 신청하기"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}