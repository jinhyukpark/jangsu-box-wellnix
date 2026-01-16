import { useLocation, useSearch } from "wouter";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

export default function EmailSentPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const email = params.get("email") || "example@email.com";

  const handleResend = () => {
    toast.success("인증 이메일이 재발송되었습니다.");
  };

  const handleOpenEmail = () => {
    const emailDomain = email.split("@")[1];
    let mailUrl = "https://mail.google.com";
    
    if (emailDomain?.includes("naver")) {
      mailUrl = "https://mail.naver.com";
    } else if (emailDomain?.includes("daum") || emailDomain?.includes("kakao")) {
      mailUrl = "https://mail.daum.net";
    }
    
    window.open(mailUrl, "_blank");
  };

  return (
    <AppLayout>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="p-4 flex items-center gap-3">
          <button 
            onClick={() => setLocation("/mypage")}
            className="p-1 hover:bg-gray-100 rounded-full"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">이메일 인증</h1>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center p-6 pt-16">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-12 h-12 text-primary" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          인증 이메일을 보냈습니다
        </h2>

        <p className="text-gray-500 text-center mb-2">
          <span className="font-semibold text-primary">{email}</span>
        </p>

        <p className="text-sm text-gray-400 text-center mb-8">
          받은 메일함을 확인하고<br />
          <span className="font-medium text-gray-600">"인증하러 가기"</span> 버튼을 눌러주세요.
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={handleOpenEmail}
            className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            data-testid="btn-open-email"
          >
            <Mail className="w-5 h-5" />
            메일함 열기
          </button>

          <button
            onClick={handleResend}
            className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            data-testid="btn-resend"
          >
            <RefreshCw className="w-5 h-5" />
            인증 메일 다시 보내기
          </button>
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg w-full">
          <p className="text-sm text-amber-800 font-medium mb-2">이메일이 오지 않았나요?</p>
          <ul className="text-xs text-amber-600 space-y-1">
            <li>• 스팸함을 확인해주세요.</li>
            <li>• 이메일 주소가 정확한지 확인해주세요.</li>
            <li>• 잠시 후 다시 시도해주세요.</li>
          </ul>
        </div>

        <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-lg w-full">
          <p className="text-xs text-gray-500 text-center">
            인증 링크는 발송 후 <span className="font-semibold text-gray-700">24시간</span> 동안 유효합니다.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
