import { useRef, useEffect, useCallback } from "react";

export function useDragScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    e.preventDefault();
    isDragging.current = true;
    hasMoved.current = false;
    scrollRef.current.style.cursor = "grabbing";
    scrollRef.current.style.userSelect = "none";
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    hasMoved.current = true;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
      scrollRef.current.style.userSelect = "";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
      scrollRef.current.style.userSelect = "";
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.style.cursor = "grab";
      const images = el.querySelectorAll("img");
      images.forEach((img) => {
        img.draggable = false;
      });
    }
  }, []);

  return {
    scrollRef,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onWheel: handleWheel,
      onDragStart: handleDragStart,
    },
  };
}
