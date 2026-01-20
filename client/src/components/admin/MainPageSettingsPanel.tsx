import { useState, useEffect } from "react";
import { Star, Image, Link2, Package, Calendar, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMainPageSettings, useUpdateMainPageSettings, type MainPageSettings } from "@/hooks/use-admin";
import type { Product, Event as EventType } from "@shared/schema";

interface MainPageSettingsPanelProps {
  products: Product[];
  events: EventType[];
}

export function MainPageSettingsPanel({ products, events }: MainPageSettingsPanelProps) {
  const { toast } = useToast();
  const { data: settings, isLoading } = useMainPageSettings();
  const updateSettings = useUpdateMainPageSettings();

  const [localSettings, setLocalSettings] = useState<MainPageSettings>({
    bestProductsCriteria: "sales",
    bestProductsManualIds: [],
    bestProductsLimit: 6,
    adBannerImage: null,
    adBannerLink: null,
    adBannerEnabled: true,
    newProductsCriteria: "recent",
    newProductsManualIds: [],
    newProductsLimit: 6,
    newProductsDaysThreshold: 30,
    eventsCriteria: "active",
    eventsManualIds: [],
    eventsLimit: 4,
  });

  const [bestProductSearch, setBestProductSearch] = useState("");
  const [newProductSearch, setNewProductSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(localSettings);
      toast({ title: "저장 완료", description: "메인 페이지 설정이 저장되었습니다." });
    } catch {
      toast({ title: "저장 실패", description: "설정 저장 중 오류가 발생했습니다.", variant: "destructive" });
    }
  };

  const toggleProductSelection = (productId: number, field: "bestProductsManualIds" | "newProductsManualIds") => {
    const currentIds = localSettings[field] || [];
    if (currentIds.includes(productId)) {
      setLocalSettings({ ...localSettings, [field]: currentIds.filter(id => id !== productId) });
    } else {
      setLocalSettings({ ...localSettings, [field]: [...currentIds, productId] });
    }
  };

  const toggleEventSelection = (eventId: number) => {
    const currentIds = localSettings.eventsManualIds || [];
    if (currentIds.includes(eventId)) {
      setLocalSettings({ ...localSettings, eventsManualIds: currentIds.filter(id => id !== eventId) });
    } else {
      setLocalSettings({ ...localSettings, eventsManualIds: [...currentIds, eventId] });
    }
  };

  if (isLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">메인 페이지 설정</h2>
        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "저장중..." : "설정 저장"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* 베스트 상품 설정 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            베스트 상품 설정
          </h3>
          <div className="space-y-4">
            <div>
              <Label>선택 기준</Label>
              <Select
                value={localSettings.bestProductsCriteria}
                onValueChange={(v) => setLocalSettings({ ...localSettings, bestProductsCriteria: v as "sales" | "manual" })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">구매순 (자동)</SelectItem>
                  <SelectItem value="manual">직접 선택</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>표시 개수</Label>
              <Input
                type="number"
                value={localSettings.bestProductsLimit}
                onChange={(e) => setLocalSettings({ ...localSettings, bestProductsLimit: parseInt(e.target.value) || 6 })}
                className="mt-1"
              />
            </div>
            {localSettings.bestProductsCriteria === "manual" && (
              <div>
                <Label className="mb-2 block">상품 선택</Label>
                <Input
                  placeholder="상품명으로 검색..."
                  value={bestProductSearch}
                  onChange={(e) => setBestProductSearch(e.target.value)}
                  className="mb-2"
                />
                {localSettings.bestProductsManualIds?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {localSettings.bestProductsManualIds.map(id => {
                      const product = products?.find((p) => p.id === id);
                      return product ? (
                        <span key={id} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                          {product.name}
                          <button
                            onClick={() => toggleProductSelection(id, "bestProductsManualIds")}
                            className="hover:text-red-500"
                          >×</button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded p-2">
                  {products?.filter((p) =>
                    p.name.toLowerCase().includes(bestProductSearch.toLowerCase())
                  ).map((product) => (
                    <label key={product.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <Checkbox
                        checked={localSettings.bestProductsManualIds?.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id, "bestProductsManualIds")}
                      />
                      <span className="text-sm truncate">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 중간 광고 배너 설정 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-500" />
            중간 광고 배너 설정
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="adBannerEnabled"
                checked={localSettings.adBannerEnabled}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, adBannerEnabled: !!checked })}
              />
              <Label htmlFor="adBannerEnabled">광고 배너 활성화</Label>
            </div>
            <div>
              <Label>배너 이미지</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={localSettings.adBannerImage || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, adBannerImage: e.target.value })}
                  placeholder="이미지 URL 입력"
                  className="flex-1"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch("/api/admin/upload", {
                          method: "POST",
                          body: formData,
                          credentials: "include",
                        });
                        if (res.ok) {
                          const { url } = await res.json();
                          setLocalSettings({ ...localSettings, adBannerImage: url });
                        }
                      } catch (error) {
                        console.error("Upload failed:", error);
                      }
                    }}
                  />
                </label>
              </div>
              {localSettings.adBannerImage && (
                <div className="mt-2 relative w-full max-w-md h-40 bg-gray-100 rounded overflow-hidden">
                  <img src={localSettings.adBannerImage} alt="Banner preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Link2 className="w-4 h-4" />
                배너 링크 URL
              </Label>
              <Input
                value={localSettings.adBannerLink || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, adBannerLink: e.target.value })}
                placeholder="클릭 시 이동할 URL (예: /subscription)"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* 신상품 설정 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" />
            신상품 설정
          </h3>
          <div className="space-y-4">
            <div>
              <Label>선택 기준</Label>
              <Select
                value={localSettings.newProductsCriteria}
                onValueChange={(v) => setLocalSettings({ ...localSettings, newProductsCriteria: v as "recent" | "manual" })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">최근 등록순 (자동)</SelectItem>
                  <SelectItem value="manual">직접 선택</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>표시 개수</Label>
                <Input
                  type="number"
                  value={localSettings.newProductsLimit}
                  onChange={(e) => setLocalSettings({ ...localSettings, newProductsLimit: parseInt(e.target.value) || 6 })}
                  className="mt-1"
                />
              </div>
              {localSettings.newProductsCriteria === "recent" && (
                <div>
                  <Label>신상품 기준 (일)</Label>
                  <Input
                    type="number"
                    value={localSettings.newProductsDaysThreshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, newProductsDaysThreshold: parseInt(e.target.value) || 30 })}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            {localSettings.newProductsCriteria === "manual" && (
              <div>
                <Label className="mb-2 block">상품 선택</Label>
                <Input
                  placeholder="상품명으로 검색..."
                  value={newProductSearch}
                  onChange={(e) => setNewProductSearch(e.target.value)}
                  className="mb-2"
                />
                {localSettings.newProductsManualIds?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {localSettings.newProductsManualIds.map(id => {
                      const product = products?.find((p) => p.id === id);
                      return product ? (
                        <span key={id} className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          {product.name}
                          <button
                            onClick={() => toggleProductSelection(id, "newProductsManualIds")}
                            className="hover:text-red-500"
                          >×</button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded p-2">
                  {products?.filter((p) =>
                    p.name.toLowerCase().includes(newProductSearch.toLowerCase())
                  ).map((product) => (
                    <label key={product.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <Checkbox
                        checked={localSettings.newProductsManualIds?.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id, "newProductsManualIds")}
                      />
                      <span className="text-sm truncate">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 건강 행사 & 일정 설정 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            건강 행사 & 일정 설정
          </h3>
          <div className="space-y-4">
            <div>
              <Label>선택 기준</Label>
              <Select
                value={localSettings.eventsCriteria}
                onValueChange={(v) => setLocalSettings({ ...localSettings, eventsCriteria: v as "active" | "manual" })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성화된 행사만 (자동)</SelectItem>
                  <SelectItem value="manual">직접 선택</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>표시 개수</Label>
              <Input
                type="number"
                value={localSettings.eventsLimit}
                onChange={(e) => setLocalSettings({ ...localSettings, eventsLimit: parseInt(e.target.value) || 4 })}
                className="mt-1"
              />
            </div>
            {localSettings.eventsCriteria === "manual" && (
              <div>
                <Label className="mb-2 block">행사 선택</Label>
                <Input
                  placeholder="행사명으로 검색..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="mb-2"
                />
                {localSettings.eventsManualIds?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {localSettings.eventsManualIds.map(id => {
                      const event = events?.find((e) => e.id === id);
                      return event ? (
                        <span key={id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {event.title}
                          <button
                            onClick={() => toggleEventSelection(id)}
                            className="hover:text-red-500"
                          >×</button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-2">
                  {events?.filter((e) =>
                    e.title.toLowerCase().includes(eventSearch.toLowerCase())
                  ).map((event) => (
                    <label key={event.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <Checkbox
                        checked={localSettings.eventsManualIds?.includes(event.id)}
                        onCheckedChange={() => toggleEventSelection(event.id)}
                      />
                      <span className="text-sm truncate">{event.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
