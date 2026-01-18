import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

interface ScheduleItem {
  time: string;
  description: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface Promotion {
  title: string;
  description: string;
}

interface OrganizerInfo {
  company: string;
  contact: string;
  phone: string;
  email: string;
}

export default function AdminEventFormPage() {
  const [, setLocation] = useLocation();
  const [matchEdit, paramsEdit] = useRoute("/admin/events/:id");
  const [matchNew] = useRoute("/admin/events/new");
  const eventId = matchEdit ? parseInt(paramsEdit?.id || "0") : null;
  const isEditing = !!eventId;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    detailedAddress: "",
    tag: "",
    category: "",
    maxParticipants: 0,
    status: "recruiting",
    image: "",
    programSchedule: [] as ScheduleItem[],
    benefits: [] as Benefit[],
    promotions: [] as Promotion[],
    organizerInfo: { company: "", contact: "", phone: "", email: "" } as OrganizerInfo,
    notices: [] as string[],
  });

  const [newScheduleItem, setNewScheduleItem] = useState({ time: "", description: "" });
  const [newBenefit, setNewBenefit] = useState({ icon: "gift", title: "", description: "" });
  const [newPromotion, setNewPromotion] = useState({ title: "", description: "" });
  const [newNotice, setNewNotice] = useState("");

  const { data: existingEvent, isLoading: eventLoading } = useQuery<Event>({
    queryKey: ["/api/events", eventId],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      return res.json();
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingEvent) {
      const dateStr = existingEvent.date ? new Date(existingEvent.date).toISOString().slice(0, 16) : "";
      const endDateStr = existingEvent.endDate ? new Date(existingEvent.endDate).toISOString().slice(0, 16) : "";
      setEventForm({
        title: existingEvent.title || "",
        description: existingEvent.description || "",
        date: dateStr,
        endDate: endDateStr,
        location: existingEvent.location || "",
        detailedAddress: existingEvent.detailedAddress || "",
        tag: existingEvent.tag || "",
        category: existingEvent.category || "",
        maxParticipants: existingEvent.maxParticipants || 0,
        status: existingEvent.status || "recruiting",
        image: existingEvent.image || "",
        programSchedule: (existingEvent.programSchedule as ScheduleItem[]) || [],
        benefits: (existingEvent.benefits as Benefit[]) || [],
        promotions: (existingEvent.promotions as Promotion[]) || [],
        organizerInfo: (existingEvent.organizerInfo as OrganizerInfo) || { company: "", contact: "", phone: "", email: "" },
        notices: (existingEvent.notices as string[]) || [],
      });
    }
  }, [existingEvent]);

  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "행사가 등록되었습니다." });
      setLocation("/admin?tab=events");
    },
    onError: () => {
      toast({ title: "행사 등록에 실패했습니다.", variant: "destructive" });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "행사가 수정되었습니다." });
      setLocation("/admin?tab=events");
    },
    onError: () => {
      toast({ title: "행사 수정에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleSave = async () => {
    if (!eventForm.title || !eventForm.date) {
      toast({ title: "행사명과 시작 일시는 필수입니다.", variant: "destructive" });
      return;
    }
    const payload = {
      title: eventForm.title,
      description: eventForm.description || undefined,
      date: new Date(eventForm.date).toISOString(),
      endDate: eventForm.endDate ? new Date(eventForm.endDate).toISOString() : undefined,
      location: eventForm.location || undefined,
      detailedAddress: eventForm.detailedAddress || undefined,
      tag: eventForm.tag || undefined,
      category: eventForm.category || undefined,
      maxParticipants: eventForm.maxParticipants || undefined,
      status: eventForm.status,
      image: eventForm.image || undefined,
      programSchedule: eventForm.programSchedule.length > 0 ? eventForm.programSchedule : undefined,
      benefits: eventForm.benefits.length > 0 ? eventForm.benefits : undefined,
      promotions: eventForm.promotions.length > 0 ? eventForm.promotions : undefined,
      organizerInfo: eventForm.organizerInfo.company ? eventForm.organizerInfo : undefined,
      notices: eventForm.notices.length > 0 ? eventForm.notices : undefined,
    };
    if (isEditing) {
      updateEventMutation.mutate(payload);
    } else {
      createEventMutation.mutate(payload);
    }
  };

  const addScheduleItem = () => {
    if (newScheduleItem.time && newScheduleItem.description) {
      setEventForm({ ...eventForm, programSchedule: [...eventForm.programSchedule, { ...newScheduleItem }] });
      setNewScheduleItem({ time: "", description: "" });
    }
  };
  const removeScheduleItem = (index: number) => {
    setEventForm({ ...eventForm, programSchedule: eventForm.programSchedule.filter((_, i) => i !== index) });
  };
  const addBenefit = () => {
    if (newBenefit.title && newBenefit.description) {
      setEventForm({ ...eventForm, benefits: [...eventForm.benefits, { ...newBenefit }] });
      setNewBenefit({ icon: "gift", title: "", description: "" });
    }
  };
  const removeBenefit = (index: number) => {
    setEventForm({ ...eventForm, benefits: eventForm.benefits.filter((_, i) => i !== index) });
  };
  const addPromotion = () => {
    if (newPromotion.title && newPromotion.description) {
      setEventForm({ ...eventForm, promotions: [...eventForm.promotions, { ...newPromotion }] });
      setNewPromotion({ title: "", description: "" });
    }
  };
  const removePromotion = (index: number) => {
    setEventForm({ ...eventForm, promotions: eventForm.promotions.filter((_, i) => i !== index) });
  };
  const addNotice = () => {
    if (newNotice.trim()) {
      setEventForm({ ...eventForm, notices: [...eventForm.notices, newNotice.trim()] });
      setNewNotice("");
    }
  };
  const removeNotice = (index: number) => {
    setEventForm({ ...eventForm, notices: eventForm.notices.filter((_, i) => i !== index) });
  };

  if (isEditing && eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">로딩중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => setLocation("/admin?tab=events")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {isEditing ? "행사 수정" : "새 행사 등록"}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>행사명 *</Label>
              <Input 
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="예: 2026 건강한 설맞이 특별 세미나"
              />
            </div>
            <div className="col-span-2">
              <Label>행사 소개</Label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary min-h-[100px]"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="행사 소개를 입력하세요"
              />
            </div>
            <div>
              <Label>시작 일시 *</Label>
              <Input 
                type="datetime-local"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              />
            </div>
            <div>
              <Label>종료 일시</Label>
              <Input 
                type="datetime-local"
                value={eventForm.endDate}
                onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label>장소명</Label>
              <Input 
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="예: 서울 강남구 웰닉스홀"
              />
            </div>
            <div>
              <Label>상세 주소</Label>
              <Input 
                value={eventForm.detailedAddress}
                onChange={(e) => setEventForm({ ...eventForm, detailedAddress: e.target.value })}
                placeholder="예: 서울특별시 강남구 테헤란로 123 웰닉스빌딩 3층"
              />
            </div>
            <div>
              <Label>태그</Label>
              <Input 
                value={eventForm.tag}
                onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value })}
                placeholder="예: 무료 세미나"
              />
            </div>
            <div>
              <Label>카테고리</Label>
              <Input 
                value={eventForm.category}
                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                placeholder="예: 건강 세미나"
              />
            </div>
            <div>
              <Label>최대 참가 인원</Label>
              <Input 
                type="number"
                value={eventForm.maxParticipants}
                onChange={(e) => setEventForm({ ...eventForm, maxParticipants: parseInt(e.target.value) || 0 })}
                placeholder="150"
              />
            </div>
            <div>
              <Label>상태</Label>
              <select 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                value={eventForm.status}
                onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
              >
                <option value="recruiting">모집중</option>
                <option value="closed">모집마감</option>
                <option value="ongoing">진행중</option>
                <option value="completed">종료</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label>행사 이미지 URL</Label>
              <Input 
                value={eventForm.image}
                onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                placeholder="이미지 URL을 입력하세요"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-bold">프로그램 일정</Label>
            <div className="flex gap-2 mt-3 mb-3">
              <Input 
                value={newScheduleItem.time}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                placeholder="시간 (예: 14:00)"
                className="w-28"
              />
              <Input 
                value={newScheduleItem.description}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, description: e.target.value })}
                placeholder="프로그램 내용"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addScheduleItem}>추가</Button>
            </div>
            <div className="space-y-2">
              {eventForm.programSchedule.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-primary w-20">{item.time}</span>
                  <span className="text-sm text-gray-700 flex-1">{item.description}</span>
                  <button onClick={() => removeScheduleItem(i)} className="text-red-500 hover:text-red-700 text-lg">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-bold">참가자 혜택</Label>
            <div className="flex gap-2 mt-3 mb-3">
              <select 
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-28"
                value={newBenefit.icon}
                onChange={(e) => setNewBenefit({ ...newBenefit, icon: e.target.value })}
              >
                <option value="gift">선물</option>
                <option value="food">간식</option>
                <option value="parking">주차</option>
                <option value="ticket">티켓</option>
              </select>
              <Input 
                value={newBenefit.title}
                onChange={(e) => setNewBenefit({ ...newBenefit, title: e.target.value })}
                placeholder="혜택명"
                className="w-36"
              />
              <Input 
                value={newBenefit.description}
                onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                placeholder="설명"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addBenefit}>추가</Button>
            </div>
            <div className="space-y-2">
              {eventForm.benefits.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{item.title}</span>
                  <span className="text-sm text-gray-500">- {item.description}</span>
                  <button onClick={() => removeBenefit(i)} className="ml-auto text-red-500 hover:text-red-700 text-lg">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-bold">특별 프로모션</Label>
            <div className="flex gap-2 mt-3 mb-3">
              <Input 
                value={newPromotion.title}
                onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                placeholder="프로모션명"
                className="w-52"
              />
              <Input 
                value={newPromotion.description}
                onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                placeholder="설명"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addPromotion}>추가</Button>
            </div>
            <div className="space-y-2">
              {eventForm.promotions.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <span className="text-sm font-medium text-amber-800">{item.title}</span>
                  <span className="text-sm text-amber-600">- {item.description}</span>
                  <button onClick={() => removePromotion(i)} className="ml-auto text-red-500 hover:text-red-700 text-lg">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-bold">주최측 정보</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <Label className="text-sm">회사/단체명</Label>
                <Input 
                  value={eventForm.organizerInfo.company}
                  onChange={(e) => setEventForm({ ...eventForm, organizerInfo: { ...eventForm.organizerInfo, company: e.target.value } })}
                  placeholder="예: 웰닉스 헬스케어"
                />
              </div>
              <div>
                <Label className="text-sm">담당자</Label>
                <Input 
                  value={eventForm.organizerInfo.contact}
                  onChange={(e) => setEventForm({ ...eventForm, organizerInfo: { ...eventForm.organizerInfo, contact: e.target.value } })}
                  placeholder="예: 김건강 매니저"
                />
              </div>
              <div>
                <Label className="text-sm">연락처</Label>
                <Input 
                  value={eventForm.organizerInfo.phone}
                  onChange={(e) => setEventForm({ ...eventForm, organizerInfo: { ...eventForm.organizerInfo, phone: e.target.value } })}
                  placeholder="예: 02-1234-5678"
                />
              </div>
              <div>
                <Label className="text-sm">이메일</Label>
                <Input 
                  value={eventForm.organizerInfo.email}
                  onChange={(e) => setEventForm({ ...eventForm, organizerInfo: { ...eventForm.organizerInfo, email: e.target.value } })}
                  placeholder="예: event@wellnix.co.kr"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-bold">안내사항</Label>
            <div className="flex gap-2 mt-3 mb-3">
              <Input 
                value={newNotice}
                onChange={(e) => setNewNotice(e.target.value)}
                placeholder="안내사항 내용"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNotice())}
              />
              <Button type="button" variant="outline" onClick={addNotice}>추가</Button>
            </div>
            <ul className="space-y-2">
              {eventForm.notices.map((notice, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <span>•</span>
                  <span className="flex-1">{notice}</span>
                  <button onClick={() => removeNotice(i)} className="text-red-500 hover:text-red-700 text-lg">×</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setLocation("/admin?tab=events")}>취소</Button>
            <Button 
              onClick={handleSave}
              disabled={createEventMutation.isPending || updateEventMutation.isPending}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {(createEventMutation.isPending || updateEventMutation.isPending) ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
