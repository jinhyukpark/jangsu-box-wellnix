import { ReactNode } from "react";
import { PromoSidebar } from "./PromoSidebar";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <div className="w-full max-w-[430px] relative">
        <main className="bg-white shadow-xl min-h-screen relative">
          {children}
        </main>
        
        {!hideNav && (
          <div className="fixed bottom-0 w-full max-w-[430px] z-50">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}