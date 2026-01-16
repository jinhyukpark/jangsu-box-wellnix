import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";

export default function PrivacyPage() {
  const [, setLocation] = useLocation();

  return (
    <AppLayout>
      <SEO 
        title="개인정보처리방침" 
        description="웰닉스 개인정보처리방침입니다."
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
          <h1 className="text-xl font-bold text-gray-900">개인정보처리방침</h1>
        </div>
      </header>

      <div className="p-4 pb-24">
        <div className="prose prose-sm max-w-none">
          <p className="text-xs text-gray-400 mb-4">시행일: 2026년 1월 1일</p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              주식회사 웰닉스(이하 "회사")는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 
              정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
            </p>
          </div>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (개인정보의 처리 목적)</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p><strong>1. 회원가입 및 관리</strong></p>
              <p className="pl-4">회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 등</p>
              
              <p><strong>2. 재화 또는 서비스 제공</strong></p>
              <p className="pl-4">물품배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 요금결제·정산 등</p>
              
              <p><strong>3. 마케팅 및 광고에의 활용</strong></p>
              <p className="pl-4">신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 서비스의 유효성 확인 등</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (처리하는 개인정보의 항목)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">필수 수집 항목</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>이름, 이메일, 비밀번호, 휴대폰번호</li>
                  <li>배송지 주소 (상품 구매 시)</li>
                  <li>결제 정보 (신용카드, 계좌번호 등)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">선택 수집 항목</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>생년월일, 성별</li>
                  <li>건강 관심사 (맞춤 상품 추천용)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">자동 수집 항목</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>IP주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
                  <li>기기정보 (OS, 브라우저 종류)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (개인정보의 처리 및 보유 기간)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              <div className="bg-gray-50 p-3 rounded-lg mt-3">
                <ul className="space-y-2">
                  <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간)</li>
                  <li><strong>계약 또는 청약철회에 관한 기록:</strong> 5년</li>
                  <li><strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년</li>
                  <li><strong>소비자 불만 또는 분쟁처리에 관한 기록:</strong> 3년</li>
                  <li><strong>표시/광고에 관한 기록:</strong> 6개월</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (개인정보의 제3자 제공)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
              <div className="bg-gray-50 p-3 rounded-lg mt-3">
                <p className="font-medium text-gray-800 mb-2">제3자 제공 현황</p>
                <ul className="space-y-2">
                  <li><strong>배송업체:</strong> 상품 배송을 위해 이름, 주소, 연락처 제공</li>
                  <li><strong>결제대행사:</strong> 결제 처리를 위해 결제 정보 제공</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (정보주체의 권리·의무 및 행사방법)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
              <p className="mt-3">위 권리 행사는 회사에 대해 서면, 전화, 이메일 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (개인정보의 파기)</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
              <p><strong>파기절차:</strong> 불필요한 개인정보는 개인정보관리책임자의 승인을 받아 파기합니다.</p>
              <p><strong>파기방법:</strong> 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (개인정보의 안전성 확보조치)</h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="mb-2">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>접속기록의 보관 및 위변조 방지</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (개인정보 보호책임자)</h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="mb-3">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>개인정보 보호책임자</strong></p>
                <p>성명: 김웰닉</p>
                <p>직책: 개인정보보호팀장</p>
                <p>연락처: privacy@wellnix.com / 1588-0000</p>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (개인정보 처리방침의 변경)</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              이 개인정보처리방침은 2026년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              본 개인정보처리방침은 2026년 1월 1일부터 시행됩니다.<br />
              문의사항은 고객센터(1588-0000) 또는 privacy@wellnix.com으로 연락주세요.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
