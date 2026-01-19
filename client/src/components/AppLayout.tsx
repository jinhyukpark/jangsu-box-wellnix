import { ReactNode, useRef, createContext, useContext } from "react";
import { PromoSidebar } from "./PromoSidebar";
import { BottomNav } from "./BottomNav";

interface AppContainerContextType {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const AppContainerContext = createContext<AppContainerContextType | null>(null);

export function useAppContainer() {
  const context = useContext(AppContainerContext);
  if (!context) {
    throw new Error("useAppContainer must be used within AppLayout");
  }
  return context;
}

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AppContainerContext.Provider value={{ containerRef }}>
      <div className="min-h-screen bg-background flex justify-center">
        <PromoSidebar />
        
        <div ref={containerRef} className="w-full max-w-[430px] relative flex flex-col">
          <main className="bg-white shadow-xl min-h-screen relative flex-1 overflow-x-hidden">
            {children}
          </main>
          
          {!hideNav && (
            <div className="fixed bottom-0 w-full max-w-[430px] z-50">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </AppContainerContext.Provider>
  );
}