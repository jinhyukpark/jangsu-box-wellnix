import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight, Search, Bell, X,
  TrendingUp, ShoppingBag, UserCheck, Clock, Loader2, ShieldX,
  ArrowUpDown, ArrowUp, ArrowDown, GripVertical, Upload,
  Award, Gift, HelpCircle
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { adminMenuItems } from "@/lib/adminMenu";
import { images } from "@/lib/images";

const categoryImageMap: Record<string, string> = {
  "hongsam": images.koreanRedGinsengRoots,
  "blood-pressure": images.heartHealthSupplements,
  "supplements": images.vitaminSupplementsPills,
  "fruit-gift": images.freshFruitGiftBasket,
  "cosmetics": images.luxuryCosmeticsSkincareSet,
  "sleep-health": images.sleepHealthSupplements,
  "tea-drinks": images.koreanTeaSet,
  "joint-health": images.jointHealthSupplements,
  "pets": images.cuteDogAndCatTogether,
  "living-goods": images.dailyToiletriesProducts,
};
import { useAdminProducts, useAdminCategories, useAdminMembers, useAdminSubscriptions, useAdminSubscriptionPlans, useAdminEvents, useAdminInquiries, useAdminFaqs, useAdminList, useDashboardStats, useCreateProduct, useUpdateProduct, useCreateCategory, useUpdateCategory, useDeleteCategory, useCreateFaq, useUpdateFaq, useDeleteFaq, useCreateSubscriptionPlan, useUpdateSubscriptionPlan, useDeleteSubscriptionPlan, useReorderSubscriptionPlans, useDeleteEvent } from "@/hooks/use-admin";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import type { Product, Category, Event as EventType, SubscriptionPlan, Member, Faq, Promotion } from "@shared/schema";
import { MainPageSettingsPanel } from "@/components/admin/MainPageSettingsPanel";

// ============================================================================
// Types
// ============================================================================

interface ProductFormData {
  name: string;
  categoryId: number;
  price: number;
  originalPrice: number;
  stock: number;
  status: string;
  description: string;
  image: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  image: string;
}

interface FaqFormData {
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
  displayOrder: number;
}

interface PlanFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

interface BrandingData {
  key: string;
  title?: string | null;
  subtitle?: string | null;
  image?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

// ============================================================================
// Admin Cart Content Component
// ============================================================================

interface CartItemData {
  id: number;
  memberId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  memberName: string | null;
  memberEmail: string | null;
  productName: string | null;
  productPrice: number | null;
  productImage: string | null;
}

interface CartStats {
  memberId: number;
  memberName: string | null;
  memberEmail: string | null;
  cartItemCount: number;
  cartTotalAmount: number;
}

function AdminCartContent() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState<"items" | "stats">("stats");

  const { data: cartItems = [], isLoading: itemsLoading, refetch: refetchItems } = useQuery<CartItemData[]>({
    queryKey: ["admin", "cart", startDate, endDate],
    queryFn: async () => {
      let url = "/api/admin/cart";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart items");
      return res.json();
    },
  });

  const { data: cartStats = [], isLoading: statsLoading } = useQuery<CartStats[]>({
    queryKey: ["admin", "cart", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cart/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart stats");
      return res.json();
    },
  });

  const handleSearch = () => {
    refetchItems();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return `${price.toLocaleString()}원`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">장바구니 관리</h2>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "items" | "stats")} className="mb-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="stats" className="data-[state=active]:bg-white">회원별 통계</TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-white">장바구니 상품 목록</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-4">
          {statsLoading ? (
            <div className="text-center py-8 text-gray-500">로딩중...</div>
          ) : cartStats.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              장바구니에 상품이 없습니다.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이메일</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">장바구니 상품 수</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">예상 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {cartStats.map((stat) => (
                    <tr key={stat.memberId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {stat.memberName || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {stat.memberEmail || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                          {stat.cartItemCount}개
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {formatPrice(stat.cartTotalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="items" className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">시작일:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">종료일:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button onClick={handleSearch} className="bg-primary text-white">
              검색
            </Button>
          </div>

          {itemsLoading ? (
            <div className="text-center py-8 text-gray-500">로딩중...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              장바구니에 상품이 없습니다.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상품</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">수량</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">가격</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">추가일</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.productImage && (
                            <img 
                              src={item.productImage} 
                              alt={item.productName || ""} 
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {item.productName || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.memberName || "-"}</p>
                          <p className="text-xs text-gray-500">{item.memberEmail || "-"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {item.quantity}개
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {formatPrice(item.productPrice)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// Admin Notifications Content
// ============================================================================

function AdminNotificationsContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [targetType, setTargetType] = useState<"all" | "purchased" | "not_purchased" | "select">("all");
  const [channels, setChannels] = useState({ email: false, sms: false, app: true });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  const { data: members = [] } = useQuery<{ id: number; name: string; email: string; }[]>({
    queryKey: ["admin", "members-simple"],
    queryFn: async () => {
      const res = await fetch("/api/admin/members", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleToggleMember = (id: number) => {
    setSelectedMemberIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!title.trim()) {
      toast({ variant: "destructive", title: "알림 제목을 입력해주세요." });
      return;
    }
    if (!content.trim()) {
      toast({ variant: "destructive", title: "알림 내용을 입력해주세요." });
      return;
    }
    if (!channels.app) {
      toast({ variant: "destructive", title: "앱 알림을 선택해주세요." });
      return;
    }
    if (targetType === "select" && selectedMemberIds.length === 0) {
      toast({ variant: "destructive", title: "발송 대상 회원을 선택해주세요." });
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetType,
          channels,
          title,
          content,
          memberIds: targetType === "select" ? selectedMemberIds : undefined
        })
      });

      if (!res.ok) throw new Error("Failed to send notification");
      
      const result = await res.json();
      toast({ 
        title: "알림 발송 완료", 
        description: `${result.sentCount}명에게 알림이 발송되었습니다.` 
      });
      
      setTitle("");
      setContent("");
      setSelectedMemberIds([]);
      setChannels({ email: false, sms: false, app: true });
      queryClient.invalidateQueries({ queryKey: ["admin", "notification-history"] });
    } catch (error) {
      toast({ variant: "destructive", title: "알림 발송에 실패했습니다." });
    } finally {
      setIsSending(false);
    }
  };

  const targetTypeLabels: Record<string, string> = {
    all: "전체 사용자",
    purchased: "구매고객",
    not_purchased: "미구매 고객",
    select: "고객 선택"
  };

  const { data: history = [] } = useQuery<{ date: string; title: string; content: string; sentCount: number; createdAt: string; targetType: string }[]>({
    queryKey: ["admin", "notification-history"],
    queryFn: async () => {
      const res = await fetch("/api/admin/notifications/history", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">알림 발송</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">발송 설정</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">발송 대상</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "all", label: "전체 사용자" },
                  { value: "purchased", label: "구매고객" },
                  { value: "not_purchased", label: "미구매 고객" },
                  { value: "select", label: "고객 선택" }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTargetType(opt.value as typeof targetType)}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      targetType === opt.value 
                        ? "bg-primary text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {targetType === "select" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회원 선택 ({selectedMemberIds.length}명 선택됨)
                </label>
                <input
                  type="text"
                  placeholder="회원 검색..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2"
                />
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredMembers.slice(0, 50).map(member => (
                    <label
                      key={member.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.includes(member.id)}
                        onChange={() => handleToggleMember(member.id)}
                        className="mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name || "-"}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">발송 채널</label>
              <div className="flex gap-4">
                {[
                  { key: "app", label: "앱 알림", disabled: false },
                  { key: "email", label: "이메일 (준비중)", disabled: true },
                  { key: "sms", label: "문자 (준비중)", disabled: true }
                ].map(ch => (
                  <label key={ch.key} className={`flex items-center gap-2 ${ch.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      disabled={ch.disabled}
                      checked={channels[ch.key as keyof typeof channels]}
                      onChange={(e) => setChannels(prev => ({ ...prev, [ch.key]: e.target.checked }))}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm text-gray-700">{ch.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">알림 내용</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="알림 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="알림 내용을 입력하세요"
                rows={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSending ? "발송 중..." : "알림 발송하기"}
            </button>
          </div>
        </div>
      </div>

      {/* 발송 히스토리 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">발송 히스토리</h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">발송 대상</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">발송 수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    발송된 알림이 없습니다.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{targetTypeLabels[item.targetType] || item.targetType || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{item.content}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.sentCount}명</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function AdminPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const getTabFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "products";
  };

  const [activeMenu, setActiveMenu] = useState(getTabFromUrl);

  // URL 변경 감지 (쿼리 파라미터 포함)
  useEffect(() => {
    const handleLocationChange = () => {
      const tab = getTabFromUrl();
      if (tab && tab !== activeMenu) {
        setActiveMenu(tab);
      }
    };

    // 초기 로드 시 탭 설정
    handleLocationChange();

    // popstate 이벤트로 뒤로가기/앞으로가기 감지
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [location, activeMenu]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("all");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productSortField, setProductSortField] = useState<string>("createdAt");
  const [productSortOrder, setProductSortOrder] = useState<"asc" | "desc">("desc");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    categoryId: 0,
    price: 0,
    originalPrice: 0,
    stock: 0,
    status: "active",
    description: "",
    image: ""
  });
  const [productTab, setProductTab] = useState("products");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    slug: "",
    displayOrder: 0,
    isActive: true,
    image: ""
  });
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqCategoryFilter, setFaqCategoryFilter] = useState("전체");
  const faqCategories = ["전체", "주문/결제", "배송", "장수박스", "교환/반품", "회원", "적립/쿠폰", "행사/이벤트", "기타"];
  const [faqForm, setFaqForm] = useState<FaqFormData>({
    category: "",
    question: "",
    answer: "",
    isActive: true,
    displayOrder: 0
  });

  const { data: authData, isLoading: authLoading, isFetching: authFetching } = useAdminAuth();

  const { data: products = [], isLoading: productsLoading } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const { data: members = [], isLoading: membersLoading } = useAdminMembers();
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useAdminSubscriptions();
  const { data: subscriptionPlans = [], isLoading: plansLoading } = useAdminSubscriptionPlans();
  const createPlanMutation = useCreateSubscriptionPlan();
  const updatePlanMutation = useUpdateSubscriptionPlan();
  const deletePlanMutation = useDeleteSubscriptionPlan();
  const reorderPlansMutation = useReorderSubscriptionPlans();
  const [subscriptionTab, setSubscriptionTab] = useState("plans");
  const [draggedPlanId, setDraggedPlanId] = useState<number | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planForm, setPlanForm] = useState<PlanFormData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    originalPrice: 0,
    features: [],
    isPopular: false,
    isActive: true,
  });
  const [newFeature, setNewFeature] = useState("");

  const { data: events = [], isLoading: eventsLoading } = useAdminEvents();
  const deleteEventMutation = useDeleteEvent();

  const { data: promotionsData = [], isLoading: promotionsLoading } = useQuery<Promotion[]>({
    queryKey: ["admin", "promotions"],
    queryFn: async () => {
      const res = await fetch("/api/promotions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch promotions");
      return res.json();
    },
    enabled: !!authData?.admin,
  });

  const createPromotionMutation = useMutation({
    mutationFn: async (data: Partial<Promotion>) => {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create promotion");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
    },
  });

  const updatePromotionMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Promotion>) => {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update promotion");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
    },
  });

  const updatePromotionProductsMutation = useMutation({
    mutationFn: async ({ id, productIds }: { id: number; productIds: number[] }) => {
      const res = await fetch(`/api/admin/promotions/${id}/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productIds }),
      });
      if (!res.ok) throw new Error("Failed to update promotion products");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
    },
  });

  const deletePromotionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete promotion");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
    },
  });

  const { data: inquiriesData = [], isLoading: inquiriesLoading } = useAdminInquiries();
  const { data: faqsData = [], isLoading: faqsLoading } = useAdminFaqs();
  const { data: adminsData = [], isLoading: adminsLoading } = useAdminList();
  const { data: dashboardStats } = useDashboardStats();
  const { data: brandingData = [] } = useQuery<BrandingData[]>({
    queryKey: ["admin", "branding"],
    queryFn: async () => {
      const res = await fetch("/api/admin/branding", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch branding");
      return res.json();
    },
    enabled: !!authData?.admin,
  });
  const [editingBranding, setEditingBranding] = useState<BrandingData | null>(null);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const deleteFaqMutation = useDeleteFaq();

  const updateBrandingMutation = useMutation({
    mutationFn: async ({ key, data }: { key: string; data: Partial<BrandingData> }) => {
      const res = await fetch(`/api/admin/branding/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update branding");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "branding"] });
      setEditingBranding(null);
      toast({ title: "저장 완료", description: "브랜딩 설정이 저장되었습니다." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "저장 실패", description: "다시 시도해주세요." });
    },
  });

  const resetPlanForm = () => {
    setPlanForm({
      name: "",
      slug: "",
      description: "",
      price: 0,
      originalPrice: 0,
      features: [],
      isPopular: false,
      isActive: true,
    });
    setEditingPlan(null);
    setNewFeature("");
  };

  const openEditPlanModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || "",
      slug: plan.slug || "",
      description: plan.description || "",
      price: plan.price || 0,
      originalPrice: plan.originalPrice || 0,
      features: plan.features || [],
      isPopular: plan.isPopular || false,
      isActive: plan.isActive !== false,
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async () => {
    if (!planForm.name.trim()) {
      toast({ variant: "destructive", title: "입력 오류", description: "플랜명을 입력해주세요." });
      return;
    }
    const slug = planForm.slug.trim() || planForm.name.toLowerCase().replace(/[^a-z0-9가-힣]/gi, '-').replace(/-+/g, '-');
    try {
      if (editingPlan) {
        await updatePlanMutation.mutateAsync({ id: editingPlan.id, ...planForm, slug });
        toast({ title: "수정 완료", description: "플랜이 수정되었습니다." });
      } else {
        await createPlanMutation.mutateAsync({ ...planForm, slug });
        toast({ title: "등록 완료", description: "플랜이 등록되었습니다." });
      }
      setIsPlanModalOpen(false);
      resetPlanForm();
    } catch (error) {
      toast({ variant: "destructive", title: "저장 실패", description: "다시 시도해주세요." });
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!confirm("정말 이 플랜을 삭제하시겠습니까?")) return;
    try {
      await deletePlanMutation.mutateAsync(id);
      toast({ title: "삭제 완료", description: "플랜이 삭제되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "삭제 실패", description: "다시 시도해주세요." });
    }
  };

  const handlePlanDragStart = (e: React.DragEvent, planId: number) => {
    setDraggedPlanId(planId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handlePlanDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handlePlanDrop = (e: React.DragEvent, targetPlanId: number) => {
    e.preventDefault();
    if (draggedPlanId === null || draggedPlanId === targetPlanId) return;
    
    const draggedIndex = subscriptionPlans.findIndex(p => p.id === draggedPlanId);
    const targetIndex = subscriptionPlans.findIndex(p => p.id === targetPlanId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newPlans = [...subscriptionPlans];
    const [removed] = newPlans.splice(draggedIndex, 1);
    newPlans.splice(targetIndex, 0, removed);
    
    // Optimistic update - immediately update the UI
    const updatedPlans = newPlans.map((plan, index) => ({
      ...plan,
      displayOrder: index
    }));
    queryClient.setQueryData(["admin", "subscription-plans"], updatedPlans);
    
    const orders = newPlans.map((plan, index) => ({
      id: plan.id,
      displayOrder: index
    }));
    
    // Save in background
    reorderPlansMutation.mutate(orders, {
      onError: () => {
        // Revert on error
        queryClient.invalidateQueries({ queryKey: ["admin", "subscription-plans"] });
        toast({ variant: "destructive", title: "순서 변경 실패", description: "다시 시도해주세요." });
      }
    });
    
    setDraggedPlanId(null);
  };

  const handlePlanDragEnd = () => {
    setDraggedPlanId(null);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setPlanForm({ ...planForm, features: [...planForm.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setPlanForm({ ...planForm, features: planForm.features.filter((_, i) => i !== index) });
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("정말 이 행사를 삭제하시겠습니까?")) return;
    try {
      await deleteEventMutation.mutateAsync(id);
      toast({ title: "삭제 완료", description: "행사가 삭제되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "삭제 실패", description: "다시 시도해주세요." });
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      slug: "",
      displayOrder: 0,
      isActive: true,
      image: ""
    });
    setEditingCategory(null);
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "카테고리명을 입력해주세요.",
      });
      return;
    }
    const slug = categoryForm.slug.trim() || categoryForm.name.toLowerCase().replace(/[^a-z0-9가-힣]/gi, '-').replace(/-+/g, '-');
    try {
      await createCategoryMutation.mutateAsync({
        name: categoryForm.name.trim(),
        slug: slug,
        displayOrder: categoryForm.displayOrder,
        isActive: categoryForm.isActive,
        ...(categoryForm.image.trim() ? { image: categoryForm.image.trim() } : {}),
      });
      toast({
        title: "카테고리 등록 완료",
        description: "새 카테고리가 등록되었습니다.",
      });
      setIsCategoryModalOpen(false);
      resetCategoryForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "카테고리 등록 실패",
        description: "다시 시도해주세요.",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    if (!categoryForm.name.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "카테고리명을 입력해주세요.",
      });
      return;
    }
    const slug = categoryForm.slug.trim() || categoryForm.name.toLowerCase().replace(/[^a-z0-9가-힣]/gi, '-').replace(/-+/g, '-');
    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        name: categoryForm.name.trim(),
        slug: slug,
        displayOrder: categoryForm.displayOrder,
        isActive: categoryForm.isActive,
        ...(categoryForm.image.trim() ? { image: categoryForm.image.trim() } : {}),
      });
      toast({
        title: "카테고리 수정 완료",
        description: "카테고리 정보가 수정되었습니다.",
      });
      setIsCategoryModalOpen(false);
      resetCategoryForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "카테고리 수정 실패",
        description: "다시 시도해주세요.",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("이 카테고리를 삭제하시겠습니까?")) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      toast({
        title: "카테고리 삭제 완료",
        description: "카테고리가 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "카테고리 삭제 실패",
        description: "해당 카테고리에 연결된 상품이 있을 수 있습니다.",
      });
    }
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    const existingImage = category.image || categoryImageMap[category.slug] || "";
    setCategoryForm({
      name: category.name || "",
      slug: category.slug || "",
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive ?? true,
      image: existingImage
    });
    setIsCategoryModalOpen(true);
  };

  const resetFaqForm = () => {
    setFaqForm({
      category: "",
      question: "",
      answer: "",
      isActive: true,
      displayOrder: 0
    });
    setEditingFaq(null);
  };

  const handleCreateFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "질문과 답변을 모두 입력해주세요.",
      });
      return;
    }
    try {
      await createFaqMutation.mutateAsync({
        category: faqForm.category.trim() || "기타",
        question: faqForm.question.trim(),
        answer: faqForm.answer.trim(),
        isActive: faqForm.isActive,
        displayOrder: faqForm.displayOrder,
      });
      toast({
        title: "FAQ 등록 완료",
        description: "새 FAQ가 등록되었습니다.",
      });
      setIsFaqModalOpen(false);
      resetFaqForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "FAQ 등록 실패",
        description: "다시 시도해주세요.",
      });
    }
  };

  const handleUpdateFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "질문과 답변을 모두 입력해주세요.",
      });
      return;
    }
    if (!editingFaq) return;
    try {
      await updateFaqMutation.mutateAsync({
        id: editingFaq.id,
        category: faqForm.category.trim() || "기타",
        question: faqForm.question.trim(),
        answer: faqForm.answer.trim(),
        isActive: faqForm.isActive,
        displayOrder: faqForm.displayOrder,
      });
      toast({
        title: "FAQ 수정 완료",
        description: "FAQ가 수정되었습니다.",
      });
      setIsFaqModalOpen(false);
      resetFaqForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "FAQ 수정 실패",
        description: "다시 시도해주세요.",
      });
    }
  };

  const handleDeleteFaq = async (faqId: number) => {
    if (!confirm("이 FAQ를 삭제하시겠습니까?")) return;
    try {
      await deleteFaqMutation.mutateAsync(faqId);
      toast({
        title: "FAQ 삭제 완료",
        description: "FAQ가 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "FAQ 삭제 실패",
        description: "다시 시도해주세요.",
      });
    }
  };

  const openEditFaqModal = (faq: Faq) => {
    setEditingFaq(faq);
    setFaqForm({
      category: faq.category || "",
      question: faq.question || "",
      answer: faq.answer || "",
      isActive: faq.isActive ?? true,
      displayOrder: faq.displayOrder || 0
    });
    setIsFaqModalOpen(true);
  };

  // 로딩 중이거나 아직 데이터를 받지 못한 경우 로딩 표시
  // authData가 undefined인 경우는 아직 쿼리가 완료되지 않은 상태
  if (authLoading || authData === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // authData가 존재하지만 admin이 없는 경우에만 권한없음 표시
  if (authData && !authData.admin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h1>
          <p className="text-gray-500 mb-6">
            이 페이지는 관리자만 접근할 수 있습니다.<br />
            관리자 계정으로 로그인해주세요.
          </p>
          <Button 
            onClick={() => setLocation("/admin/login")}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            data-testid="button-go-admin-login"
          >
            관리자 로그인
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryName = (categoryId: number | null | undefined) => {
    if (!categoryId) return "-";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "-";
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("ko-KR");
  };

  const getProductStatus = (status: string | null | undefined) => {
    if (status === "active") return "판매중";
    if (status === "inactive" || status === "out_of_stock") return "품절";
    return status || "-";
  };

  const getMemberStatus = (status: string | null | undefined) => {
    if (status === "active") return "활성";
    if (status === "inactive" || status === "dormant") return "휴면";
    return status || "-";
  };

  const getSubscriptionStatus = (status: string | null | undefined) => {
    if (status === "active") return "활성";
    if (status === "cancelled" || status === "inactive") return "해지";
    return status || "-";
  };

  const getEventStatus = (status: string | null | undefined) => {
    if (status === "recruiting") return "모집중";
    if (status === "closed" || status === "completed") return "마감";
    return status || "-";
  };

  const getInquiryStatus = (status: string | null | undefined) => {
    if (status === "pending") return "답변대기";
    if (status === "answered" || status === "completed") return "답변완료";
    if (status === "processing") return "처리중";
    return status || "-";
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "products":
        if (productsLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        
        const getProductStatusLabel = (status: string | null | undefined) => {
          if (status === "active") return "판매중";
          if (status === "pending") return "검수중";
          if (status === "inactive") return "대기중";
          return status || "-";
        };

        const getProductStatusStyle = (status: string | null | undefined) => {
          if (status === "active") return "bg-green-100 text-green-700";
          if (status === "pending") return "bg-yellow-100 text-yellow-700";
          if (status === "inactive") return "bg-gray-100 text-gray-600";
          return "bg-gray-100 text-gray-600";
        };

        const handleProductSort = (field: string) => {
          if (productSortField === field) {
            setProductSortOrder(productSortOrder === "asc" ? "desc" : "asc");
          } else {
            setProductSortField(field);
            setProductSortOrder("desc");
          }
        };

        const filteredProducts = products
          .filter((product) => {
            const matchesSearch = productSearchQuery === "" || 
              product.name.toLowerCase().includes(productSearchQuery.toLowerCase());
            const matchesStatus = productStatusFilter === "all" || product.status === productStatusFilter;
            const matchesCategory = productCategoryFilter === "all" || 
              product.categoryId?.toString() === productCategoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
          })
          .sort((a, b) => {
            let aVal: any = a[productSortField as keyof typeof a];
            let bVal: any = b[productSortField as keyof typeof b];
            
            if (productSortField === "createdAt" || productSortField === "updatedAt") {
              aVal = aVal ? new Date(aVal).getTime() : 0;
              bVal = bVal ? new Date(bVal).getTime() : 0;
            } else if (productSortField === "price" || productSortField === "stock") {
              aVal = aVal || 0;
              bVal = bVal || 0;
            } else if (productSortField === "name") {
              aVal = aVal?.toLowerCase() || "";
              bVal = bVal?.toLowerCase() || "";
            }
            
            if (productSortOrder === "asc") {
              return aVal > bVal ? 1 : -1;
            } else {
              return aVal < bVal ? 1 : -1;
            }
          });

        const resetProductForm = () => {
          setProductForm({
            name: "",
            categoryId: 0,
            price: 0,
            originalPrice: 0,
            stock: 0,
            status: "active",
            description: "",
            image: ""
          });
          setEditingProduct(null);
        };

        const handleCreateProduct = async () => {
          try {
            await createProductMutation.mutateAsync({
              name: productForm.name,
              categoryId: productForm.categoryId || null,
              price: productForm.price,
              originalPrice: productForm.originalPrice || null,
              stock: productForm.stock,
              status: productForm.status,
              description: productForm.description || null,
              image: productForm.image || null,
            });
            toast({
              title: "상품 등록 완료",
              description: "새 상품이 등록되었습니다.",
            });
            setIsProductModalOpen(false);
            resetProductForm();
          } catch (error) {
            toast({
              variant: "destructive",
              title: "상품 등록 실패",
              description: "다시 시도해주세요.",
            });
          }
        };

        const handleUpdateProduct = async () => {
          if (!editingProduct) return;
          try {
            await updateProductMutation.mutateAsync({
              id: editingProduct.id,
              name: productForm.name,
              categoryId: productForm.categoryId || null,
              price: productForm.price,
              originalPrice: productForm.originalPrice || null,
              stock: productForm.stock,
              status: productForm.status,
              description: productForm.description || null,
              image: productForm.image || null,
            });
            toast({
              title: "상품 수정 완료",
              description: "상품 정보가 수정되었습니다.",
            });
            setIsProductModalOpen(false);
            resetProductForm();
          } catch (error) {
            toast({
              variant: "destructive",
              title: "상품 수정 실패",
              description: "다시 시도해주세요.",
            });
          }
        };

        const handleStatusChange = async (productId: number, newStatus: string) => {
          try {
            await updateProductMutation.mutateAsync({
              id: productId,
              status: newStatus,
            });
            toast({
              title: "상태 변경 완료",
              description: "상품 상태가 변경되었습니다.",
            });
          } catch (error) {
            toast({
              variant: "destructive",
              title: "상태 변경 실패",
              description: "다시 시도해주세요.",
            });
          }
        };

        const openEditModal = (product: Product) => {
          setEditingProduct(product);
          setProductForm({
            name: product.name || "",
            categoryId: product.categoryId || 0,
            price: product.price || 0,
            originalPrice: product.originalPrice || 0,
            stock: product.stock || 0,
            status: product.status || "active",
            description: product.description || "",
            image: product.image || ""
          });
          setIsProductModalOpen(true);
        };

        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">상품 관리</h2>
            </div>

            <Tabs value={productTab} onValueChange={setProductTab} className="mb-4">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="products" className="data-[state=active]:bg-white">상품 목록</TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-white">카테고리 관리</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="상품명 검색..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="pl-9"
                        data-testid="input-product-search"
                      />
                    </div>
                    <Select value={productStatusFilter} onValueChange={setProductStatusFilter}>
                      <SelectTrigger className="w-[120px]" data-testid="select-product-status">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="active">판매중</SelectItem>
                        <SelectItem value="pending">검수중</SelectItem>
                        <SelectItem value="inactive">대기중</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => setLocation("/admin/products/new")}
                    className="bg-primary text-white ml-3"
                    data-testid="button-add-product"
                  >
                    + 상품 등록
                  </Button>
                </div>

                <div className="mb-4 overflow-x-auto">
                  <div className="flex gap-2 pb-2">
                    <button
                      onClick={() => setProductCategoryFilter("all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        productCategoryFilter === "all"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      data-testid="category-tab-all"
                    >
                      전체
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setProductCategoryFilter(category.id.toString())}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          productCategoryFilter === category.id.toString()
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        data-testid={`category-tab-${category.id}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th 
                          className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
                          onClick={() => handleProductSort("name")}
                        >
                          <div className="flex items-center gap-1">
                            상품명
                            {productSortField === "name" ? (
                              productSortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">카테고리</th>
                        <th 
                          className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
                          onClick={() => handleProductSort("price")}
                        >
                          <div className="flex items-center gap-1">
                            가격
                            {productSortField === "price" ? (
                              productSortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
                          onClick={() => handleProductSort("stock")}
                        >
                          <div className="flex items-center gap-1">
                            재고
                            {productSortField === "stock" ? (
                              productSortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                        <th 
                          className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
                          onClick={() => handleProductSort("createdAt")}
                        >
                          <div className="flex items-center gap-1">
                            작성일
                            {productSortField === "createdAt" ? (
                              productSortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
                          onClick={() => handleProductSort("updatedAt")}
                        >
                          <div className="flex items-center gap-1">
                            수정일
                            {productSortField === "updatedAt" ? (
                              productSortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const statusLabel = getProductStatusLabel(product.status);
                        const statusStyle = getProductStatusStyle(product.status);
                        return (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{getCategoryName(product.categoryId)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{product.price.toLocaleString()}원</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{product.stock ?? 0}개</td>
                            <td className="px-4 py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button 
                                    className={`text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80 ${statusStyle}`}
                                    data-testid={`status-badge-${product.id}`}
                                  >
                                    {statusLabel}
                                  </button>
                                </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(product.id, "active")}
                                className="text-green-700"
                              >
                                판매중
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(product.id, "pending")}
                                className="text-yellow-700"
                              >
                                검수중
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(product.id, "inactive")}
                                className="text-gray-600"
                              >
                                대기중
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {product.createdAt ? new Date(product.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {product.updatedAt ? new Date(product.updatedAt).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => setLocation(`/admin/products/${product.id}`)}
                            className="text-sm text-primary hover:underline"
                            data-testid={`button-edit-product-${product.id}`}
                          >
                            수정
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
              <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "상품 수정" : "상품 등록"}</DialogTitle>
                  <DialogDescription>
                    {editingProduct ? "상품 정보를 수정합니다." : "새로운 상품을 등록합니다."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-name">상품명</Label>
                    <Input
                      id="product-name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="상품명을 입력하세요"
                      data-testid="input-product-name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-category">카테고리</Label>
                    <Select 
                      value={productForm.categoryId?.toString() || "0"} 
                      onValueChange={(value) => setProductForm({ ...productForm, categoryId: parseInt(value) })}
                    >
                      <SelectTrigger data-testid="select-product-form-category">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">선택 안함</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-price">판매가 *</Label>
                      <Input
                        id="product-price"
                        type="text"
                        value={productForm.price ? productForm.price.toLocaleString() : ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setProductForm({ ...productForm, price: parseInt(value) || 0 });
                        }}
                        placeholder="0"
                        data-testid="input-product-price"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-original-price">정가 (할인 전)</Label>
                      <Input
                        id="product-original-price"
                        type="text"
                        value={productForm.originalPrice ? productForm.originalPrice.toLocaleString() : ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setProductForm({ ...productForm, originalPrice: parseInt(value) || 0 });
                        }}
                        placeholder="0"
                        data-testid="input-product-original-price"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-stock">재고</Label>
                      <Input
                        id="product-stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        data-testid="input-product-stock"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-status">상태</Label>
                      <Select 
                        value={productForm.status} 
                        onValueChange={(value) => setProductForm({ ...productForm, status: value })}
                      >
                        <SelectTrigger data-testid="select-product-form-status">
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">판매중</SelectItem>
                          <SelectItem value="pending">검수중</SelectItem>
                          <SelectItem value="inactive">대기중</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-description">설명</Label>
                    <Input
                      id="product-description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="상품 설명을 입력하세요"
                      data-testid="input-product-description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-image">이미지 URL</Label>
                    <Input
                      id="product-image"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="이미지 URL을 입력하세요"
                      data-testid="input-product-image"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsProductModalOpen(false);
                      resetProductForm();
                    }}
                    data-testid="button-cancel-product"
                  >
                    취소
                  </Button>
                  <Button 
                    onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    data-testid="button-save-product"
                  >
                    {(createProductMutation.isPending || updateProductMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingProduct ? "수정" : "등록"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
              </TabsContent>

              <TabsContent value="categories" className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{categories.length}개의 카테고리</span>
                  <Button 
                    onClick={() => {
                      resetCategoryForm();
                      setIsCategoryModalOpen(true);
                    }}
                    className="bg-primary text-white"
                    data-testid="button-add-category"
                  >
                    + 카테고리 추가
                  </Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">순서</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이미지</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">카테고리명</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">슬러그</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상품 수</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => {
                        const productCount = products.filter(p => p.categoryId === category.id).length;
                        return (
                          <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">{category.displayOrder || 0}</td>
                            <td className="px-4 py-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                <img 
                                  src={categoryImageMap[category.slug] || images.koreanRedGinsengRoots} 
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{category.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{category.slug}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{productCount}개</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                category.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                              }`}>
                                {category.isActive ? "활성" : "비활성"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => openEditCategoryModal(category)}
                                  className="text-sm text-primary hover:underline"
                                  data-testid={`button-edit-category-${category.id}`}
                                >
                                  수정
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-sm text-red-500 hover:underline"
                                  data-testid={`button-delete-category-${category.id}`}
                                >
                                  삭제
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            등록된 카테고리가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                  <DialogContent className="sm:max-w-[400px] bg-white">
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? "카테고리 수정" : "카테고리 추가"}</DialogTitle>
                      <DialogDescription>
                        {editingCategory ? "카테고리 정보를 수정합니다." : "새로운 카테고리를 추가합니다."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category-name">카테고리명</Label>
                        <Input
                          id="category-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="예: 홍삼/인삼"
                          data-testid="input-category-name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-slug">슬러그</Label>
                        <Input
                          id="category-slug"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          placeholder="예: ginseng"
                          data-testid="input-category-slug"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-order">표시 순서</Label>
                        <Input
                          id="category-order"
                          type="number"
                          value={categoryForm.displayOrder}
                          onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          data-testid="input-category-order"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>카테고리 이미지</Label>
                        {categoryForm.image ? (
                          <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={categoryForm.image} 
                                alt="카테고리 이미지" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 w-6 h-6 p-0 rounded-full"
                              onClick={() => setCategoryForm({ ...categoryForm, image: "" })}
                              data-testid="button-delete-category-image"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer">
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
                                    const res = await fetch("/api/upload", {
                                      method: "POST",
                                      body: formData,
                                    });
                                    const data = await res.json();
                                    if (data.url) {
                                      setCategoryForm({ ...categoryForm, image: data.url });
                                      toast({ title: "이미지 업로드 완료" });
                                    }
                                  } catch (error) {
                                    toast({ variant: "destructive", title: "이미지 업로드 실패" });
                                  }
                                }}
                                data-testid="input-category-image-file"
                              />
                              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">이미지 업로드</span>
                              </div>
                            </label>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">권장 크기: 200x200px (정사각형)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="category-active"
                          checked={categoryForm.isActive}
                          onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, isActive: !!checked })}
                          data-testid="checkbox-category-active"
                        />
                        <Label htmlFor="category-active" className="text-sm font-normal">
                          활성화 (사용자에게 표시)
                        </Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsCategoryModalOpen(false);
                          resetCategoryForm();
                        }}
                        data-testid="button-cancel-category"
                      >
                        취소
                      </Button>
                      <Button 
                        onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                        disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                        data-testid="button-save-category"
                      >
                        {(createCategoryMutation.isPending || updateCategoryMutation.isPending) && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {editingCategory ? "수정" : "추가"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "brands":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">브랜드 관리</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                + 브랜드 등록
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">로고</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">브랜드명</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">설명</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상품 수</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, name: "정관장", logo: "https://via.placeholder.com/40", description: "한국 대표 홍삼 브랜드", productCount: 12, status: "active" },
                    { id: 2, name: "고려홍삼", logo: "https://via.placeholder.com/40", description: "전통 방식 홍삼 전문", productCount: 8, status: "active" },
                    { id: 3, name: "웰닉스 뉴트리션", logo: "https://via.placeholder.com/40", description: "시니어 맞춤 영양제", productCount: 15, status: "active" },
                    { id: 4, name: "바이오헬스코리아", logo: "https://via.placeholder.com/40", description: "프로바이오틱스 전문", productCount: 5, status: "inactive" },
                  ].map((brand) => (
                    <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{brand.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{brand.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{brand.productCount}개</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          brand.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {brand.status === "active" ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-primary hover:underline mr-3">수정</button>
                        <button className="text-sm text-red-500 hover:underline">삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "members":
        if (membersLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">회원 관리</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="회원 검색..." 
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이름</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이메일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">연락처</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">가입일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">구독</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const statusText = getMemberStatus(member.status);
                    return (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{member.phone || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(member.createdAt)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{member.membershipLevel || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            statusText === "활성" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button 
                                className="text-sm text-primary hover:underline"
                                onClick={() => setSelectedMember(member)}
                              >
                                상세
                              </button>
                            </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px] bg-white h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
                            <DialogHeader className="p-6 pb-2">
                              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                {selectedMember?.name}
                                <span className={`text-xs font-normal px-2 py-1 rounded-full ${
                                  selectedMember?.status === "활성" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                }`}>
                                  {selectedMember?.status}
                                </span>
                              </DialogTitle>
                              <DialogDescription className="text-gray-500">
                                {selectedMember?.email}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Tabs defaultValue="info" className="flex-1 flex flex-col w-full">
                              <div className="px-6 border-b border-gray-100">
                                <TabsList className="bg-transparent h-auto p-0 space-x-6">
                                  <TabsTrigger 
                                    value="info" 
                                    className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
                                  >
                                    기본 정보
                                  </TabsTrigger>
                                  <TabsTrigger 
                                    value="orders" 
                                    className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
                                  >
                                    구매 내역
                                  </TabsTrigger>
                                  <TabsTrigger 
                                    value="reviews" 
                                    className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
                                  >
                                    작성 리뷰
                                  </TabsTrigger>
                                  <TabsTrigger 
                                    value="events" 
                                    className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent"
                                  >
                                    참여 행사
                                  </TabsTrigger>
                                </TabsList>
                              </div>

                              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                                <TabsContent value="info" className="mt-0 space-y-6">
                                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">회원 상세 정보</h3>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">연락처</p>
                                        <p className="text-sm text-gray-900">{selectedMember?.phone}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">가입일</p>
                                        <p className="text-sm text-gray-900">{selectedMember?.createdAt ? new Date(selectedMember.createdAt).toLocaleString('ko-KR') : '-'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">구독 정보</h3>
                                    <p className="text-sm text-gray-500">구독 정보를 불러오는 중...</p>
                                  </div>
                                </TabsContent>

                                <TabsContent value="orders" className="mt-0">
                                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 text-center">
                                    <p className="text-sm text-gray-500">주문 내역을 불러오는 중...</p>
                                  </div>
                                </TabsContent>

                                <TabsContent value="reviews" className="mt-0">
                                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 text-center">
                                    <p className="text-sm text-gray-500">리뷰 내역을 불러오는 중...</p>
                                  </div>
                                </TabsContent>

                                <TabsContent value="events" className="mt-0">
                                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 text-center">
                                    <p className="text-sm text-gray-500">행사 참여 내역을 불러오는 중...</p>
                                  </div>
                                </TabsContent>
                              </div>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "subscription":
        if (subscriptionsLoading || plansLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">장수박스 관리</h2>
            </div>

            <Tabs value={subscriptionTab} onValueChange={setSubscriptionTab} className="space-y-6">
              <TabsList className="bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="plans" className="data-[state=active]:bg-white rounded-md px-4 py-2">
                  플랜 관리
                </TabsTrigger>
                <TabsTrigger value="subscribers" className="data-[state=active]:bg-white rounded-md px-4 py-2">
                  구독자 관리
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plans">
                <div className="flex justify-end mb-4">
                  <Button 
                    onClick={() => { resetPlanForm(); setIsPlanModalOpen(true); }}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    + 플랜 등록
                  </Button>
                </div>

                <div className="grid gap-4">
                  <p className="text-sm text-gray-500 mb-2">드래그하여 순서를 변경할 수 있습니다.</p>
                  {subscriptionPlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      draggable
                      onDragStart={(e) => handlePlanDragStart(e, plan.id)}
                      onDragOver={handlePlanDragOver}
                      onDrop={(e) => handlePlanDrop(e, plan.id)}
                      onDragEnd={handlePlanDragEnd}
                      className={`bg-white rounded-lg border-2 p-6 cursor-move transition-opacity ${
                        plan.isPopular ? 'border-primary' : 'border-gray-200'
                      } ${draggedPlanId === plan.id ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded cursor-grab active:cursor-grabbing mt-1">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                              {plan.name}
                              {plan.isPopular && (
                                <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                                  BEST
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(plan.features || []).map((feature: string, i: number) => (
                                <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          {plan.originalPrice && plan.originalPrice > plan.price && (
                            <p className="text-sm text-gray-400 line-through">{plan.originalPrice.toLocaleString()}원</p>
                          )}
                          <p className="text-2xl font-bold text-primary">{plan.price.toLocaleString()}원<span className="text-sm font-normal text-gray-500">/월</span></p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {plan.isActive ? '활성' : '비활성'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditPlanModal(plan)}
                            className="text-sm text-primary hover:underline"
                          >
                            수정
                          </button>
                          <button 
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {subscriptionPlans.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500">등록된 플랜이 없습니다.</p>
                      <Button 
                        onClick={() => { resetPlanForm(); setIsPlanModalOpen(true); }}
                        className="mt-4 bg-primary text-white hover:bg-primary/90"
                      >
                        첫 플랜 등록하기
                      </Button>
                    </div>
                  )}
                </div>

                <Dialog open={isPlanModalOpen} onOpenChange={(open) => { if (!open) { setIsPlanModalOpen(false); resetPlanForm(); } }}>
                  <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-900">
                        {editingPlan ? '플랜 수정' : '새 플랜 등록'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-500">
                        장수박스 구독 플랜 정보를 입력하세요.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>플랜명 *</Label>
                          <Input 
                            value={planForm.name}
                            onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                            placeholder="예: 효심 박스"
                          />
                        </div>
                        <div>
                          <Label>슬러그</Label>
                          <Input 
                            value={planForm.slug}
                            onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value })}
                            placeholder="자동 생성됩니다"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>설명</Label>
                        <Input 
                          value={planForm.description}
                          onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                          placeholder="예: 매월 엄선된 건강식품 3~4종"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>월 가격 *</Label>
                          <Input 
                            type="number"
                            value={planForm.price}
                            onChange={(e) => setPlanForm({ ...planForm, price: parseInt(e.target.value) || 0 })}
                            placeholder="89000"
                          />
                        </div>
                        <div>
                          <Label>정가 (할인 표시용)</Label>
                          <Input 
                            type="number"
                            value={planForm.originalPrice}
                            onChange={(e) => setPlanForm({ ...planForm, originalPrice: parseInt(e.target.value) || 0 })}
                            placeholder="120000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>특징 태그</Label>
                        <div className="flex gap-2 mb-2">
                          <Input 
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="예: 홍삼/건강즙 포함"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          />
                          <Button type="button" variant="outline" onClick={addFeature}>추가</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {planForm.features.map((feature, i) => (
                            <span 
                              key={i} 
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              {feature}
                              <button 
                                onClick={() => removeFeature(i)}
                                className="ml-1 text-gray-400 hover:text-red-500"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="plan-popular"
                            checked={planForm.isPopular}
                            onCheckedChange={(checked) => setPlanForm({ ...planForm, isPopular: !!checked })}
                          />
                          <Label htmlFor="plan-popular">베스트 플랜</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="plan-active"
                            checked={planForm.isActive}
                            onCheckedChange={(checked) => setPlanForm({ ...planForm, isActive: !!checked })}
                          />
                          <Label htmlFor="plan-active">활성화</Label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => { setIsPlanModalOpen(false); resetPlanForm(); }}>취소</Button>
                        <Button 
                          onClick={handleSavePlan}
                          disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
                          className="bg-primary text-white hover:bg-primary/90"
                        >
                          {(createPlanMutation.isPending || updatePlanMutation.isPending) ? '저장 중...' : '저장'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="subscribers">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                      <option value="">전체 플랜</option>
                      {subscriptionPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                      ))}
                    </select>
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                      <option value="">전체 상태</option>
                      <option value="active">활성</option>
                      <option value="paused">일시정지</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">플랜</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">신청일</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이용기간</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">다음 배송</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">금액</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub) => {
                        const statusText = getSubscriptionStatus(sub.status);
                        const startDate = sub.startDate ? new Date(sub.startDate) : null;
                        const now = new Date();
                        const monthsDiff = startDate ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;
                        return (
                          <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{sub.member?.name || "-"}</p>
                                <p className="text-xs text-gray-500">{sub.member?.email || ""}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{sub.plan?.name || "-"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sub.startDate)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{monthsDiff > 0 ? `${monthsDiff}개월` : '신규'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sub.nextDeliveryDate)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{(sub.plan?.price || 0).toLocaleString()}원</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                statusText === "활성" ? "bg-green-100 text-green-700" : 
                                statusText === "일시정지" ? "bg-amber-100 text-amber-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {statusText}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-sm text-primary hover:underline">상세보기</button>
                            </td>
                          </tr>
                        );
                      })}
                      {subscriptions.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                            구독자가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "events":
        if (eventsLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">행사 관리</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option value="">전체 상태</option>
                  <option value="recruiting">모집중</option>
                  <option value="closed">모집마감</option>
                  <option value="ongoing">진행중</option>
                  <option value="completed">종료</option>
                </select>
                <Button 
                  onClick={() => setLocation("/admin/events/new")}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  + 행사 등록
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">행사명</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">일시</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">장소</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">참가자</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const statusText = getEventStatus(event.status);
                    const participantRatio = event.maxParticipants ? Math.round(((event.currentParticipants || 0) / event.maxParticipants) * 100) : 0;
                    return (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            {event.tag && <span className="text-xs text-primary">{event.tag}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(event.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{event.location || "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{event.currentParticipants || 0}/{event.maxParticipants || 0}</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${participantRatio >= 80 ? 'bg-red-500' : participantRatio >= 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(participantRatio, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            statusText === "모집중" ? "bg-amber-100 text-amber-700" : 
                            statusText === "진행중" ? "bg-blue-100 text-blue-700" :
                            statusText === "종료" ? "bg-gray-100 text-gray-600" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setLocation(`/admin/events/${event.id}`)}
                              className="text-sm text-primary hover:underline"
                            >
                              수정
                            </button>
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-sm text-red-500 hover:underline"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                        등록된 행사가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "promotions":
        if (promotionsLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;

        const handleDeletePromotion = async (id: number) => {
          if (!confirm("정말 이 이벤트를 삭제하시겠습니까?")) return;
          try {
            await deletePromotionMutation.mutateAsync(id);
            toast({ title: "삭제 완료", description: "이벤트가 삭제되었습니다." });
          } catch (error) {
            toast({ variant: "destructive", title: "삭제 실패", description: "다시 시도해주세요." });
          }
        };

        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">이벤트관 관리</h2>
              <Button onClick={() => setLocation("/admin/promotions/new")}>
                + 이벤트 등록
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이벤트명</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">기간</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상품수</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {promotionsData.map((promo) => (
                    <tr key={promo.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{promo.title}</p>
                          <p className="text-xs text-gray-500">/promotion/{promo.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{promo.period || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">-</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${promo.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {promo.isActive ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setLocation(`/admin/promotions/${promo.id}`)} className="text-sm text-primary hover:underline">수정</button>
                          <button onClick={() => handleDeletePromotion(promo.id)} className="text-sm text-red-500 hover:underline">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {promotionsData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                        등록된 이벤트가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "payments":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">결제 관리</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option>전체 상태</option>
                  <option>완료</option>
                  <option>환불</option>
                  <option>대기</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">결제번호</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">금액</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">결제수단</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">일시</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      결제 내역이 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case "shipping":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">배송 관리</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option>전체 상태</option>
                  <option>배송준비</option>
                  <option>배송중</option>
                  <option>배송완료</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">배송번호</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">주소</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">운송장</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">일시</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      배송 내역이 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case "inquiries":
        if (inquiriesLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">1:1 문의</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option>전체 상태</option>
                  <option>답변대기</option>
                  <option>처리중</option>
                  <option>답변완료</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">제목</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">카테고리</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">등록일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiriesData.map((inquiry) => {
                    const statusText = getInquiryStatus(inquiry.status);
                    return (
                      <tr key={inquiry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{inquiry.member?.name || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{inquiry.subject || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{inquiry.category || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(inquiry.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            statusText === "답변완료" ? "bg-green-100 text-green-700" 
                            : statusText === "답변대기" ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-primary hover:underline">답변</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "faq":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">자주묻는질문</h2>
              <button 
                onClick={() => { resetFaqForm(); setIsFaqModalOpen(true); }}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                + FAQ 등록
              </button>
              <Dialog open={isFaqModalOpen} onOpenChange={(open) => { if (!open) { resetFaqForm(); } setIsFaqModalOpen(open); }}>
                <DialogContent className="sm:max-w-[600px] bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      {editingFaq ? "FAQ 수정" : "FAQ 등록"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                      자주 묻는 질문과 답변을 {editingFaq ? "수정" : "등록"}하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                      <select 
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="">선택하세요</option>
                        {faqCategories.filter(c => c !== "전체").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
                      <input 
                        type="text" 
                        placeholder="질문을 입력하세요"
                        value={faqForm.question}
                        onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">답변</label>
                      <textarea 
                        rows={5}
                        placeholder="답변 내용을 입력하세요"
                        value={faqForm.answer}
                        onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">표시 순서</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={faqForm.displayOrder}
                        onChange={(e) => setFaqForm({ ...faqForm, displayOrder: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input 
                          type="checkbox" 
                          checked={faqForm.isActive}
                          onChange={(e) => setFaqForm({ ...faqForm, isActive: e.target.checked })}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        즉시 게시
                      </label>
                    </div>
                    <button 
                      onClick={editingFaq ? handleUpdateFaq : handleCreateFaq}
                      disabled={createFaqMutation.isPending || updateFaqMutation.isPending}
                      className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {(createFaqMutation.isPending || updateFaqMutation.isPending) && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {editingFaq ? "수정하기" : "등록하기"}
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Category Filter Carousel */}
            <div className="mb-4 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {faqCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      faqCategoryFilter === cat
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    data-testid={`faq-category-filter-${cat}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {faqsLoading ? (
              <div className="text-center py-8 text-gray-500">로딩중...</div>
            ) : faqsData.filter(faq => faqCategoryFilter === "전체" || faq.category === faqCategoryFilter).length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>등록된 FAQ가 없습니다.</p>
                <p className="text-sm mt-1">위의 'FAQ 등록' 버튼을 클릭해 첫 번째 FAQ를 추가하세요.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">카테고리</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-1/2">질문</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqsData
                      .filter(faq => faqCategoryFilter === "전체" || faq.category === faqCategoryFilter)
                      .map((faq) => {
                      const statusText = faq.isActive ? "게시중" : "숨김";
                      return (
                        <tr key={faq.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{faq.category || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{faq.question}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              statusText === "게시중" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => openEditFaqModal(faq)}
                              className="text-sm text-primary hover:underline mr-3"
                            >
                              수정
                            </button>
                            <button 
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="text-sm text-red-500 hover:underline"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case "settings":
        if (adminsLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">관리자 설정</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                    + 관리자 추가
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">새 관리자 등록</DialogTitle>
                    <DialogDescription className="text-gray-500">
                      새로운 관리자 계정을 생성하고 접근 권한을 설정하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input 
                          type="text" 
                          placeholder="이름 입력" 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">직책</label>
                        <input 
                          type="text" 
                          placeholder="직책 입력 (예: CS팀장)" 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이메일 (아이디)</label>
                      <input 
                        type="email" 
                        placeholder="이메일 주소 입력" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                      <input 
                        type="password" 
                        placeholder="비밀번호 설정" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <label className="block text-sm font-bold text-gray-900 mb-3">접근 권한 설정</label>
                      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {adminMenuItems.filter(item => item.id !== "settings").map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox id={`perm-${item.id}`} />
                            <Label 
                              htmlFor={`perm-${item.id}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 mt-2">
                      관리자 등록 완료
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이름</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">이메일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">직책</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">접근 권한</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">최근 접속</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {adminsData.map((admin) => {
                    const statusText = admin.status === "active" ? "활성" : "비활성";
                    const permissions = admin.permissions || [];
                    return (
                      <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{admin.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{admin.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{admin.role}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {permissions.includes("all") ? (
                              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">전체 권한</span>
                            ) : (
                              permissions.map((perm: string) => {
                                const label = adminMenuItems.find(m => m.id === perm)?.label || perm;
                                return (
                                  <span key={perm} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                                    {label.replace(" 관리", "")}
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(admin.lastLogin)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            statusText === "활성" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-primary hover:underline mr-3">수정</button>
                          {admin.role !== "슈퍼 관리자" && (
                            <button className="text-sm text-red-500 hover:underline">삭제</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "main-page":
        return <MainPageSettingsPanel products={products || []} events={events || []} />;

      case "base-settings":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">기준 정보 관리</h2>
            </div>

            <Tabs defaultValue="business" className="space-y-6">
              <TabsList className="bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="business" className="data-[state=active]:bg-white rounded-md px-4 py-2">
                  사업자 정보
                </TabsTrigger>
                <TabsTrigger value="site" className="data-[state=active]:bg-white rounded-md px-4 py-2">
                  사이트 정보
                </TabsTrigger>
                <TabsTrigger value="delivery" className="data-[state=active]:bg-white rounded-md px-4 py-2">
                  배송 정책
                </TabsTrigger>
                <TabsTrigger value="branding" className="data-[state=active]:bg-white rounded-md px-4 py-2">
                  사이트 브랜딩
                </TabsTrigger>
              </TabsList>

              <TabsContent value="business">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">사업자 정보</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">상호명</Label>
                        <Input id="companyName" defaultValue="웰닉스 (주)" placeholder="상호명 입력" />
                      </div>
                      <div>
                        <Label htmlFor="ceoName">대표자</Label>
                        <Input id="ceoName" defaultValue="김건강" placeholder="대표자명 입력" />
                      </div>
                      <div>
                        <Label htmlFor="privacyOfficer">개인정보 관리 책임자</Label>
                        <Input id="privacyOfficer" defaultValue="이웰빙" placeholder="책임자명 입력" />
                      </div>
                      <div>
                        <Label htmlFor="businessNumber">사업자 등록번호</Label>
                        <Input id="businessNumber" defaultValue="123-45-67890" placeholder="000-00-00000" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mailOrderNumber">통신판매업 신고번호</Label>
                        <Input id="mailOrderNumber" defaultValue="2024-서울강남-0001" placeholder="0000-지역명-0000" />
                      </div>
                      <div>
                        <Label htmlFor="address">사업장 주소</Label>
                        <Input id="address" defaultValue="서울시 강남구 테헤란로 123" placeholder="주소 입력" />
                      </div>
                      <div>
                        <Label htmlFor="phone">대표전화</Label>
                        <Input id="phone" defaultValue="1588-0000" placeholder="대표전화 입력" />
                      </div>
                      <div>
                        <Label htmlFor="email">대표이메일</Label>
                        <Input id="email" defaultValue="info@wellnix.co.kr" placeholder="이메일 입력" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                    <Button className="bg-primary text-white hover:bg-primary/90">저장하기</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="site">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">사이트 정보</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <Label htmlFor="siteName">사이트명</Label>
                      <Input id="siteName" defaultValue="웰닉스" placeholder="사이트명 입력" />
                    </div>
                    <div>
                      <Label htmlFor="siteDescription">사이트 설명</Label>
                      <Input id="siteDescription" defaultValue="시니어를 위한 프리미엄 건강식품 쇼핑몰" placeholder="사이트 설명 입력" />
                    </div>
                    <div>
                      <Label htmlFor="copyrightText">저작권 문구</Label>
                      <Input id="copyrightText" defaultValue="© 2026 웰닉스. All rights reserved." placeholder="저작권 문구 입력" />
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                    <Button className="bg-primary text-white hover:bg-primary/90">저장하기</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="delivery">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">배송 정책</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <Label htmlFor="shippingFee">기본 배송비</Label>
                      <Input id="shippingFee" type="number" defaultValue="3500" placeholder="배송비 입력" />
                    </div>
                    <div>
                      <Label htmlFor="freeShippingThreshold">무료배송 기준금액</Label>
                      <Input id="freeShippingThreshold" type="number" defaultValue="70000" placeholder="기준금액 입력" />
                    </div>
                    <div>
                      <Label htmlFor="remoteAreaFee">도서산간 추가 배송비</Label>
                      <Input id="remoteAreaFee" type="number" defaultValue="3000" placeholder="추가 배송비 입력" />
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                    <Button className="bg-primary text-white hover:bg-primary/90">저장하기</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="branding">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">사이트 브랜딩</h3>
                  <p className="text-sm text-gray-500 mb-6">메인 페이지 히어로 섹션과 배너 이미지를 설정합니다.</p>
                  
                  <div className="space-y-6">
                    {brandingData.map((item) => (
                      <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {item.key === "hero" ? "히어로 섹션" : `배너 ${item.key.replace("banner", "")}`}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {item.isActive ? "활성" : "비활성"}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingBranding(item)}
                            >
                              수정
                            </Button>
                          </div>
                        </div>
                        
                        {item.image ? (
                          <div className="mb-3">
                            <img 
                              src={item.image} 
                              alt="브랜딩 이미지" 
                              className="h-24 rounded border border-gray-200 object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="mb-3 h-24 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                            이미지 없음
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <span className="text-gray-500">링크:</span>
                          <span className="ml-2 text-primary">{item.linkUrl || "설정 안됨"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {editingBranding && (
                  <Dialog open={!!editingBranding} onOpenChange={() => setEditingBranding(null)}>
                    <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                          {editingBranding.key === "hero" ? "히어로 섹션" : `배너 ${editingBranding.key.replace("banner", "")}`} 수정
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>이미지</Label>
                          <div className="mt-2 space-y-3">
                            {editingBranding.image ? (
                              <div className="relative">
                                <img 
                                  src={editingBranding.image} 
                                  alt="미리보기" 
                                  className="w-full h-40 rounded-lg border border-gray-200 object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Error'; }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditingBranding({ ...editingBranding, image: "" })}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                이미지를 업로드하세요
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <label className="flex-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    formData.append("folder", "banners");
                                    
                                    try {
                                      const res = await fetch("/api/upload", {
                                        method: "POST",
                                        body: formData,
                                      });
                                      const data = await res.json();
                                      if (data.url) {
                                        setEditingBranding({ ...editingBranding, image: data.url });
                                      }
                                    } catch (error) {
                                      console.error("Upload failed:", error);
                                    }
                                  }}
                                />
                                <span className="block w-full text-center py-2 px-4 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                                  <Upload className="w-4 h-4 inline-block mr-2" />
                                  이미지 업로드
                                </span>
                              </label>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              또는 이미지 URL 직접 입력:
                            </div>
                            <Input 
                              value={editingBranding.image || ""} 
                              onChange={(e) => setEditingBranding({ ...editingBranding, image: e.target.value })}
                              placeholder="https://... 이미지 URL"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>링크 URL</Label>
                          <Input 
                            value={editingBranding.linkUrl || ""} 
                            onChange={(e) => setEditingBranding({ ...editingBranding, linkUrl: e.target.value })}
                            placeholder="/subscription 또는 https://..."
                          />
                          <p className="text-xs text-gray-500 mt-1">이미지 클릭 시 이동할 페이지 주소</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="branding-active"
                            checked={editingBranding.isActive}
                            onCheckedChange={(checked) => setEditingBranding({ ...editingBranding, isActive: checked === true })}
                          />
                          <Label htmlFor="branding-active">활성화</Label>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setEditingBranding(null)}>취소</Button>
                          <Button 
                            onClick={() => updateBrandingMutation.mutate({ 
                              key: editingBranding.key, 
                              data: editingBranding 
                            })}
                            disabled={updateBrandingMutation.isPending}
                            className="bg-primary text-white hover:bg-primary/90"
                          >
                            {updateBrandingMutation.isPending ? "저장 중..." : "저장"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </TabsContent>
            </Tabs>
          </div>
        );

      case "cart":
        return <AdminCartContent />;

      case "notifications":
        return <AdminNotificationsContent />;

      default:
        return null;
    }
  };

  const handleNavigate = (path: string) => {
    // URL에서 탭 추출
    const url = new URL(path, window.location.origin);
    const tab = url.searchParams.get("tab");
    if (tab) {
      setActiveMenu(tab);
    }
    setLocation(path);
  };

  return (
    <AdminLayout activeTab={activeMenu} onNavigate={handleNavigate}>
      <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="검색..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">AD</span>
            </div>
            <span className="text-sm font-medium text-gray-900">관리자</span>
          </div>
        </header>

        <main className="p-6">
          {/* Dashboard Stats (Visible on all pages for now, or could be separate dashboard) */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "오늘 매출", value: dashboardStats?.todaySales ? `₩${dashboardStats.todaySales.toLocaleString()}` : "₩0", icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
              { label: "오늘 주문", value: `${dashboardStats?.todayOrders ?? 0}건`, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
              { label: "신규 회원", value: `${dashboardStats?.newMembers ?? 0}명`, icon: UserCheck, color: "bg-amber-50 text-amber-600" },
              { label: "답변 대기", value: `${dashboardStats?.pendingInquiries ?? 0}건`, icon: Clock, color: "bg-red-50 text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {renderContent()}
        </main>
    </AdminLayout>
  );
}