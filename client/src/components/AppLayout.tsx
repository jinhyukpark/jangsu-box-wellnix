import { ReactNode } from "react";
import { PromoSidebar } from "./PromoSidebar";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <PromoSidebar />
      
      <main className="w-full max-w-[430px] bg-white shadow-xl relative">
        {children}
        
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}