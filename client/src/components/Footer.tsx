import { Link } from "wouter";

interface FooterProps {
  onCustomerServiceClick?: () => void;
}

export function Footer({ onCustomerServiceClick }: FooterProps) {
  return (
    <div className="border-t border-gray-200">
      <div className="bg-primary/5 p-5 border-b border-primary/10">
        <h3 className="text-base font-semibold text-primary">고객센터</h3>
        <p className="text-xl font-bold text-gray-900 mt-1">1644-3684</p>
        
        <div className="mt-3 space-y-1 text-sm text-gray-700">
          <p>운영 시간  10:00 ~ 18:00</p>
          <p>재정비 시간  12:30 ~ 13:30</p>
          <p className="text-gray-500">※ 주말 및 공휴일 휴무</p>
        </div>
        
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700">웰닉스 (주)</h4>
          <div className="mt-3 space-y-1.5 text-xs text-gray-500">
            <p><span className="text-gray-400 mr-2">대표자</span>홍길동</p>
            <p><span className="text-gray-400 mr-2">개인정보 관리 책임자</span>김웰닉</p>
            <p><span className="text-gray-400 mr-2">사업자 등록번호</span>123-45-67890</p>
            <p><span className="text-gray-400 mr-2">통신판매업 신고번호</span>2024-서울강남-0000</p>
            <p><span className="text-gray-400 mr-2">팩스</span>02-1234-5678</p>
            <p className="pt-2 text-gray-600">서울특별시 강남구 테헤란로 123 웰닉스타워 10층</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 px-5 py-4 pb-20">
        <p className="text-xs text-gray-400">
          Copyright by Wellnix Inc. All rights reserved
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <Link href="/terms" className="hover:underline">이용약관</Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy" className="hover:underline">개인정보처리방침</Link>
          <span className="text-gray-300">|</span>
          <button onClick={onCustomerServiceClick} className="hover:underline">제휴 문의</button>
          <span className="text-gray-300">|</span>
          <Link href="/corporate" className="hover:underline">기업 구매</Link>
          <span className="text-gray-300">|</span>
          <Link href="/support" className="hover:underline">고객센터</Link>
        </div>
      </div>
    </div>
  );
}
