import { useState, useRef, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  threshold?: number;
}

export function PullToRefresh({ 
  children, 
  onRefresh,
  threshold = 80 
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const getScrollTop = useCallback(() => {
    const root = document.getElementById("root");
    return root ? root.scrollTop : 0;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (getScrollTop() === 0) {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  }, [getScrollTop]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0 && getScrollTop() === 0) {
      e.preventDefault();
      const distance = Math.min(diff * 0.5, threshold * 1.5);
      setPullDistance(distance);
    }
  }, [isRefreshing, threshold, getScrollTop]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    root.addEventListener("touchstart", handleTouchStart, { passive: true });
    root.addEventListener("touchmove", handleTouchMove, { passive: false });
    root.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      root.removeEventListener("touchstart", handleTouchStart);
      root.removeEventListener("touchmove", handleTouchMove);
      root.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / threshold, 1);
  const showIndicator = pullDistance > 10;

  return (
    <>
      {showIndicator && (
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center items-center z-[9999] pointer-events-none"
          style={{ 
            height: `${pullDistance}px`,
            transition: isDragging.current ? "none" : "height 0.2s ease-out"
          }}
        >
          <div 
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            style={{
              transform: `rotate(${progress * 360}deg)`,
              opacity: progress
            }}
          >
            <Loader2 
              className={`w-5 h-5 text-primary ${isRefreshing ? "animate-spin" : ""}`}
            />
          </div>
        </div>
      )}
      <div 
        style={{ 
          transform: showIndicator ? `translateY(${pullDistance}px)` : "none",
          transition: isDragging.current ? "none" : "transform 0.2s ease-out"
        }}
      >
        {children}
      </div>
    </>
  );
}
