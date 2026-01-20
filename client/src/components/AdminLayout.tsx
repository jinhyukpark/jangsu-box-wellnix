import { type ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminUI } from "@/contexts/AdminUIContext";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onNavigate?: (path: string) => void;
}

export function AdminLayout({ children, activeTab, onNavigate }: AdminLayoutProps) {
  const { sidebarOpen } = useAdminUI();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar activeTab={activeTab} onNavigate={onNavigate} />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
