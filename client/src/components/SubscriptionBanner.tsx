import happySeniorsImage from "@assets/generated_images/happy_seniors_opening_gift_box.png";

export function SubscriptionBanner() {
  return (
    <div className="mx-4 my-5 rounded overflow-hidden relative">
      <img 
        src={happySeniorsImage} 
        alt="장수박스를 받은 행복한 부모님"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <p className="text-amber-300 text-sm font-medium tracking-widest mb-1">JANGSU BOX</p>
        <h3 className="text-white text-xl font-bold mb-2 leading-snug font-serif drop-shadow-lg">
          장수박스는 단순한 선물이 아닌,<br />추억과 마음을 전합니다
        </h3>
        <p className="text-white/80 text-sm drop-shadow">
          매달 부모님께 건강과 사랑을 담아 보내드려요
        </p>
      </div>
    </div>
  );
}