import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import {
  ChevronLeft, Save, Eye, Image, Video, Link, Plus, Trash2, Star,
  MessageSquare, Upload, MoreHorizontal, Pencil, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useUpload } from "@/hooks/use-upload";

interface Product {
  id?: number;
  name: string;
  shortDescription: string;
  description: string;
  descriptionMarkdown: string;
  categoryId: number | null;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  stock: number;
  status: string;
  isFeatured: boolean;
  origin: string;
  manufacturer: string;
  expirationInfo: string;
  storageMethod: string;
  shippingInfo: string;
  refundInfo: string;
  dawnDeliveryEnabled: boolean;
  dawnDeliveryDays: number;
  regularDeliveryEnabled: boolean;
  regularDeliveryDays: number;
}

interface Review {
  id: number;
  memberId: number;
  memberName?: string;
  rating: number;
  content: string;
  images: string[];
  videos: string[];
  adminReply: string | null;
  adminReplyAt: string | null;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const defaultProduct: Product = {
  name: "",
  shortDescription: "",
  description: "",
  descriptionMarkdown: "",
  categoryId: null,
  price: 0,
  originalPrice: null,
  image: "",
  images: [],
  stock: 0,
  status: "active",
  isFeatured: false,
  origin: "국내산",
  manufacturer: "웰닉스(주)",
  expirationInfo: "별도 표시",
  storageMethod: "직사광선을 피해 서늘한 곳에 보관",
  shippingInfo: `• 기본 배송비는 3,500원이에요.
• 70,000원 이상 구매 시 무료 배송해 드려요.
• 평일 오후 2시 이전 결제 완료 시 당일 출고됩니다.
• 새벽 배송: 서울 전체 지역과 일부 시군구 지역에서 이용 가능해요.`,
  refundInfo: `• 제품에 문제가 있는 경우, 상품 수령일로부터 2일 이내에 사진과 함께 고객센터로 접수해 주세요.
• 신선식품 특성상 단순 변심으로 인한 교환 및 환불은 어려우니 양해 부탁드려요.
• 일반 제품은 미개봉 상태로 7일 이내 반품 가능합니다.`,
};

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!id && id !== "new";

  const [product, setProduct] = useState<Product>(defaultProduct);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [replyingReviewId, setReplyingReviewId] = useState<number | null>(null);
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewContent, setEditReviewContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const initialFormRef = useRef<string>("");

  const handleNavigate = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
    } else {
      setLocation(path);
    }
  };

  const confirmNavigation = () => {
    if (pendingNavigation) {
      setLocation(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      const imageUrl = response.publicUrl;
      if (!product.image) {
        setProduct({ ...product, image: imageUrl });
      } else {
        setProduct({ ...product, images: [...product.images, imageUrl] });
      }
      toast({ title: "이미지가 업로드되었습니다" });
    },
    onError: (error) => {
      toast({ title: "업로드 실패", description: error.message, variant: "destructive" });
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: existingProduct } = useQuery({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("상품을 불러올 수 없습니다");
      return res.json();
    },
    enabled: isEdit,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/products", id, "reviews"],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}/reviews`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingProduct) {
      const newProduct = {
        ...defaultProduct,
        ...existingProduct,
        images: existingProduct.images || [],
      };
      setProduct(newProduct);
      initialFormRef.current = JSON.stringify(newProduct);
    }
  }, [existingProduct]);

  useEffect(() => {
    if (initialFormRef.current) {
      const currentProductStr = JSON.stringify(product);
      setHasUnsavedChanges(currentProductStr !== initialFormRef.current);
    } else if (product.name) {
      setHasUnsavedChanges(true);
    }
  }, [product]);

  const saveMutation = useMutation({
    mutationFn: async (data: Product) => {
      const url = isEdit ? `/api/admin/products/${id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await apiRequest(method, url, data);
      return res;
    },
    onSuccess: (response) => {
      toast({ title: isEdit ? "상품이 수정되었습니다" : "상품이 등록되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      if (!isEdit && response?.id) {
        setLocation(`/admin/products/${response.id}`);
      }
    },
    onError: (error: any) => {
      toast({ title: "오류가 발생했습니다", description: error.message, variant: "destructive" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: number; reply: string }) => {
      const res = await apiRequest("POST", `/api/admin/reviews/${reviewId}/reply`, { reply });
      return res;
    },
    onSuccess: (_, variables) => {
      toast({ title: "답변이 등록되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
      setReplyingReviewId(null);
      setReplyContents(prev => {
        const updated = { ...prev };
        delete updated[variables.reviewId];
        return updated;
      });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, content }: { reviewId: number; content: string }) => {
      const res = await apiRequest("PUT", `/api/admin/reviews/${reviewId}`, { content });
      return res;
    },
    onSuccess: () => {
      toast({ title: "리뷰가 수정되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
      setEditingReviewId(null);
      setEditReviewContent("");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/reviews/${reviewId}`);
      return res;
    },
    onSuccess: () => {
      toast({ title: "리뷰가 삭제되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
    },
  });

  const updateReplyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: number; reply: string }) => {
      const res = await apiRequest("PUT", `/api/admin/reviews/${reviewId}/reply`, { reply });
      return res;
    },
    onSuccess: () => {
      toast({ title: "답변이 수정되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
      setEditingReplyId(null);
      setEditReplyContent("");
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/reviews/${reviewId}/reply`);
      return res;
    },
    onSuccess: () => {
      toast({ title: "답변이 삭제되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
    },
  });

  const handleSave = () => {
    if (!product.name) {
      toast({ title: "상품명을 입력해주세요", variant: "destructive" });
      return;
    }
    if (!product.price || product.price <= 0) {
      toast({ title: "가격을 입력해주세요", variant: "destructive" });
      return;
    }
    saveMutation.mutate(product);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const trimmedUrl = newImageUrl.trim();
      if (!product.image) {
        setProduct({ ...product, image: trimmedUrl });
      } else {
        setProduct({ ...product, images: [...product.images, trimmedUrl] });
      }
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setProduct({ ...product, images: product.images.filter((_, i) => i !== index) });
  };

  const handleReplySubmit = (reviewId: number) => {
    const content = replyContents[reviewId];
    if (content?.trim()) {
      replyMutation.mutate({ reviewId, reply: content });
    }
  };

  return (
    <AdminLayout activeTab="products" onNavigate={handleNavigate}>
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleNavigate("/admin?tab=products")} 
                className="p-2 hover:bg-gray-100 rounded-lg"
                data-testid="button-back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">
                {isEdit ? "상품 수정" : "상품 등록"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => window.open(`/products/${id}`, "_blank")} disabled={!isEdit}>
                <Eye className="w-4 h-4 mr-2" />
                미리보기
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-primary">
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? "저장중..." : "저장"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-white border border-gray-200 rounded-lg h-12 p-1 mb-6">
            <TabsTrigger value="description" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              상품 설명
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              상품 리뷰 ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="info" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              상품 정보
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-6">
            {/* 이미지 섹션 - 상단 1열 배치 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">상품 이미지</h3>
              <p className="text-sm text-gray-500 mb-4">
                드래그하여 순서를 변경하고, 체크박스로 대표 이미지를 선택하세요.
                <br /><span className="text-primary">(대표 이미지는 파란 테두리로 표시됩니다)</span>
                <br /><span className="text-gray-400">권장 이미지 사이즈: 800 x 800px (정사각형, 1:1 비율)</span>
              </p>
              <div className="flex gap-4 flex-wrap mb-4">
                {(() => {
                  const allImages = product.image ? [product.image, ...product.images] : [...product.images];
                  const primaryImage = product.image || '';
                  return allImages.map((img, index) => {
                    const isPrimary = img === primaryImage && primaryImage !== '';
                    return (
                      <div 
                        key={`img-${index}`}
                        className="relative group"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', index.toString());
                          e.currentTarget.classList.add('opacity-50', 'scale-95');
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.classList.remove('opacity-50', 'scale-95');
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('ring-2', 'ring-blue-400');
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('ring-2', 'ring-blue-400');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('ring-2', 'ring-blue-400');
                          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                          const toIndex = index;
                          if (fromIndex !== toIndex) {
                            const newAllImages = [...allImages];
                            const [movedImage] = newAllImages.splice(fromIndex, 1);
                            newAllImages.splice(toIndex, 0, movedImage);
                            const newPrimary = newAllImages.includes(primaryImage) ? primaryImage : newAllImages[0] || '';
                            setProduct({ 
                              ...product, 
                              image: newPrimary, 
                              images: newAllImages.filter(i => i !== newPrimary)
                            });
                          }
                        }}
                      >
                        <div className="cursor-move">
                          <img 
                            src={img} 
                            alt={isPrimary ? "대표 이미지" : `이미지 ${index + 1}`} 
                            className={`w-24 h-24 object-cover rounded-lg transition-all ${
                              isPrimary 
                                ? 'ring-2 ring-primary ring-offset-2' 
                                : 'border-2 border-gray-200'
                            }`}
                          />
                        </div>
                        {isPrimary && (
                          <span className="absolute -top-2 -left-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full z-10">대표</span>
                        )}
                        <button 
                          onClick={() => {
                            const newAllImages = allImages.filter((_, i) => i !== index);
                            const newPrimary = isPrimary ? (newAllImages[0] || '') : primaryImage;
                            setProduct({ 
                              ...product, 
                              image: newPrimary, 
                              images: newAllImages.filter(i => i !== newPrimary)
                            });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="삭제"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </span>
                        <label className="absolute bottom-1 left-1 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded cursor-pointer">
                          <input 
                            type="radio"
                            name="primaryImage"
                            checked={isPrimary}
                            onChange={() => {
                              setProduct({ 
                                ...product, 
                                image: img, 
                                images: allImages.filter(i => i !== img)
                              });
                            }}
                            className="w-3 h-3 accent-primary"
                          />
                          <span className="text-xs text-gray-700">대표</span>
                        </label>
                      </div>
                    );
                  });
                })()}
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="이미지 URL 입력"
                  className="flex-1"
                  data-testid="input-new-image"
                />
                <Button variant="outline" onClick={handleAddImage}>
                  <Plus className="w-4 h-4 mr-1" /> URL 추가
                </Button>
                <span className="text-gray-400">또는</span>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadFile(file);
                        e.target.value = '';
                      }
                    }}
                    disabled={isUploading}
                  />
                  <Button variant="default" type="button" disabled={isUploading} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-1" />
                      {isUploading ? "업로드 중..." : "파일 업로드"}
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">기본 정보</h3>
              <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">상품명 *</Label>
                      <Input
                        id="name"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        placeholder="상품명을 입력하세요"
                        data-testid="input-product-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">설명</Label>
                      <Textarea
                        id="description"
                        value={product.description || ""}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        placeholder="상품에 대한 상세 설명을 입력하세요"
                        rows={3}
                        data-testid="input-description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shortDescription">짧은 설명</Label>
                      <Input
                        id="shortDescription"
                        value={product.shortDescription || ""}
                        onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                        placeholder="상품 리스트에 표시될 짧은 설명"
                        data-testid="input-short-description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">판매가 *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={product.price || ""}
                          onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          data-testid="input-price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">정가 (할인 전)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={product.originalPrice || ""}
                          onChange={(e) => setProduct({ ...product, originalPrice: parseInt(e.target.value) || null })}
                          placeholder="할인 전 가격"
                          data-testid="input-original-price"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">카테고리</Label>
                        <Select
                          value={product.categoryId?.toString() || ""}
                          onValueChange={(value) => setProduct({ ...product, categoryId: parseInt(value) })}
                        >
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stock">재고</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={product.stock || ""}
                          onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          data-testid="input-stock"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">상태</Label>
                        <Select
                          value={product.status}
                          onValueChange={(value) => setProduct({ ...product, status: value })}
                        >
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">판매중</SelectItem>
                            <SelectItem value="inactive">판매중지</SelectItem>
                            <SelectItem value="soldout">품절</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          id="isFeatured"
                          checked={product.isFeatured}
                          onCheckedChange={(checked) => setProduct({ ...product, isFeatured: checked })}
                        />
                        <Label htmlFor="isFeatured">추천 상품으로 설정</Label>
                      </div>
                </div>
              </div>
            </div>

            {/* 배송 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">배송 설정</h3>
              <p className="text-sm text-gray-500 mb-4">
                상품의 배송 옵션을 설정합니다. 배송 가능일은 주문일 기준으로 계산됩니다.
              </p>
              <div className="space-y-4">
                {/* 새벽 배송 */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <Switch
                      id="dawnDeliveryEnabled"
                      checked={product.dawnDeliveryEnabled || false}
                      onCheckedChange={(checked) => setProduct({ ...product, dawnDeliveryEnabled: checked })}
                    />
                    <Label htmlFor="dawnDeliveryEnabled" className="flex items-center gap-1">
                      <span>🌙</span> 새벽 배송
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Label className="text-sm text-gray-600 whitespace-nowrap">주문일 +</Label>
                    <Select
                      value={(product.dawnDeliveryDays || 2).toString()}
                      onValueChange={(value) => setProduct({ ...product, dawnDeliveryDays: parseInt(value) })}
                      disabled={!product.dawnDeliveryEnabled}
                    >
                      <SelectTrigger className="w-20" data-testid="select-dawn-delivery-days">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">일 후 배송 가능</span>
                  </div>
                </div>

                {/* 일반 배송 */}
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <Switch
                      id="regularDeliveryEnabled"
                      checked={product.regularDeliveryEnabled !== false}
                      onCheckedChange={(checked) => setProduct({ ...product, regularDeliveryEnabled: checked })}
                    />
                    <Label htmlFor="regularDeliveryEnabled" className="flex items-center gap-1">
                      <span>🚚</span> 일반 배송
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Label className="text-sm text-gray-600 whitespace-nowrap">주문일 +</Label>
                    <Select
                      value={(product.regularDeliveryDays || 3).toString()}
                      onValueChange={(value) => setProduct({ ...product, regularDeliveryDays: parseInt(value) })}
                      disabled={product.regularDeliveryEnabled === false}
                    >
                      <SelectTrigger className="w-20" data-testid="select-regular-delivery-days">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">일 후 배송 가능</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">상품 상세 설명 (마크다운)</h3>
              <p className="text-sm text-gray-500 mb-4">
                이미지, 동영상, 링크를 포함한 상세 설명을 작성하세요. 마크다운 문법을 지원합니다.
              </p>
              <div className="mb-3 flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => {
                  const url = prompt("이미지 URL을 입력하세요:");
                  if (url) {
                    setProduct({
                      ...product,
                      descriptionMarkdown: (product.descriptionMarkdown || "") + `\n\n![이미지 설명](${url})\n`
                    });
                  }
                }}>
                  <Image className="w-4 h-4 mr-1" /> 이미지 추가
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const url = prompt("동영상 URL을 입력하세요 (YouTube 등):");
                  if (url) {
                    setProduct({
                      ...product,
                      descriptionMarkdown: (product.descriptionMarkdown || "") + `\n\n<video src="${url}" controls width="100%"></video>\n`
                    });
                  }
                }}>
                  <Video className="w-4 h-4 mr-1" /> 동영상 추가
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const url = prompt("링크 URL을 입력하세요:");
                  const text = prompt("링크 텍스트를 입력하세요:");
                  if (url && text) {
                    setProduct({
                      ...product,
                      descriptionMarkdown: (product.descriptionMarkdown || "") + `\n[${text}](${url})\n`
                    });
                  }
                }}>
                  <Link className="w-4 h-4 mr-1" /> 링크 추가
                </Button>
              </div>
              <div data-color-mode="light">
                <MDEditor
                  value={product.descriptionMarkdown || ""}
                  onChange={(value) => setProduct({ ...product, descriptionMarkdown: value || "" })}
                  height={1200}
                  preview="live"
                  data-testid="markdown-editor"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">상품 리뷰 관리</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">등록된 리뷰가 없습니다</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{review.memberName || "회원"}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setEditingReviewId(review.id);
                              setEditReviewContent(review.content);
                            }}>
                              <Pencil className="w-4 h-4 mr-2" /> 수정
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                if (confirm("리뷰를 삭제하시겠습니까?")) {
                                  deleteReviewMutation.mutate(review.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {editingReviewId === review.id ? (
                        <div className="space-y-2 mb-3">
                          <Textarea
                            value={editReviewContent}
                            onChange={(e) => setEditReviewContent(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => updateReviewMutation.mutate({ reviewId: review.id, content: editReviewContent })}
                              disabled={updateReviewMutation.isPending}
                            >
                              {updateReviewMutation.isPending ? "수정중..." : "수정 완료"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingReviewId(null)}>
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 mb-3">{review.content}</p>
                      )}
                      
                      {(review.images?.length > 0 || review.videos?.length > 0) && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {review.images?.map((img, idx) => (
                            <img key={idx} src={img} alt="" className="w-16 h-16 object-cover rounded" />
                          ))}
                          {review.videos?.map((_, idx) => (
                            <div key={idx} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <Video className="w-6 h-6 text-gray-500" />
                            </div>
                          ))}
                        </div>
                      )}

                      {review.adminReply ? (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-primary">판매자 답변</span>
                              <span className="text-xs text-gray-400">
                                {review.adminReplyAt && new Date(review.adminReplyAt).toLocaleDateString()}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setEditingReplyId(review.id);
                                  setEditReplyContent(review.adminReply || "");
                                }}>
                                  <Pencil className="w-4 h-4 mr-2" /> 수정
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => {
                                    if (confirm("답변을 삭제하시겠습니까?")) {
                                      deleteReplyMutation.mutate(review.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> 삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {editingReplyId === review.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editReplyContent}
                                onChange={(e) => setEditReplyContent(e.target.value)}
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => updateReplyMutation.mutate({ reviewId: review.id, reply: editReplyContent })}
                                  disabled={updateReplyMutation.isPending}
                                >
                                  {updateReplyMutation.isPending ? "수정중..." : "수정 완료"}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingReplyId(null)}>
                                  취소
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">{review.adminReply}</p>
                          )}
                        </div>
                      ) : replyingReviewId === review.id ? (
                        <div className="mt-3 space-y-2">
                          <Textarea
                            value={replyContents[review.id] || ""}
                            onChange={(e) => setReplyContents(prev => ({ ...prev, [review.id]: e.target.value }))}
                            placeholder="답변을 입력하세요"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleReplySubmit(review.id)}
                              disabled={replyMutation.isPending}
                            >
                              {replyMutation.isPending ? "등록중..." : "답변 등록"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setReplyingReviewId(null)}
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-3"
                          onClick={() => setReplyingReviewId(review.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          답변 작성
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">상품 필수 정보</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="origin">원산지</Label>
                    <Input
                      id="origin"
                      value={product.origin || ""}
                      onChange={(e) => setProduct({ ...product, origin: e.target.value })}
                      placeholder="국내산"
                      data-testid="input-origin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">제조사</Label>
                    <Input
                      id="manufacturer"
                      value={product.manufacturer || ""}
                      onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
                      placeholder="웰닉스(주)"
                      data-testid="input-manufacturer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expirationInfo">소비기한</Label>
                    <Input
                      id="expirationInfo"
                      value={product.expirationInfo || ""}
                      onChange={(e) => setProduct({ ...product, expirationInfo: e.target.value })}
                      placeholder="별도 표시"
                      data-testid="input-expiration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storageMethod">보관방법</Label>
                    <Textarea
                      id="storageMethod"
                      value={product.storageMethod || ""}
                      onChange={(e) => setProduct({ ...product, storageMethod: e.target.value })}
                      placeholder="보관 방법을 입력하세요"
                      rows={2}
                      data-testid="input-storage"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">배송비 설정</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingCost">기본 배송비 (원)</Label>
                      <Input
                        id="shippingCost"
                        type="number"
                        placeholder="3500"
                        defaultValue="3500"
                        data-testid="input-shipping-cost"
                      />
                    </div>
                    <div>
                      <Label htmlFor="freeShippingThreshold">무료 배송 기준 (원)</Label>
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        placeholder="70000"
                        defaultValue="70000"
                        data-testid="input-free-shipping"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="dawnDelivery" defaultChecked data-testid="switch-dawn-delivery" />
                      <Label htmlFor="dawnDelivery">새벽 배송 가능</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="regularDelivery" defaultChecked data-testid="switch-regular-delivery" />
                      <Label htmlFor="regularDelivery">일반 배송 가능</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deliveryNote">배송 안내 문구</Label>
                    <Input
                      id="deliveryNote"
                      placeholder="~2월 4일 배송일 선택 가능"
                      defaultValue="~2월 4일 배송일 선택 가능"
                      data-testid="input-delivery-note"
                    />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Label htmlFor="shippingInfo">상세 배송 안내 (사용자에게 표시)</Label>
                  <Textarea
                    id="shippingInfo"
                    value={product.shippingInfo || ""}
                    onChange={(e) => setProduct({ ...product, shippingInfo: e.target.value })}
                    placeholder="배송 안내 정보를 입력하세요"
                    rows={4}
                    className="mt-2"
                    data-testid="input-shipping-info"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">교환 및 환불 정보</h3>
                <Textarea
                  value={product.refundInfo || ""}
                  onChange={(e) => setProduct({ ...product, refundInfo: e.target.value })}
                  placeholder="교환 및 환불 안내 정보를 입력하세요"
                  rows={6}
                  data-testid="input-refund-info"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>

      <AlertDialog open={!!pendingNavigation} onOpenChange={() => setPendingNavigation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>저장되지 않은 변경사항</AlertDialogTitle>
            <AlertDialogDescription>
              저장되지 않은 변경사항이 있습니다. 이동하시면 변경사항이 모두 사라집니다. 그래도 이동하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigation}>이동</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
