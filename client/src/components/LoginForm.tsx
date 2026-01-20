import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LoginFormProps {
  onLogin: (email: string, password: string, name?: string) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onLogin, isLoading }: LoginFormProps) {
  const [, setLocation] = useLocation();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (res.ok) {
        toast.success("비밀번호 재설정 링크를 이메일로 보냈습니다.");
        setShowForgotPassword(false);
        setResetEmail("");
      } else {
        const data = await res.json();
        toast.error(data.message || "이메일 전송에 실패했습니다.");
      }
    } catch {
      toast.error("잠시 후 다시 시도해주세요.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} 로그인은 현재 준비 중입니다.`);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    try {
      await onLogin(email, password);
      toast.success("로그인 성공!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "로그인에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !name) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await onLogin(email, password, name);
      toast.success("회원가입이 완료되었습니다!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "회원가입에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isSignup ? "이메일로 가입하기" : "로그인이 필요합니다"}
        </h2>
        <p className="text-sm text-gray-500">
          {isSignup ? "이메일 인증 후 가입이 완료됩니다" : "웰닉스의 다양한 서비스를 이용해보세요"}
        </p>
      </div>

      {!showEmailForm ? (
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

          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            data-testid="btn-email-login"
          >
            <Mail className="w-5 h-5" />
            이메일로 로그인/가입
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                !isSignup ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
              data-testid="tab-login"
            >
              로그인
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isSignup ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
              data-testid="tab-signup"
            >
              회원가입
            </button>
          </div>

          {isSignup ? (
            <form onSubmit={handleEmailSignup} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-signup-name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-signup-email"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상 입력"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-signup-password"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 다시 입력"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-signup-confirm"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="btn-signup-submit"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                {isLoading ? "가입 중..." : "회원가입"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-login-email"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-login-password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="btn-login-submit"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="w-full py-2 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            </form>
          )}

          <button
            onClick={() => {
              setShowEmailForm(false);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="w-full py-2 mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            다른 방법으로 로그인
          </button>
        </div>
      )}

      {showForgotPassword && (
        <>
          <div
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => {
              setShowForgotPassword(false);
              setResetEmail("");
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-center mb-2">비밀번호 찾기</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              가입한 이메일을 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">이메일</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  data-testid="input-reset-email"
                />
              </div>
              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="btn-reset-submit"
              >
                {isResetting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isResetting ? "전송 중..." : "재설정 링크 보내기"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                }}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                취소
              </button>
            </form>
          </div>
        </>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-400">
          {isSignup ? "가입" : "로그인"} 시{" "}
          <button
            type="button"
            onClick={() => setLocation("/terms")}
            className="text-primary underline hover:text-primary/80"
          >
            이용약관
          </button> 및{" "}
          <button
            type="button"
            onClick={() => setLocation("/privacy")}
            className="text-primary underline hover:text-primary/80"
          >
            개인정보처리방침
          </button>에 동의합니다.
        </p>
      </div>
    </div>
  );
}
