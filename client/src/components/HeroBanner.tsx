import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: brandingData = [] } = useQuery({
    queryKey: ["/api/branding"],
    queryFn: async () => {
      const res = await fetch("/api/branding");
      return res.json();
    },
  });
  
  const heroItem = brandingData.find((item: any) => item.key === "hero" && item.isActive);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % 1);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + 1) % 1);
  };

  if (!heroItem || !heroItem.image) {
    return null;
  }

  const content = (
    <div 
      className="relative min-h-[280px] transition-all duration-500"
      data-testid="hero-banner"
    >
      <img 
        src={heroItem.image} 
        alt="프로모션 이미지"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      {heroItem.linkUrl ? (
        <Link href={heroItem.linkUrl}>
          <a className="block cursor-pointer">{content}</a>
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
