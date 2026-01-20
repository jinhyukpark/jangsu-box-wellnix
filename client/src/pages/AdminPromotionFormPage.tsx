import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { AdminLayout } from "@/components/AdminLayout";
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

export default function AdminPromotionFormPage() {
  const [, setLocation] = useLocation();
  const [matchEdit, paramsEdit] = useRoute("/admin/promotions/:id");
  const [matchNew] = useRoute("/admin/promotions/new");
  const promotionId = matchEdit ? parseInt(paramsEdit?.id || "0") : null;
  const isEditing = !!promotionId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const [promotionForm, setPromotionForm] = useState({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    period: "",
    heroImage: "",
    isActive: true,
  });

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productSearch, setProductSearch] = useState("");

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      const imageUrl = response.publicUrl;
      setPromotionForm({ ...promotionForm, heroImage: imageUrl });
      toast({ title: "이미지가 업로드되었습니다" });
    },
    onError: (error) => {
      toast({ title: "업로드 실패", description: error.message, variant: "destructive" });
    },
  });

  const { data: existingPromotion, isLoading: promotionLoading } = useQuery<any>({
    queryKey: ["/api/promotions", promotionId],
    queryFn: async () => {
      const res = await fetch(`/api/promotions/${promotionId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch promotion");
      return res.json();
    },
    enabled: isEditing,
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  useEffect(() => {
    if (existingPromotion) {
      const newForm = {
        slug: existingPromotion.slug || "",
        title: existingPromotion.title || "",
        subtitle: existingPromotion.subtitle || "",
        description: existingPromotion.description || "",
        period: existingPromotion.period || "",
        heroImage: existingPromotion.heroImage || "",
        isActive: existingPromotion.isActive !== false,
      };
      setPromotionForm(newForm);
      setSelectedProducts(existingPromotion.products?.map((p: any) => p.id) || []);
      initialFormRef.current = JSON.stringify({ form: newForm, products: existingPromotion.products?.map((p: any) => p.id) || [] });
    }
  }, [existingPromotion]);

  useEffect(() => {
    if (initialFormRef.current) {
      const currentStr = JSON.stringify({ form: promotionForm, products: selectedProducts });
      setHasUnsavedChanges(currentStr !== initialFormRef.current);
    } else if (promotionForm.title) {
      setHasUnsavedChanges(true);
    }
  }, [promotionForm, selectedProducts]);

  const createPromotionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create promotion");
      return res.json();
    },
  });

  const updatePromotionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update promotion");
      return res.json();
    },
  });

  const updateProductsMutation = useMutation({
    mutationFn: async ({ id, productIds }: { id: number; productIds: number[] }) => {
      const res = await fetch(`/api/admin/promotions/${id}/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update products");
      return res.json();
    },
  });

  const handleSave = async () => {
    if (!promotionForm.title.trim()) {
      toast({ variant: "destructive", title: "입력 오류", description: "이벤트명을 입력해주세요." });
      return;
    }

    const slug = promotionForm.slug.trim() || promotionForm.title.toLowerCase().replace(/[^a-z0-9가-힣]/gi, '-').replace(/-+/g, '-');
    const payload = { ...promotionForm, slug };

    try {
      if (isEditing) {
        await updatePromotionMutation.mutateAsync(payload);
        await updateProductsMutation.mutateAsync({ id: promotionId!, productIds: selectedProducts });
        queryClient.invalidateQueries({ queryKey: ["promotions"] });
        queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
        toast({ title: "이벤트가 수정되었습니다." });
      } else {
        const created = await createPromotionMutation.mutateAsync(payload);
        if (created?.id) {
          await updateProductsMutation.mutateAsync({ id: created.id, productIds: selectedProducts });
        }
        queryClient.invalidateQueries({ queryKey: ["promotions"] });
        queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
        toast({ title: "이벤트가 등록되었습니다." });
      }
      setLocation("/admin?tab=promotions");
    } catch (error) {
      toast({ variant: "destructive", title: "저장 실패", description: "다시 시도해주세요." });
    }
  };

  const toggleProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (isEditing && promotionLoading) {
    return (
      <AdminLayout activeTab="promotions" onNavigate={handleNavigate}>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">로딩중...</p>
        </div>
      </AdminLayout>
    );
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
    e.target.value = "";
  };

  return (
    <AdminLayout activeTab="promotions" onNavigate={handleNavigate}>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => handleNavigate("/admin?tab=promotions")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {isEditing ? "이벤트 수정" : "새 이벤트 등록"}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>이벤트명 *</Label>
              <Input
                value={promotionForm.title}
                onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
                placeholder="2026 설 선물세트"
                className="mt-1"
              />
            </div>
            <div>
              <Label>슬러그 (URL)</Label>
              <Input
                value={promotionForm.slug}
                onChange={(e) => setPromotionForm({ ...promotionForm, slug: e.target.value })}
                placeholder="seol-gift"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">비워두면 이벤트명을 기반으로 자동 생성됩니다.</p>
            </div>
          </div>

          <div>
            <Label>부제목</Label>
            <Input
              value={promotionForm.subtitle}
              onChange={(e) => setPromotionForm({ ...promotionForm, subtitle: e.target.value })}
              placeholder="새해 첫 선물로, 특별함과 다양함을 담은 세트를 추천해요."
              className="mt-1"
            />
          </div>

          <div>
            <Label>기간</Label>
            <Input
              value={promotionForm.period}
              onChange={(e) => setPromotionForm({ ...promotionForm, period: e.target.value })}
              placeholder="1. 12(월) ~ 2. 27(목)"
              className="mt-1"
            />
          </div>

          <div>
            <Label>히어로 이미지</Label>
            <div className="mt-2">
              {promotionForm.heroImage ? (
                <div className="relative">
                  <img src={promotionForm.heroImage} alt="Hero preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setPromotionForm({ ...promotionForm, heroImage: "" })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">{isUploading ? "업로드중..." : "이미지 업로드"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
            <div className="mt-2">
              <Input
                value={promotionForm.heroImage}
                onChange={(e) => setPromotionForm({ ...promotionForm, heroImage: e.target.value })}
                placeholder="또는 이미지 URL 직접 입력"
              />
            </div>
          </div>

          <div>
            <Label>설명</Label>
            <textarea
              value={promotionForm.description}
              onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
              placeholder="이벤트 상세 설명"
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary min-h-[120px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="promotionActive"
              checked={promotionForm.isActive}
              onCheckedChange={(checked) => setPromotionForm({ ...promotionForm, isActive: !!checked })}
            />
            <Label htmlFor="promotionActive">활성화</Label>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-bold">상품 선택</Label>
            <p className="text-sm text-gray-500 mb-3">이벤트에 포함할 상품을 선택하세요.</p>

            <Input
              placeholder="상품명으로 검색..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="mb-3"
            />

            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProducts.map(id => {
                  const product = products?.find((p: any) => p.id === id);
                  return product ? (
                    <span key={id} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full">
                      {product.name}
                      <button onClick={() => toggleProduct(id)} className="hover:text-red-500 ml-1">×</button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
              {filteredProducts.map((product: any) => (
                <label key={product.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {product.image && (
                      <img src={product.image} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    <span className="text-sm truncate">{product.name}</span>
                  </div>
                </label>
              ))}
              {filteredProducts.length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-4">검색 결과가 없습니다.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => handleNavigate("/admin?tab=promotions")}>취소</Button>
            <Button
              onClick={handleSave}
              disabled={createPromotionMutation.isPending || updatePromotionMutation.isPending}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {(createPromotionMutation.isPending || updatePromotionMutation.isPending) ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </main>

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
