import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Home, Bell, Package, Gift, Megaphone, CheckCheck } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

interface Notification {
  id: number;
  memberId: number;
  notificationType: string | null;
  title: string;
  content: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

function getNotificationIcon(type: string | null) {
  switch (type) {
    case "order":
      return <Package className="w-5 h-5" />;
    case "promotion":
      return <Gift className="w-5 h-5" />;
    case "announcement":
      return <Megaphone className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/notifications"], (old: Notification[] | undefined) =>
        old?.map(n => ({ ...n, isRead: true })) || []
      );
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PUT", `/api/notifications/${id}/read`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["/api/notifications"], (old: Notification[] | undefined) =>
        old?.map(n => n.id === id ? { ...n, isRead: true } : n) || []
      );
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      setLocation(notification.link);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (authLoading) {
    return (
      <AppLayout hideNav>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppLayout hideNav>
        <div className="min-h-screen bg-gray-50">
          <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => window.history.back()}
                className="w-9 h-9 flex items-center justify-center"
                data-testid="back-button"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-lg font-bold">알림</h1>
              <button
                onClick={() => setLocation("/")}
                className="w-9 h-9 flex items-center justify-center"
                data-testid="home-button"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center py-16 bg-white">
            <Bell className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">로그인이 필요합니다</p>
            <Button onClick={() => setLocation("/mypage")} data-testid="login-button">로그인하기</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => window.history.back()}
              className="w-9 h-9 flex items-center justify-center"
              data-testid="back-button"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold">알림</h1>
            <button
              onClick={() => setLocation("/")}
              className="w-9 h-9 flex items-center justify-center"
              data-testid="home-button"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {unreadCount > 0 && (
          <div className="px-4 py-3 bg-white border-b border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              data-testid="mark-all-read-button"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              전체 확인 ({unreadCount}건)
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white">
            <Bell className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">알림이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left px-4 py-4 flex gap-3 transition-colors ${
                  notification.isRead ? "bg-white" : "bg-primary/5"
                } hover:bg-gray-50`}
                data-testid={`notification-item-${notification.id}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.isRead ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary"
                }`}>
                  {getNotificationIcon(notification.notificationType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium text-sm line-clamp-1 ${
                      notification.isRead ? "text-gray-700" : "text-gray-900"
                    }`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  {notification.content && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {notification.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
