import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Search, MapPin, Trash2, Edit2, Check } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

// Mock data
const initialAddresses = [
  {
    id: 1,
    name: "우리집",
    recipient: "홍길동",
    phone: "010-1234-5678",
    zipCode: "06234",
    address: "서울특별시 강남구 테헤란로 123",
    detailAddress: "웰닉스 아파트 101동 1204호",
    isDefault: true
  },
  {
    id: 2,
    name: "부모님 댁",
    recipient: "홍판서",
    phone: "010-9876-5432",
    zipCode: "04521",
    address: "서울특별시 중구 세종대로 456",
    detailAddress: "효도빌라 202호",
    isDefault: false
  },
  {
    id: 3,
    name: "회사",
    recipient: "홍길동",
    phone: "010-1234-5678",
    zipCode: "13494",
    address: "경기도 성남시 분당구 판교로 789",
    detailAddress: "웰닉스 타워 5층",
    isDefault: false
  }
];

export default function MyShippingPage() {
  const [, setLocation] = useLocation();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    recipient: "",
    phone: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    isDefault: false
  });

  const filteredAddresses = useMemo(() => {
    return addresses.filter(addr => 
      addr.name.includes(searchQuery) || 
      addr.recipient.includes(searchQuery) || 
      addr.address.includes(searchQuery)
    );
  }, [addresses, searchQuery]);

  const resetForm = () => {
    setFormData({
      name: "",
      recipient: "",
      phone: "",
      zipCode: "",
      address: "",
      detailAddress: "",
      isDefault: false
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (addresses.length >= 100 && !editingId) {
      toast.error("배송지는 최대 100개까지만 등록 가능합니다.");
      return;
    }

    if (!formData.name || !formData.recipient || !formData.phone || !formData.address) {
      toast.error("필수 정보를 모두 입력해주세요.");
      return;
    }

    let newAddresses = [...addresses];

    if (formData.isDefault) {
      newAddresses = newAddresses.map(addr => ({ ...addr, isDefault: false }));
    }

    if (editingId) {
      // Edit mode
      newAddresses = newAddresses.map(addr => 
        addr.id === editingId ? { ...formData, id: editingId } : addr
      );
      toast.success("배송지가 수정되었습니다.");
    } else {
      // Add mode
      const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
      newAddresses.push({ ...formData, id: newId });
      toast.success("새 배송지가 등록되었습니다.");
    }

    // Ensure at least one default
    if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
        newAddresses[0].isDefault = true;
    }

    setAddresses(newAddresses);
    resetForm();
  };

  const handleEdit = (addr: typeof initialAddresses[0]) => {
    setFormData(addr);
    setEditingId(addr.id);
    setIsAdding(true);
  };

  const handleDelete = (id: number) => {
    if (addresses.find(a => a.id === id)?.isDefault) {
      toast.error("기본 배송지는 삭제할 수 없습니다.");
      return;
    }
    
    if (confirm("정말 이 배송지를 삭제하시겠습니까?")) {
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success("배송지가 삭제되었습니다.");
    }
  };

  return (
    <AppLayout hideNav>
      <SEO title="배송지 관리 | 웰닉스" description="등록된 배송지를 관리하세요." />
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => isAdding ? resetForm() : setLocation("/mypage")} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">
                {isAdding ? (editingId ? "배송지 수정" : "배송지 등록") : "배송지 관리"}
              </h1>
            </div>
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="text-primary font-medium text-sm hover:bg-primary/5 px-2 py-1 rounded transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        <div className="p-4">
          {isAdding ? (
            <form onSubmit={handleSave} className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 animate-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배송지 이름</label>
                <input
                  type="text"
                  placeholder="예: 우리집, 회사"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">받는 사람</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={formData.recipient}
                    onChange={e => setFormData({...formData, recipient: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="우편번호"
                    readOnly
                    className="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                    value={formData.zipCode}
                    onChange={e => setFormData({...formData, zipCode: e.target.value})}
                  />
                  <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    주소 찾기
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="기본 주소"
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 mb-2"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="상세 주소 입력"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.detailAddress}
                  onChange={e => setFormData({...formData, detailAddress: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="default-check"
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.isDefault}
                  onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                />
                <label htmlFor="default-check" className="text-sm text-gray-700">기본 배송지로 설정</label>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors mt-4"
              >
                저장하기
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="받는 사람, 주소, 배송지명 검색"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 px-1">
                <span>총 <span className="text-primary font-bold">{addresses.length}</span>개 (최대 100개)</span>
              </div>

              {/* Address List */}
              <div className="space-y-3">
                {filteredAddresses.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>등록된 배송지가 없습니다.</p>
                  </div>
                ) : (
                  filteredAddresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`bg-white p-5 rounded-xl border transition-all ${
                        addr.isDefault ? "border-primary ring-1 ring-primary shadow-md" : "border-gray-100 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-medium">기본</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(addr)}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!addr.isDefault && (
                            <button 
                              onClick={() => handleDelete(addr.id)}
                              className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-medium text-gray-800">{addr.recipient} <span className="text-gray-400 mx-1">|</span> {addr.phone}</p>
                        <p className="text-gray-500">[{addr.zipCode}] {addr.address} {addr.detailAddress}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}