import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, Mail, Shield, Check, Edit2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

type AuthProvider = "kakao" | "naver" | "email";

export default function MyProfilePage() {
  const [, setLocation] = useLocation();
  const { user, isLoading, refetch } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string }) => {
      const res = await fetch("/api/members/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "회원정보 수정에 실패했습니다");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      refetch();
      setIsEditing(false);
      toast.success("회원정보가 수정되었습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    if (!editName.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (!editPhone.trim()) {
      toast.error("휴대폰 번호를 입력해주세요.");
      return;
    }

    updateProfileMutation.mutate({ name: editName, phone: editPhone });
  };

  const handleCancel = () => {
    setEditName(user?.name || "");
    setEditPhone(user?.phone || "");
    setIsEditing(false);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setEditPhone(formatted);
  };

  const getAuthProviderInfo = (provider: AuthProvider | string | null | undefined) => {
    switch (provider) {
      case "kakao":
        return {
          name: "카카오",
          bgColor: "bg-[#FEE500]",
          textColor: "text-[#3C1E1E]",
          isSocial: true,
          icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.031 5.903-.162.606-.583 2.19-.667 2.531-.104.422.155.416.326.303.135-.09 2.145-1.456 3.013-2.046.429.061.869.093 1.297.093 5.523 0 10-3.477 10-7.784C20 6.477 17.523 3 12 3z"/>
            </svg>
          )
        };
      case "naver":
        return {
          name: "네이버",
          bgColor: "bg-[#03C75A]",
          textColor: "text-white",
          isSocial: true,
          icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
              <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
            </svg>
          )
        };
      default:
        return {
          name: "이메일",
          bgColor: "bg-primary",
          textColor: "text-white",
          isSocial: false,
          icon: (
            <Mail className="w-4 h-4 text-white" />
          )
        };
    }
  };

  const authInfo = getAuthProviderInfo(user?.authProvider);

  const formatJoinDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <SEO title="회원정보 수정" description="웰닉스 회원정보를 수정하세요." />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩중...</div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <AppLayout>
      <SEO 
        title="회원정보 수정" 
        description="웰닉스 회원정보를 수정하세요."
      />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="p-4 flex items-center gap-3">
          <button 
            onClick={() => setLocation("/mypage")}
            className="p-1 hover:bg-gray-100 rounded-full"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">회원정보 수정</h1>
        </div>
      </header>

      <div className="pb-24">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900">{user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${authInfo.bgColor}`}>
                  {authInfo.icon}
                  <span className={`text-xs font-medium ${authInfo.textColor}`}>{authInfo.name} 인증</span>
                </div>
              </div>
            </div>
          </div>

          {authInfo.isSocial && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">소셜 로그인 회원</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {authInfo.name} 계정으로 로그인하셨습니다. 비밀번호 변경은 {authInfo.name}에서 진행해주세요.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">회원번호</label>
              <div className="relative">
                <input
                  type="text"
                  value={`#${user.id}`}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  data-testid="input-id"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
                  변경불가
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">이름</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="이름을 입력하세요"
                  data-testid="input-name"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                  {user.name || "-"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">휴대폰 번호</label>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="010-0000-0000"
                    maxLength={13}
                    data-testid="input-phone"
                  />
                </div>
              ) : (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {user.phone || "-"}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  data-testid="input-email"
                />
              </div>
              {authInfo.isSocial && (
                <p className="text-xs text-gray-400 mt-1">{authInfo.name} 계정에 연결된 이메일입니다.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">가입일</label>
              <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
                {formatJoinDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-auto lg:w-[430px] lg:mx-auto bg-white border-t border-gray-100 p-4">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                data-testid="btn-cancel"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="btn-save"
              >
                {updateProfileMutation.isPending ? (
                  "저장중..."
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    저장하기
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              data-testid="btn-edit"
            >
              <Edit2 className="w-5 h-5" />
              정보 수정하기
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
