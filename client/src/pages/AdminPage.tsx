import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Package, Users, Gift, Calendar, CreditCard, Truck, MessageSquare, 
  ChevronRight, Search, Bell, Settings, LogOut, Menu, X,
  TrendingUp, ShoppingBag, UserCheck, Clock, HelpCircle, Star, ShieldCheck, Loader2, ShieldX
} from "lucide-react";
import { useAdminProducts, useAdminCategories, useAdminMembers, useAdminSubscriptions, useAdminEvents, useAdminInquiries, useAdminFaqs, useAdminList, useDashboardStats, useCreateProduct, useUpdateProduct, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/use-admin";
import { useAdminAuth, useAdminLogout } from "@/hooks/use-admin-auth";
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

const menuItems = [
  { id: "products", label: "상품 관리", icon: Package },
  { id: "members", label: "회원 관리", icon: Users },
  { id: "subscription", label: "장수박스 관리", icon: Gift },
  { id: "events", label: "행사 관리", icon: Calendar },
  { id: "payments", label: "결제 관리", icon: CreditCard },
  { id: "shipping", label: "배송 관리", icon: Truck },
  { id: "inquiries", label: "1:1 문의", icon: MessageSquare },
  { id: "faq", label: "자주묻는질문", icon: HelpCircle },
  { id: "settings", label: "관리자 설정", icon: ShieldCheck },
];

const mockProducts = [
  { id: 1, name: "유기농 현미", category: "곡물", price: 25000, stock: 150, status: "판매중" },
  { id: 2, name: "프리미엄 홍삼 스틱", category: "건강식품", price: 89000, stock: 45, status: "판매중" },
  { id: 3, name: "국산 검은콩", category: "곡물", price: 18000, stock: 0, status: "품절" },
  { id: 4, name: "제주 감귤청", category: "음료", price: 32000, stock: 78, status: "판매중" },
  { id: 5, name: "천연 벌꿀", category: "건강식품", price: 45000, stock: 23, status: "판매중" },
];

const mockMembers = [
  { id: 1, name: "김영수", email: "kim@example.com", phone: "010-1234-5678", joinDate: "2025-10-15", status: "활성", subscription: "장수박스", address: "서울시 강남구 테헤란로 123" },
  { id: 2, name: "이미영", email: "lee@example.com", phone: "010-2345-6789", joinDate: "2025-11-02", status: "활성", subscription: "효심박스", address: "경기도 성남시 분당구 정자동 456" },
  { id: 3, name: "박철수", email: "park@example.com", phone: "010-3456-7890", joinDate: "2025-12-20", status: "휴면", subscription: "-", address: "부산시 해운대구 우동 789" },
  { id: 4, name: "최지현", email: "choi@example.com", phone: "010-4567-8901", joinDate: "2026-01-05", status: "활성", subscription: "천수박스", address: "대구시 수성구 범어동 101" },
];

const mockSubscriptions = [
  { id: 1, member: "김영수", plan: "장수박스", startDate: "2025-10-15", nextDelivery: "2026-02-01", status: "활성", amount: 159000 },
  { id: 2, member: "이미영", plan: "효심박스", startDate: "2025-11-02", nextDelivery: "2026-02-01", status: "활성", amount: 89000 },
  { id: 3, member: "최지현", plan: "천수박스", startDate: "2026-01-05", nextDelivery: "2026-02-05", status: "활성", amount: 289000 },
  { id: 4, member: "정민호", plan: "장수박스", startDate: "2025-08-10", nextDelivery: "-", status: "해지", amount: 159000 },
];

const mockEvents = [
  { 
    id: 1, 
    title: "2026 건강한 설맞이 특별 세미나", 
    date: "2026-01-25", 
    location: "서울 강남구", 
    participants: 127, 
    max: 150, 
    status: "모집중",
    description: "설 명절을 맞이하여 부모님 건강 관리 비법과 명절 증후군 예방 스트레칭을 배우는 특별 세미나입니다.",
    participantList: [
      { name: "김영수", phone: "010-1234-5678", status: "신청완료" },
      { name: "이미영", phone: "010-2345-6789", status: "신청완료" },
      { name: "박철수", phone: "010-3456-7890", status: "취소" },
    ]
  },
  { 
    id: 2, 
    title: "시니어 요가 & 명상 클래스", 
    date: "2026-02-05", 
    location: "온라인 ZOOM", 
    participants: 89, 
    max: 100, 
    status: "모집중",
    description: "집에서 쉽게 따라할 수 있는 시니어 맞춤 요가와 마음의 평화를 찾는 명상 클래스입니다.",
    participantList: [
      { name: "최지현", phone: "010-4567-8901", status: "신청완료" },
    ]
  },
  { 
    id: 3, 
    title: "홍삼 건강법 특강", 
    date: "2026-03-15", 
    location: "부산 해운대", 
    participants: 80, 
    max: 80, 
    status: "마감",
    description: "홍삼의 효능과 올바른 섭취 방법에 대해 알아보는 건강 특강입니다.",
    participantList: []
  },
];

const mockPayments = [
  { id: "PAY-20260112-001", member: "김영수", amount: 159000, method: "카드", status: "완료", date: "2026-01-12" },
  { id: "PAY-20260111-002", member: "이미영", amount: 89000, method: "카드", status: "완료", date: "2026-01-11" },
  { id: "PAY-20260110-003", member: "최지현", amount: 289000, method: "계좌이체", status: "완료", date: "2026-01-10" },
  { id: "PAY-20260109-004", member: "박민수", amount: 45000, method: "카드", status: "환불", date: "2026-01-09" },
];

const mockShipping = [
  { id: "SHP-20260112-001", member: "김영수", address: "서울시 강남구 테헤란로 123", status: "배송중", trackingNo: "1234567890", date: "2026-01-12" },
  { id: "SHP-20260111-002", member: "이미영", address: "경기도 성남시 분당구 정자동 456", status: "배송완료", trackingNo: "2345678901", date: "2026-01-11" },
  { id: "SHP-20260110-003", member: "최지현", address: "부산시 해운대구 우동 789", status: "배송준비", trackingNo: "-", date: "2026-01-10" },
];

const mockInquiries = [
  { id: 1, member: "김영수", subject: "배송 지연 문의", category: "배송", status: "답변대기", date: "2026-01-12" },
  { id: 2, member: "이미영", subject: "구독 해지 방법", category: "구독", status: "답변완료", date: "2026-01-11" },
  { id: 3, member: "박철수", subject: "상품 교환 요청", category: "교환/반품", status: "처리중", date: "2026-01-10" },
  { id: 4, member: "최지현", subject: "결제 오류", category: "결제", status: "답변대기", date: "2026-01-09" },
];

const mockFAQs = [
  { id: 1, category: "장수박스", question: "장수박스 구독은 어떻게 신청하나요?", status: "게시중" },
  { id: 2, category: "배송", question: "배송 기간은 얼마나 걸리나요?", status: "게시중" },
  { id: 3, category: "교환/환불", question: "단순 변심으로 인한 반품이 가능한가요?", status: "게시중" },
  { id: 4, category: "기타", question: "회원 탈퇴는 어떻게 하나요?", status: "숨김" },
];

const mockAdmins = [
  { 
    id: 1, 
    name: "최고관리자", 
    email: "admin@wellnix.com", 
    role: "슈퍼 관리자", 
    status: "활성",
    lastLogin: "2026-01-15 10:30",
    permissions: ["all"]
  },
  { 
    id: 2, 
    name: "김철수", 
    email: "cs@wellnix.com", 
    role: "CS 매니저", 
    status: "활성",
    lastLogin: "2026-01-15 09:15",
    permissions: ["inquiries", "members", "faq"]
  },
  { 
    id: 3, 
    name: "이영희", 
    email: "md@wellnix.com", 
    role: "MD", 
    status: "활성",
    lastLogin: "2026-01-14 18:20",
    permissions: ["products", "events", "subscription"]
  },
];

// Mock data for member details
const mockMemberHistory = {
  orders: [
    { id: "ORD-001", product: "장수박스 1월호", date: "2026-01-12", amount: 159000, status: "배송중" },
    { id: "ORD-002", product: "프리미엄 홍삼 스틱", date: "2025-12-24", amount: 89000, status: "배송완료" },
    { id: "ORD-003", product: "유기농 현미 5kg", date: "2025-11-15", amount: 25000, status: "배송완료" },
  ],
  reviews: [
    { id: 1, product: "프리미엄 홍삼 스틱", rating: 5, content: "부모님이 너무 좋아하세요. 포장도 고급스럽고 맛도 진합니다.", date: "2026-01-05" },
    { id: 2, product: "장수박스 12월호", rating: 4, content: "구성이 알차서 좋았는데 배송이 하루 늦었어요.", date: "2025-12-28" },
  ],
  events: [
    { title: "2026 건강한 설맞이 특별 세미나", date: "2026-01-25", status: "신청완료" },
    { title: "홍삼 건강법 특강", date: "2025-11-20", status: "참여완료" },
  ]
};

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("all");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
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
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    displayOrder: 0,
    isActive: true,
    image: ""
  });

  const { data: authData, isLoading: authLoading, isFetching: authFetching } = useAdminAuth();
  const logoutMutation = useAdminLogout();

  const { data: products = [], isLoading: productsLoading } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const { data: members = [], isLoading: membersLoading } = useAdminMembers();
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useAdminSubscriptions();
  const { data: events = [], isLoading: eventsLoading } = useAdminEvents();
  const { data: inquiriesData = [], isLoading: inquiriesLoading } = useAdminInquiries();
  const { data: faqsData = [], isLoading: faqsLoading } = useAdminFaqs();
  const { data: adminsData = [], isLoading: adminsLoading } = useAdminList();
  const { data: dashboardStats } = useDashboardStats();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "로그아웃 완료",
        description: "관리자 로그인 페이지로 이동합니다.",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "로그아웃 실패",
        description: "다시 시도해주세요.",
      });
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

  const openEditCategoryModal = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || "",
      slug: category.slug || "",
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive ?? true,
      image: category.image || ""
    });
    setIsCategoryModalOpen(true);
  };

  if (authLoading || authFetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authData?.admin) {
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

  const currentAdmin = authData.admin;

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

        const filteredProducts = products.filter((product) => {
          const matchesSearch = productSearchQuery === "" || 
            product.name.toLowerCase().includes(productSearchQuery.toLowerCase());
          const matchesStatus = productStatusFilter === "all" || product.status === productStatusFilter;
          const matchesCategory = productCategoryFilter === "all" || 
            product.categoryId?.toString() === productCategoryFilter;
          return matchesSearch && matchesStatus && matchesCategory;
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

        const openEditModal = (product: any) => {
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
                  <div className="flex flex-wrap gap-3 flex-1">
                    <div className="relative flex-1 min-w-[200px]">
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
                      <SelectTrigger className="w-[140px]" data-testid="select-product-status">
                        <SelectValue placeholder="상태 필터" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="active">판매중</SelectItem>
                        <SelectItem value="pending">검수중</SelectItem>
                        <SelectItem value="inactive">대기중</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
                      <SelectTrigger className="w-[160px]" data-testid="select-product-category">
                        <SelectValue placeholder="카테고리 필터" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 카테고리</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => {
                      resetProductForm();
                      setIsProductModalOpen(true);
                    }}
                    className="bg-primary text-white ml-3"
                    data-testid="button-add-product"
                  >
                    + 상품 등록
                  </Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상품명</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">카테고리</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">가격</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">재고</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
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
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => openEditModal(product)}
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
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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
                      <Label htmlFor="product-price">가격</Label>
                      <Input
                        id="product-price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        data-testid="input-product-price"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-original-price">원가</Label>
                      <Input
                        id="product-original-price"
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: parseInt(e.target.value) || 0 })}
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
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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
                        <Label htmlFor="category-image">이미지 URL (선택)</Label>
                        <Input
                          id="category-image"
                          value={categoryForm.image}
                          onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                          placeholder="이미지 URL"
                          data-testid="input-category-image"
                        />
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
                                        <p className="text-sm text-gray-900">{selectedMember?.joinDate}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">주소</p>
                                        <p className="text-sm text-gray-900">{selectedMember?.address}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">구독 정보</h3>
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                        <Gift className="w-6 h-6" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          현재 <span className="text-primary font-bold">{selectedMember?.subscription}</span> 이용 중
                                        </p>
                                        <p className="text-xs text-gray-500">다음 결제일: 2026-02-01</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="orders" className="mt-0">
                                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                                    <table className="w-full">
                                      <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                          <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">주문번호</th>
                                          <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">상품명</th>
                                          <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">금액</th>
                                          <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">상태</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {mockMemberHistory.orders.map((order, i) => (
                                          <tr key={i}>
                                            <td className="px-4 py-3 text-xs font-mono text-gray-500">{order.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                              {order.product}
                                              <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{order.amount.toLocaleString()}원</td>
                                            <td className="px-4 py-3">
                                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                {order.status}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </TabsContent>

                                <TabsContent value="reviews" className="mt-0 space-y-4">
                                  {mockMemberHistory.reviews.map((review, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">{review.product}</p>
                                          <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                              <Star 
                                                key={i} 
                                                className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-gray-200 fill-gray-200"}`} 
                                              />
                                            ))}
                                          </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                                    </div>
                                  ))}
                                </TabsContent>

                                <TabsContent value="events" className="mt-0 space-y-3">
                                  {mockMemberHistory.events.map((event, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                                      <div>
                                        <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                                      </div>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        event.status === "신청완료" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                      }`}>
                                        {event.status}
                                      </span>
                                    </div>
                                  ))}
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
        if (subscriptionsLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">장수박스 관리</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option>전체 플랜</option>
                  <option>효심박스</option>
                  <option>장수박스</option>
                  <option>천수박스</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">플랜</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">구독 시작</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">다음 배송</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">금액</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => {
                    const statusText = getSubscriptionStatus(sub.status);
                    return (
                      <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{sub.member?.name || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{sub.plan?.name || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sub.startDate)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sub.nextDeliveryDate)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{(sub.plan?.price || 0).toLocaleString()}원</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            statusText === "활성" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-primary hover:underline">관리</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "events":
        if (eventsLoading) return <div className="text-center py-8 text-gray-500">로딩중...</div>;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">행사 관리</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
                + 행사 등록
              </button>
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
                    return (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{event.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(event.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{event.location || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{event.currentParticipants || 0}/{event.maxParticipants || 0}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            statusText === "모집중" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button 
                                className="text-sm text-primary hover:underline"
                                onClick={() => setSelectedEvent(event)}
                              >
                                상세보기
                              </button>
                            </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-gray-900">{selectedEvent?.title}</DialogTitle>
                              <DialogDescription className="text-gray-500">
                                행사 상세 정보와 참여자 명단을 확인하세요.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 pt-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-sm text-gray-900 mb-2">행사 소개</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {selectedEvent?.description}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center justify-between">
                                  <span>참여자 명단</span>
                                  <span className="text-xs font-normal text-gray-500">
                                    총 {selectedEvent?.participantList.length}명
                                  </span>
                                </h4>
                                <div className="border rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                      <tr>
                                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">이름</th>
                                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">연락처</th>
                                        <th className="text-right text-xs font-medium text-gray-500 px-4 py-2">상태</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {selectedEvent?.participantList.length === 0 ? (
                                        <tr>
                                          <td colSpan={3} className="text-center py-4 text-xs text-gray-400">
                                            참여자가 없습니다.
                                          </td>
                                        </tr>
                                      ) : (
                                        selectedEvent?.participantList.map((participant: any, i: number) => (
                                          <tr key={i}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{participant.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600">{participant.phone}</td>
                                            <td className="px-4 py-2 text-right">
                                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                participant.status === "신청완료" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                              }`}>
                                                {participant.status}
                                              </span>
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
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
                  {mockPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">{payment.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.member}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{payment.amount.toLocaleString()}원</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.method}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === "완료" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-primary hover:underline">상세</button>
                      </td>
                    </tr>
                  ))}
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
                  {mockShipping.map((ship) => (
                    <tr key={ship.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">{ship.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ship.member}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{ship.address}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{ship.trackingNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ship.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          ship.status === "배송완료" ? "bg-green-100 text-green-700" 
                          : ship.status === "배송중" ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                        }`}>
                          {ship.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-primary hover:underline">추적</button>
                      </td>
                    </tr>
                  ))}
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
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                    + FAQ 등록
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">FAQ 등록</DialogTitle>
                    <DialogDescription className="text-gray-500">
                      자주 묻는 질문과 답변을 등록하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                        <option>선택하세요</option>
                        <option>장수박스</option>
                        <option>배송</option>
                        <option>행사/이벤트</option>
                        <option>교환/환불</option>
                        <option>기타</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
                      <input 
                        type="text" 
                        placeholder="질문을 입력하세요" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">답변</label>
                      <textarea 
                        rows={5}
                        placeholder="답변 내용을 입력하세요" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                        즉시 게시
                      </label>
                    </div>
                    <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90">
                      등록하기
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {faqsLoading ? (
              <div className="text-center py-8 text-gray-500">로딩중...</div>
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
                    {faqsData.map((faq) => {
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
                            <button className="text-sm text-primary hover:underline mr-3">수정</button>
                            <button className="text-sm text-red-500 hover:underline">삭제</button>
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
                        {menuItems.filter(item => item.id !== "settings").map((item) => (
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
                                const label = menuItems.find(m => m.id === perm)?.label || perm;
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

      default:
        return null;
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
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeMenu === item.id 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          {sidebarOpen && (
            <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">로그인됨</p>
              <p className="text-sm font-medium text-gray-900 truncate">{currentAdmin.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentAdmin.email}</p>
            </div>
          )}
          {sidebarOpen ? (
            <button 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}</span>
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex justify-center py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              data-testid="button-admin-logout-small"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
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
      </div>
    </div>
  );
}