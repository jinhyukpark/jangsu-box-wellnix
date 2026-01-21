import { ReactNode, useRef, createContext, useContext, useEffect, useState } from "react";
import { PromoSidebar } from "./PromoSidebar";
import { BottomNav } from "./BottomNav";
import { Toaster as SonnerToaster } from "sonner";

interface AppContainerContextType {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const AppContainerContext = createContext<AppContainerContextType | null>(null);

export function useAppContainer() {
  const context = useContext(AppContainerContext);
  return context;
}

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerLeft, setContainerLeft] = useState(0);
  const [containerWidth, setContainerWidth] = useState(430);

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerLeft(rect.left);
        setContainerWidth(rect.width);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <AppContainerContext.Provider value={{ containerRef }}>
      <div className="min-h-screen bg-background flex justify-center">
        <PromoSidebar />

        {/* 웹앱 컨테이너 - 다이얼로그 포털의 타겟 */}
        <div
          ref={containerRef}
          className="w-full max-w-[430px] relative flex flex-col isolate"
        >
          <SonnerToaster
            position="top-center"
            containerAriaLabel="알림"
            toastOptions={{
              className: "!max-w-[380px]",
            }}
            style={{
              left: containerLeft + containerWidth / 2,
              transform: "translateX(-50%)",
            }}
          />
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