import { useParams, useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const reviewImages = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
  "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400",
  "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400",
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
];

export default function ProductGalleryPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

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
          <p className="text-sm text-gray-500 mb-4">전체 {reviewImages.length}개</p>
          
          <div className="grid grid-cols-3 gap-1">
            {reviewImages.map((img, index) => (
              <div 
                key={index}
                className="aspect-square bg-gray-100 overflow-hidden"
                data-testid={`gallery-image-${index}`}
              >
                <img 
                  src={img} 
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
