import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

type VerifyStatus = "verifying" | "success" | "error";

export default function EmailVerifyPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [status, setStatus] = useState<VerifyStatus>("verifying");

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verifyTimer = setTimeout(() => {
      setStatus("success");
    }, 2000);

    return () => clearTimeout(verifyTimer);
  }, [searchString]);

  const handleGoToHome = () => {
    setLocation("/");
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {status === "verifying" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">이메일 인증 중...</h1>
            <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">인증 완료!</h1>
            <p className="text-gray-500 mb-8">
              이메일 인증이 성공적으로 완료되었습니다.<br />
              이제 웰닉스의 모든 서비스를 이용할 수 있습니다.
            </p>
            <button
              onClick={handleGoToHome}
              className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              data-testid="btn-go-home"
            >
              웰닉스 서비스로 이동하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">인증 실패</h1>
            <p className="text-gray-500 mb-8">
              인증 링크가 만료되었거나 유효하지 않습니다.<br />
              다시 시도해주세요.
            </p>
            <button
              onClick={() => setLocation("/mypage")}
              className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              data-testid="btn-retry"
            >
              다시 인증하기
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
