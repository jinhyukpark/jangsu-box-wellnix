import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, Mail, MessageSquare, Info } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function MyNotificationsPage() {
  const [, setLocation] = useLocation();
  
  // Mock settings state
  const [settings, setSettings] = useState({
    email: {
      marketing: true,
      order: true,
      restock: false
    },
    sms: {
      marketing: false,
      order: true,
      restock: true
    }
  });

  const handleToggle = (type: 'email' | 'sms', category: 'marketing' | 'order' | 'restock') => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [type]: {
          ...prev[type],
          [category]: !prev[type][category]
        }
      };
      
      // Simulate API call
      toast.success("알림 설정이 변경되었습니다.");
      return newSettings;
    });
  };

  const handleAllToggle = (checked: boolean) => {
    setSettings({
      email: {
        marketing: checked,
        order: checked,
        restock: checked
      },
      sms: {
        marketing: checked,
        order: checked,
        restock: checked
      }
    });
    toast.success(checked ? "모든 알림이 켜졌습니다." : "모든 알림이 꺼졌습니다.");
  };

  return (
    <AppLayout hideNav>
      <SEO title="알림 설정 | 웰닉스" description="알림 수신 동의 및 설정을 관리하세요." />
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLocation("/mypage")} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">알림 설정</h1>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-6">
          {/* Main Toggle */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">전체 알림 설정</h2>
                <p className="text-xs text-gray-500">모든 알림을 한번에 설정합니다</p>
              </div>
            </div>
            <Switch 
              checked={Object.values(settings.email).every(Boolean) && Object.values(settings.sms).every(Boolean)}
              onCheckedChange={handleAllToggle}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              이메일 알림
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <div className="font-medium text-gray-900">주문/배송 정보</div>
                  <div className="text-xs text-gray-500">주문 상태 및 배송 현황 안내</div>
                </div>
                <Switch 
                  checked={settings.email.order}
                  onCheckedChange={() => handleToggle('email', 'order')}
                />
              </div>
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <div className="font-medium text-gray-900">재입고 알림</div>
                  <div className="text-xs text-gray-500">품절 상품 재입고 시 안내</div>
                </div>
                <Switch 
                  checked={settings.email.restock}
                  onCheckedChange={() => handleToggle('email', 'restock')}
                />
              </div>
              <div className="p-4 flex items-center justify-between bg-gray-50/50">
                <div>
                  <div className="font-medium text-gray-900">혜택 및 이벤트 (광고성)</div>
                  <div className="text-xs text-gray-500">특가, 쿠폰, 이벤트 소식 안내</div>
                </div>
                <Switch 
                  checked={settings.email.marketing}
                  onCheckedChange={() => handleToggle('email', 'marketing')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              문자(SMS)/알림톡
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <div className="font-medium text-gray-900">주문/배송 정보</div>
                  <div className="text-xs text-gray-500">주문 상태 및 배송 현황 안내</div>
                </div>
                <Switch 
                  checked={settings.sms.order}
                  onCheckedChange={() => handleToggle('sms', 'order')}
                />
              </div>
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <div className="font-medium text-gray-900">재입고 알림</div>
                  <div className="text-xs text-gray-500">품절 상품 재입고 시 안내</div>
                </div>
                <Switch 
                  checked={settings.sms.restock}
                  onCheckedChange={() => handleToggle('sms', 'restock')}
                />
              </div>
              <div className="p-4 flex items-center justify-between bg-gray-50/50">
                <div>
                  <div className="font-medium text-gray-900">혜택 및 이벤트 (광고성)</div>
                  <div className="text-xs text-gray-500">특가, 쿠폰, 이벤트 소식 안내</div>
                </div>
                <Switch 
                  checked={settings.sms.marketing}
                  onCheckedChange={() => handleToggle('sms', 'marketing')}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 flex gap-3 text-xs text-gray-500">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              서비스 이용에 반드시 필요한 주문/배송 안내 및 결제 관련 중요 정보는 
              수신 동의 여부와 관계없이 발송됩니다.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}