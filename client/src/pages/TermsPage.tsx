import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";

export default function TermsPage() {
  const [, setLocation] = useLocation();

  return (
    <AppLayout>
      <SEO 
        title="이용약관" 
        description="웰닉스 서비스 이용약관입니다."
      />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="p-4 flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="p-1 hover:bg-gray-100 rounded-full"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">이용약관</h1>
        </div>
      </header>

      <div className="p-4 pb-24">
        <div className="prose prose-sm max-w-none">
          <p className="text-xs text-gray-400 mb-4">시행일: 2026년 1월 1일</p>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              이 약관은 주식회사 웰닉스(이하 "회사")가 제공하는 웰닉스 서비스(이하 "서비스")의 이용과 관련하여 
              회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (정의)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>① "서비스"란 회사가 제공하는 건강식품 판매, 정기구독, 건강 행사 등 관련 제반 서비스를 의미합니다.</p>
              <p>② "회원"이란 이 약관에 동의하고 회사와 서비스 이용 계약을 체결한 자를 의미합니다.</p>
              <p>③ "아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 의미합니다.</p>
              <p>④ "비밀번호"란 회원의 동일성 확인과 회원정보 보호를 위해 회원이 설정한 문자와 숫자의 조합을 의미합니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (약관의 효력 및 변경)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</p>
              <p>② 회사는 관련 법률을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
              <p>③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 전부터 적용일자 전일까지 공지합니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (서비스의 제공)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>건강식품 및 관련 상품의 판매</li>
                <li>장수박스 정기구독 서비스</li>
                <li>건강 세미나, 클래스 등 행사 예약 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (회원가입)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>① 회원가입은 이용자가 약관의 내용에 대하여 동의를 하고 회원가입 신청을 한 후 회사가 이를 승낙함으로써 체결됩니다.</p>
              <p>② 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                <li>만 14세 미만인 경우</li>
                <li>이전에 회원자격을 상실한 적이 있는 경우</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (회원 탈퇴 및 자격 상실)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>① 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.</p>
              <p>② 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 또는 정지시킬 수 있습니다:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>가입 신청 시 허위 내용을 등록한 경우</li>
                <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (정기구독 서비스)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>① 장수박스 정기구독 서비스는 회원이 선택한 플랜에 따라 매월 정해진 날짜에 상품이 배송됩니다.</p>
              <p>② 구독 해지는 다음 결제일 7일 전까지 신청하여야 합니다.</p>
              <p>③ 구독 중 배송된 상품의 교환 및 환불은 상품 수령 후 7일 이내에 신청하여야 합니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (결제 및 환불)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>① 상품 대금의 결제는 신용카드, 계좌이체, 간편결제 등 회사가 정한 방법으로 할 수 있습니다.</p>
              <p>② 환불은 관련 법령 및 회사의 환불 정책에 따릅니다.</p>
              <p>③ 단순 변심에 의한 환불 시 반품 배송비는 회원이 부담합니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (개인정보보호)</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 
              개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제10조 (분쟁해결)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>① 회사와 회원 간에 발생한 분쟁에 관한 소송은 서울중앙지방법원을 관할법원으로 합니다.</p>
              <p>② 회사와 회원 간에 제기된 소송에는 대한민국법을 적용합니다.</p>
            </div>
          </section>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              본 약관은 2026년 1월 1일부터 시행됩니다.<br />
              문의사항은 고객센터(1588-0000)로 연락주세요.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
