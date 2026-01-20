import { useLocation } from "wouter";
import { Menu, X, LogOut } from "lucide-react";
import { adminMenuItems } from "@/lib/adminMenu";
import { useAdminUI } from "@/contexts/AdminUIContext";
import { useAdminAuth, useAdminLogout } from "@/hooks/use-admin-auth";

interface AdminSidebarProps {
  activeTab?: string;
  onNavigate?: (path: string) => void;
}

export function AdminSidebar({ activeTab, onNavigate }: AdminSidebarProps) {
  const { sidebarOpen, toggleSidebar } = useAdminUI();
  const [location, setLocation] = useLocation();
  const { data: authData } = useAdminAuth();
  const logoutMutation = useAdminLogout();

  const currentAdmin = authData?.admin;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 현재 경로에서 활성 탭 자동 감지
  const getActiveTab = (): string => {
    if (activeTab) return activeTab;

    // URL에서 탭 추출
    if (location.startsWith("/admin/products")) return "products";
    if (location.startsWith("/admin/events")) return "events";
    if (location.startsWith("/admin/promotions")) return "promotions";

    // 쿼리 파라미터에서 탭 추출
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (tab) return tab;

    return "dashboard";
  };

  const currentTab = getActiveTab();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      setLocation(path);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold text-primary">웰닉스 관리자</h1>
        ) : (
          <span className="text-xl font-bold text-primary mx-auto">W</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 네비게이션 */}
      <nav className="p-4 space-y-1">
        {adminMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(`/admin?tab=${item.id}`)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              currentTab === item.id
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* 하단 사용자 정보 및 로그아웃 */}
      <div className="absolute bottom-4 left-4 right-4">
        {sidebarOpen && currentAdmin && (
          <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">로그인됨</p>
            <p className="text-sm font-medium text-gray-900 truncate">{currentAdmin.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentAdmin.email}</p>
          </div>
        )}
        {sidebarOpen ? (
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}</span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex justify-center py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            data-testid="button-admin-logout-small"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
