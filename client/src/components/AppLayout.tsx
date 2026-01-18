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
        <main className={`bg-white shadow-xl min-h-screen ${hideNav ? '' : 'pb-20'}`}>
          {children}
        </main>
        
        {!hideNav && (
          <div className="sticky bottom-0 w-full z-50">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}