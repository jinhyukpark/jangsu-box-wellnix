import { 
  Package, Users, Gift, Calendar, CreditCard, Truck, MessageSquare, 
  HelpCircle, Settings, ShieldCheck, Award, Home
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const adminMenuItems: AdminMenuItem[] = [
  { id: "members", label: "회원 관리", icon: Users },
  { id: "settings", label: "관리자 설정", icon: ShieldCheck },
  { id: "main-page", label: "메인 페이지 설정", icon: Home },
  { id: "products", label: "상품 관리", icon: Package },
  { id: "brands", label: "브랜드 관리", icon: Award },
  { id: "subscription", label: "장수박스 관리", icon: Gift },
  { id: "events", label: "행사 관리", icon: Calendar },
  { id: "payments", label: "결제 관리", icon: CreditCard },
  { id: "shipping", label: "배송 관리", icon: Truck },
  { id: "inquiries", label: "1:1 문의", icon: MessageSquare },
  { id: "faq", label: "자주묻는질문", icon: HelpCircle },
  { id: "base-settings", label: "기준 정보 관리", icon: Settings },
];
