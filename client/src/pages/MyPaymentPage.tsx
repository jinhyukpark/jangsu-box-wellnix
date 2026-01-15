import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CreditCard, Plus, Trash2, Check, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

const initialCards = [
  { id: 1, name: "현대카드", number: "1234", color: "bg-blue-600", isDefault: true },
  { id: 2, name: "삼성카드", number: "5678", color: "bg-indigo-600", isDefault: false },
];

export default function MyPaymentPage() {
  const [, setLocation] = useLocation();
  const [cards, setCards] = useState(initialCards);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [cardNum, setCardNum] = useState({ 1: "", 2: "", 3: "", 4: "" });
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [pwd, setPwd] = useState("");

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate validation
    if (cardNum[1].length < 4 || cardNum[2].length < 4 || cardNum[3].length < 4 || cardNum[4].length < 4) {
      toast.error("카드 번호를 올바르게 입력해주세요.");
      return;
    }

    const newCard = {
      id: Date.now(),
      name: "새로운 카드", // In a real app, detect card type
      number: cardNum[4],
      color: "bg-gray-700",
      isDefault: cards.length === 0,
    };

    setCards([...cards, newCard]);
    setIsAdding(false);
    
    // Reset form
    setCardNum({ 1: "", 2: "", 3: "", 4: "" });
    setExpiry("");
    setCvc("");
    setPwd("");
    
    toast.success("카드가 등록되었습니다.");
  };

  const deleteCard = (id: number) => {
    if (confirm("정말 이 카드를 삭제하시겠습니까?")) {
      setCards(cards.filter(c => c.id !== id));
      toast.success("카드가 삭제되었습니다.");
    }
  };

  const setDefault = (id: number) => {
    setCards(cards.map(c => ({
      ...c,
      isDefault: c.id === id
    })));
    toast.success("기본 결제 수단이 변경되었습니다.");
  };

  return (
    <AppLayout hideNav>
      <SEO title="간편결제 관리 | 웰닉스" description="등록된 결제 수단을 관리하세요." />
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => isAdding ? setIsAdding(false) : setLocation("/mypage")} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">
                {isAdding ? "카드 등록" : "간편결제 관리"}
              </h1>
            </div>
          </div>
        </header>

        <div className="p-4">
          {!isAdding ? (
            <div className="space-y-4">
              {/* Add Card Button */}
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">새 카드 등록하기</span>
              </button>

              {/* Card List */}
              <div className="space-y-3">
                {cards.map((card) => (
                  <div key={card.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 p-4 w-24 h-24 rounded-full -mr-10 -mt-10 opacity-10 ${card.color}`} />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className={`w-5 h-5 ${card.isDefault ? "text-primary" : "text-gray-400"}`} />
                          <span className="font-bold text-gray-800">{card.name}</span>
                          {card.isDefault && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">기본</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!card.isDefault && (
                            <button 
                              onClick={() => setDefault(card.id)}
                              className="text-xs text-gray-500 hover:text-primary underline"
                            >
                              기본으로 설정
                            </button>
                          )}
                          <button 
                            onClick={() => deleteCard(card.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-gray-600 font-mono tracking-wider">
                          **** **** **** {card.number}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4">
              <form onSubmit={handleAddCard} className="space-y-5">
                {/* Visual Card Preview */}
                <div className="w-full aspect-[1.58/1] bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                  <div className="flex justify-between items-start h-full flex-col">
                    <div className="flex justify-between w-full items-center">
                      <div className="w-10 h-6 bg-yellow-500/80 rounded" />
                      <span className="font-medium text-white/80">PREVIEW</span>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-3 text-lg font-mono tracking-widest mb-4">
                        <span>{cardNum[1] || "0000"}</span>
                        <span>{cardNum[2] || "0000"}</span>
                        <span>{cardNum[3] || "0000"}</span>
                        <span>{cardNum[4] || "0000"}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-white/60">
                          VALID THRU<br/>
                          <span className="text-sm text-white font-mono">{expiry || "MM/YY"}</span>
                        </div>
                        <div className="text-sm font-medium">NAME</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카드 번호</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((idx) => (
                      <input
                        key={idx}
                        type="text" // using text for simplicity in handling max length visually, should be tel/number
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="0000"
                        className="flex-1 w-full px-3 py-3 text-center border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                        value={cardNum[idx as keyof typeof cardNum]}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setCardNum({ ...cardNum, [idx]: val });
                          // Auto focus next logic could be added here
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">유효기간</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center font-mono"
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
                        setExpiry(val);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC (뒷면 3자리)</label>
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="●●●"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center font-mono"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카드 비밀번호 (앞 2자리)</label>
                  <input
                    type="password"
                    maxLength={2}
                    placeholder="●●"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  등록 완료
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}