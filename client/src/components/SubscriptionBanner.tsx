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
        <h3 className="text-white text-xl font-bold mb-2 leading-snug font-serif drop-shadow-lg">
          <span className="underline decoration-amber-400 decoration-2 underline-offset-4">장수박스</span>로 부모님께<br />추억과 마음을 전하세요
        </h3>
        <p className="text-white/80 text-sm drop-shadow">
          매달 부모님께 건강과 사랑을 담아 보내드려요
        </p>
      </div>
    </div>
  );
}