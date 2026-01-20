import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminUIContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AdminUIContext = createContext<AdminUIContextType | undefined>(undefined);

export function AdminUIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <AdminUIContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </AdminUIContext.Provider>
  );
}

export function useAdminUI() {
  const context = useContext(AdminUIContext);
  if (!context) {
    throw new Error("useAdminUI must be used within AdminUIProvider");
  }
  return context;
}
