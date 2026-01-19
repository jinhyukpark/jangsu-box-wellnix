import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Clock, Heart, Shield, Truck, Award, X } from "lucide-react";

interface CustomerServicePopupProps {
  open: boolean;
  onClose: () => void;
}

export function CustomerServicePopup({ open, onClose }: CustomerServicePopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white rounded-2xl">
        <div className="relative">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 pb-8">
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-1">웰닉스 고객센터</h2>
              <p className="text-white/80 text-sm">언제나 고객님의 건강한 삶을 응원합니다</p>
            </div>
          </div>
          
          <div className="p-5 -mt-4">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-gray-100">
              <div className="text-center mb-3">
                <p className="text-3xl font-bold text-primary tracking-wide">1588-0000</p>
                <p className="text-sm text-gray-500 mt-1">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
              </div>
              
              <a href="tel:1588-0000" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl">
                  <Phone className="w-4 h-4 mr-2" />
                  지금 전화하기
                </Button>
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <a href="/support" onClick={onClose} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">1:1 문의</p>
                  <p className="text-xs text-gray-500">24시간 접수</p>
                </div>
              </a>
              
              <a href="/faq" onClick={onClose} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">자주묻는질문</p>
                  <p className="text-xs text-gray-500">빠른 해결</p>
                </div>
              </a>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 text-center mb-3">웰닉스가 약속드립니다</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-[10px] text-gray-600">정성 가득</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-[10px] text-gray-600">품질 보증</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Truck className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-[10px] text-gray-600">빠른 배송</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-[10px] text-gray-600">최상 품질</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
