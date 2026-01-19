import { Link } from "wouter";

interface FooterProps {
  onCustomerServiceClick?: () => void;
}

export function Footer({ onCustomerServiceClick }: FooterProps) {
  return (
    <div className="bg-white border-t border-gray-100">
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900">고객센터</h3>
        <p className="text-xl font-bold text-gray-900 mt-1">1644-3684</p>
        
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <p>운영 시간  10:00 ~ 18:00</p>
          <p>재정비 시간  12:30 ~ 13:30</p>
          <p className="text-gray-400">※ 주말 및 공휴일 휴무</p>
        </div>
        
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-gray-700">웰닉스 (주)</h4>
          <div className="mt-2 space-y-1 text-xs text-gray-500">
            <p><span className="text-gray-400">대표자</span>  홍길동</p>
            <p><span className="text-gray-400">개인정보 관리 책임자</span>  김웰닉</p>
            <p><span className="text-gray-400">사업자 등록번호</span>  123-45-67890</p>
            <p><span className="text-gray-400">통신판매업 신고번호</span>  2024-서울강남-0000</p>
            <p><span className="text-gray-400">팩스</span>  02-1234-5678</p>
            <p className="pt-1">서울특별시 강남구 테헤란로 123 웰닉스타워 10층</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 px-5 py-4 pb-20">
        <p className="text-xs text-gray-400">
          Copyright by Wellnix Inc. All rights reserved
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <Link href="/terms"><a className="hover:underline">이용약관</a></Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy"><a className="hover:underline">개인정보처리방침</a></Link>
          <span className="text-gray-300">|</span>
          <button onClick={onCustomerServiceClick} className="hover:underline">제휴 문의</button>
          <span className="text-gray-300">|</span>
          <Link href="/corporate"><a className="hover:underline">기업 구매</a></Link>
          <span className="text-gray-300">|</span>
          <Link href="/support"><a className="hover:underline">고객센터</a></Link>
        </div>
      </div>
    </div>
  );
}
