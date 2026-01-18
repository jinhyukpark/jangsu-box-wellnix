import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Play } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export default function ProductGalleryPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/products", id, "reviews"],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}/reviews`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!id,
  });

  const allMedia: { type: 'image' | 'video'; url: string }[] = reviews.flatMap((r: any) => [
    ...(r.images || []).map((url: string) => ({ type: 'image' as const, url })),
    ...(r.videos || []).map((url: string) => ({ type: 'video' as const, url })),
  ]);

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="flex items-center px-4 py-3">
            <button 
              onClick={() => setLocation(`/products/${id}`)} 
              className="p-1 mr-3"
              data-testid="button-back"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-base font-medium text-gray-900">포토 & 동영상 리뷰</h1>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">전체 {allMedia.length}개</p>
          
          <div className="grid grid-cols-3 gap-1">
            {allMedia.map((media, index) => (
              <div 
                key={index}
                className="aspect-square bg-gray-100 overflow-hidden relative"
                data-testid={`gallery-media-${index}`}
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                ) : (
                  <img 
                    src={media.url} 
                    alt={`리뷰 미디어 ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>

          {allMedia.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">등록된 포토/동영상이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
