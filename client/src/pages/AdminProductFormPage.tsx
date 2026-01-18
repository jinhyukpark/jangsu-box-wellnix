import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { 
  ChevronLeft, Save, Eye, Image, Video, Link, Plus, Trash2, Star, 
  MessageSquare, X, Upload, Menu, Package, Users, Gift, Calendar, 
  CreditCard, Truck, HelpCircle, ShieldCheck, Settings, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

const menuItems = [
  { id: "products", label: "상품 관리", icon: Package },
  { id: "brands", label: "브랜드 관리", icon: Award },
  { id: "members", label: "회원 관리", icon: Users },
  { id: "subscription", label: "장수박스 관리", icon: Gift },
  { id: "events", label: "행사 관리", icon: Calendar },
  { id: "payments", label: "결제 관리", icon: CreditCard },
  { id: "shipping", label: "배송 관리", icon: Truck },
  { id: "inquiries", label: "1:1 문의", icon: MessageSquare },
  { id: "faq", label: "자주묻는질문", icon: HelpCircle },
  { id: "settings", label: "관리자 설정", icon: ShieldCheck },
  { id: "base-settings", label: "기준 정보 관리", icon: Settings },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      setProduct({
        ...defaultProduct,
        ...existingProduct,
        images: existingProduct.images || [],
      });
    }
  }, [existingProduct]);

  const saveMutation = useMutation({
    mutationFn: async (data: Product) => {
      const url = isEdit ? `/api/admin/products/${id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await apiRequest(method, url, data);
      return res;
    },
    onSuccess: () => {
      toast({ title: isEdit ? "상품이 수정되었습니다" : "상품이 등록되었습니다" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setLocation("/admin");
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
      setProduct({ ...product, images: [...product.images, newImageUrl.trim()] });
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-primary">웰닉스 관리자</h1>
          ) : (
            <span className="text-xl font-bold text-primary mx-auto">W</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setLocation("/admin")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.id === "products" 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLocation("/admin")} 
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
              <p className="text-sm text-gray-500 mb-4">이미지를 추가하고, 클릭하여 대표 이미지로 설정하세요. (대표 이미지는 파란 테두리로 표시됩니다)</p>
              <div className="flex gap-3 flex-wrap mb-4">
                {/* 대표 이미지 */}
                {product.image && (
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => {}}
                  >
                    <img 
                      src={product.image} 
                      alt="대표 이미지" 
                      className="w-24 h-24 object-cover rounded-lg ring-2 ring-primary ring-offset-2"
                    />
                    <span className="absolute -top-2 -left-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">대표</span>
                  </div>
                )}
                {/* 추가 이미지들 */}
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    className="relative cursor-pointer group"
                    onClick={() => {
                      // 클릭하면 대표 이미지로 설정
                      const newImages = product.images.filter((_, i) => i !== index);
                      if (product.image) {
                        newImages.unshift(product.image);
                      }
                      setProduct({ ...product, image: img, images: newImages });
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`추가 이미지 ${index + 1}`} 
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-primary transition-colors"
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="이미지 URL 입력"
                  className="flex-1"
                  data-testid="input-new-image"
                />
                <Button variant="outline" onClick={handleAddImage}>
                  <Plus className="w-4 h-4 mr-1" /> 이미지 추가
                </Button>
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
                  height={400}
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
                      </div>
                      <p className="text-gray-700 mb-3">{review.content}</p>
                      
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
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-primary">판매자 답변</span>
                            <span className="text-xs text-gray-400">
                              {review.adminReplyAt && new Date(review.adminReplyAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{review.adminReply}</p>
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">배송 정보</h3>
                <Textarea
                  value={product.shippingInfo || ""}
                  onChange={(e) => setProduct({ ...product, shippingInfo: e.target.value })}
                  placeholder="배송 안내 정보를 입력하세요"
                  rows={8}
                  data-testid="input-shipping-info"
                />
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
      </div>
    </div>
  );
}
