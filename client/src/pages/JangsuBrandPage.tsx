import { ArrowLeft, ArrowDown, Gift, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

// Images (generated)
import happySeniorsImage from "@assets/generated_images/happy_korean_seniors_opening_luxury_gift_box.png";
import messageNotificationImage from "@assets/generated_images/smartphone_showing_caring_message_notification.png";
import premiumBoxImage from "@assets/generated_images/premium_korean_health_gift_box_composition.png";

export default function JangsuBrandPage() {
  const [, setLocation] = useLocation();

  return (
    <AppLayout hideNav>
      <SEO 
        title="장수박스 이야기 | 웰닉스" 
        description="부모님께 건강과 사랑을 전하는 최고의 선물, 장수박스를 소개합니다." 
      />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="flex items-center justify-between px-4 h-14 max-w-[430px] mx-auto w-full">
          <button 
            onClick={() => setLocation("/subscription")} 
            className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <span className="font-serif font-bold text-gray-900">JANGSU BOX</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="bg-white min-h-screen pb-24 font-serif">
        
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-14">
          <div className="absolute inset-0 z-0">
            <img 
              src={premiumBoxImage} 
              alt="장수박스 프리미엄 구성" 
              className="w-full h-full object-cover opacity-90 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <span className="block text-primary text-sm font-bold tracking-widest mb-4 uppercase">Premium Gift Service</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-sm">
              선물은 역시,<br />
              <span className="text-primary">장수박스</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed font-sans font-light">
              부모님을 위한 가장 완벽한 효도<br/>
              매달 찾아가는 건강과 사랑의 이야기
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce"
          >
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </section>

        {/* Emotion Section */}
        <section className="py-20 px-6">
          <div className="max-w-lg mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
                "아이고, 뭘 이런 걸 다..."<br/>
                하시면서도 웃음꽃이 피어납니다
              </h2>
              <p className="text-gray-600 leading-relaxed font-sans text-sm">
                매달 현관 앞까지 배달되는 커다란 선물 상자.<br/>
                박스를 여는 순간, 부모님의 얼굴에는<br/>
                자식 생각에 벅찬 행복이 번집니다.<br/><br/>
                장수박스는 단순한 건강식품이 아닙니다.<br/>
                부모님을 생각하는 당신의 <strong>'마음'</strong>입니다.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={happySeniorsImage} alt="행복해하는 부모님" className="w-full h-auto" />
            </motion.div>
          </div>
        </section>

        {/* Care Service Section */}
        <section className="py-20 bg-gray-50 px-6 relative overflow-hidden">
          <div className="max-w-lg mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4 font-sans">
                <ShieldCheck className="w-4 h-4" />
                안심 케어 서비스
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                부모님의 안부를<br/>
                대신 전해드립니다
              </h2>
              <p className="text-gray-600 leading-relaxed font-sans text-sm">
                잘 지내시는지, 식사는 잘 하시는지 걱정되시죠?<br/>
                장수박스 케어 매니저가 배송 확인과 함께<br/>
                부모님의 안부를 확인하여 자녀분께 알려드립니다.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto w-64 md:w-72"
            >
              <img src={messageNotificationImage} alt="안부 메시지 알림" className="w-full h-auto drop-shadow-2xl rounded-[2rem] border-4 border-gray-900" />
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -right-8 top-20 bg-white p-3 rounded-2xl shadow-lg flex items-center gap-3 border border-gray-100 max-w-[200px]"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="font-sans">
                  <p className="text-[10px] text-gray-500">케어 매니저</p>
                  <p className="text-xs font-bold text-gray-900">어머님이 정말 좋아하셨어요!</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Philosophy / Slogan Section */}
        <section className="py-24 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="w-16 h-1 bg-primary mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
              건강을 담고,<br/>
              사랑을 채우고,<br/>
              안심을 전하다.
            </h2>
            <p className="text-gray-500 font-sans text-sm tracking-wide uppercase mb-12">
              All in one package
            </p>
            
            <div className="relative inline-block">
              <span className="absolute -inset-1 bg-primary/20 blur-lg rounded-full" />
              <h3 className="relative text-xl font-bold text-primary font-sans bg-white px-6 py-2 rounded-full border border-primary/20">
                이 모든 것이 <span className="text-primary font-black">장수박스</span>입니다
              </h3>
            </div>
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50 max-w-[430px] mx-auto">
          <button 
            onClick={() => setLocation("/subscription")}
            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            부모님께 마음 전하러 가기
          </button>
        </div>

      </div>
    </AppLayout>
  );
}