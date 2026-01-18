import { db } from "./db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";

const productDetails = [
  {
    id: 1,
    name: "정관장 홍삼정 에브리타임",
    shortDescription: "6년근 홍삼을 담은 프리미엄 건강기능식품",
    descriptionMarkdown: `## 정관장 홍삼정 에브리타임

![홍삼 이미지](https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600)

### 제품 특징

**국내산 6년근 홍삼**을 정성껏 달여 만든 프리미엄 진액입니다.

- 면역력 증진에 도움
- 피로 회복에 효과적
- 휴대하기 편한 스틱형 포장

### 섭취 방법

1일 1~2회, 1회 1포를 섭취하세요.

### 주의사항

- 개봉 후 바로 섭취하세요
- 어린이 손이 닿지 않는 곳에 보관하세요
`,
    origin: "대한민국",
    manufacturer: "정관장",
    expirationInfo: "제조일로부터 24개월",
    storageMethod: "직사광선을 피해 서늘한 곳에 보관",
    shippingInfo: "평일 오후 2시 이전 주문 시 당일 출고 / 새벽배송 가능",
    refundInfo: "상품 수령 후 7일 이내 미개봉 상품에 한해 반품 가능",
    images: [
      "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400",
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400"
    ]
  },
  {
    id: 2,
    name: "고려홍삼 6년근 진액",
    shortDescription: "전통 방식으로 정성껏 달인 홍삼 진액",
    descriptionMarkdown: `## 고려홍삼 6년근 진액

![홍삼 진액](https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600)

### 100% 국내산 6년근 홍삼

전통 방식 그대로 오랜 시간 달여 홍삼의 유효성분을 최대한 추출했습니다.

### 주요 효능

- **면역력 강화**: 건강한 면역 체계 유지
- **피로 회복**: 일상의 활력 충전
- **혈행 개선**: 건강한 혈액 순환

### 섭취 권장

아침 공복에 1포, 오후에 1포 섭취를 권장합니다.
`,
    origin: "대한민국 (경기도 이천)",
    manufacturer: "고려홍삼",
    expirationInfo: "제조일로부터 18개월",
    storageMethod: "냉장 보관 권장",
    shippingInfo: "전국 무료배송 / 도서산간 추가비용 발생",
    refundInfo: "미개봉 상품 7일 이내 100% 환불",
    images: [
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400"
    ]
  },
  {
    id: 3,
    name: "종합 비타민 50+ 플러스",
    shortDescription: "50대 이상을 위한 맞춤형 종합 비타민",
    descriptionMarkdown: `## 50대 이상을 위한 맞춤 비타민

![비타민](https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600)

### 중장년층 맞춤 설계

50대 이상 분들에게 필요한 영양소를 과학적으로 배합했습니다.

### 포함 영양소

| 영양소 | 함량 |
|--------|------|
| 비타민 A | 700mcg |
| 비타민 B군 | 1일 권장량 100% |
| 비타민 C | 100mg |
| 비타민 D | 800IU |
| 아연 | 8.5mg |
| 셀레늄 | 55mcg |

### 섭취 방법

1일 1회, 1정을 물과 함께 섭취하세요.
`,
    origin: "대한민국",
    manufacturer: "웰닉스 뉴트리션",
    expirationInfo: "제조일로부터 24개월",
    storageMethod: "습기를 피해 실온 보관",
    shippingInfo: "70,000원 이상 무료배송",
    refundInfo: "개봉 전 상품만 반품 가능",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
    ]
  },
  {
    id: 4,
    name: "산수유 건강즙",
    shortDescription: "청정 지역에서 수확한 산수유로 만든 건강즙",
    descriptionMarkdown: `## 순수 국내산 산수유 건강즙

![산수유](https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600)

### 전라남도 구례 산수유

청정 지역 구례에서 수확한 **최상급 산수유**만을 사용합니다.

### 건강 효능

- 피로 회복
- 면역력 증진
- 간 건강에 도움

### 맛있게 즐기는 방법

1. **그대로 드시기**: 아침 공복에 1포
2. **물에 타서**: 시원한 물에 희석해서
3. **요거트와 함께**: 요거트에 넣어 상큼하게
`,
    origin: "대한민국 (전남 구례)",
    manufacturer: "구례산수유농장",
    expirationInfo: "제조일로부터 12개월",
    storageMethod: "개봉 후 냉장 보관",
    shippingInfo: "새벽배송 가능 지역 확인 후 배송",
    refundInfo: "품질 이상 시 100% 환불",
    images: []
  },
  {
    id: 5,
    name: "프로바이오틱스 골드",
    shortDescription: "100억 CFU 유산균 함유 장 건강 프로바이오틱스",
    descriptionMarkdown: `## 프로바이오틱스 골드

![프로바이오틱스](https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600)

### 장 건강의 핵심, 유산균

**100억 CFU**의 살아있는 유산균이 장 건강을 지켜드립니다.

### 포함 유산균

- 락토바실러스 애시도필러스
- 비피도박테리움 락티스
- 락토바실러스 람노서스
- 총 19종 복합 유산균

### 이런 분께 추천

- 불규칙한 식습관을 가진 분
- 장 건강이 걱정되시는 분
- 소화가 불편하신 분
`,
    origin: "대한민국",
    manufacturer: "바이오헬스코리아",
    expirationInfo: "제조일로부터 18개월",
    storageMethod: "냉장 보관 권장 (2-8도)",
    shippingInfo: "아이스팩과 함께 배송",
    refundInfo: "식품 특성상 개봉 후 반품 불가",
    images: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400"
    ]
  },
  {
    id: 6,
    name: "MSM 관절 건강",
    shortDescription: "관절 건강을 위한 고순도 MSM 1000mg",
    descriptionMarkdown: `## MSM 관절 건강 영양제

![관절 건강](https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=600)

### 관절 건강의 새로운 해결책

**고순도 MSM 1000mg**이 관절 건강을 케어합니다.

### MSM이란?

MSM(메틸설포닐메탄)은 연골 형성에 필수적인 유황 화합물로, 관절의 유연성과 편안함을 도와줍니다.

### 이런 분께 추천드려요

- 무릎, 허리가 불편하신 분
- 활동량이 많으신 분
- 관절 건강이 걱정되시는 중장년층
`,
    origin: "미국",
    manufacturer: "글로벌뉴트리션",
    expirationInfo: "제조일로부터 24개월",
    storageMethod: "서늘하고 건조한 곳에 보관",
    shippingInfo: "영업일 기준 2-3일 내 배송",
    refundInfo: "개봉 전 상품 7일 이내 반품 가능",
    images: []
  },
  {
    id: 7,
    name: "오메가3 트리플 파워",
    shortDescription: "EPA+DHA 1000mg 고함량 오메가3",
    descriptionMarkdown: `## 오메가3 트리플 파워

![오메가3](https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600)

### 혈행 건강을 위한 선택

**EPA 600mg + DHA 400mg** 고함량 배합으로 혈행 건강을 지켜드립니다.

### 오메가3 효능

- 혈중 중성지질 개선
- 혈행 개선에 도움
- 기억력 및 두뇌 건강

### 품질 인증

- GMP 인증 시설에서 제조
- 중금속 검사 완료
- rTG 형태로 흡수율 UP

### 섭취 방법

1일 2회, 1회 1캡슐을 식후에 섭취하세요.
`,
    origin: "노르웨이",
    manufacturer: "노르딕퓨어",
    expirationInfo: "제조일로부터 24개월",
    storageMethod: "냉장 보관 권장",
    shippingInfo: "전국 무료배송 (제주/도서산간 추가 3,000원)",
    refundInfo: "미개봉 상품 14일 이내 환불 가능",
    images: [
      "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400"
    ]
  }
];

async function seedProductDetails() {
  console.log("Updating product details...");
  
  try {
    for (const detail of productDetails) {
      console.log(`Updating product ${detail.id}: ${detail.name}`);
      
      await db.update(products)
        .set({
          name: detail.name,
          shortDescription: detail.shortDescription,
          descriptionMarkdown: detail.descriptionMarkdown,
          origin: detail.origin,
          manufacturer: detail.manufacturer,
          expirationInfo: detail.expirationInfo,
          storageMethod: detail.storageMethod,
          shippingInfo: detail.shippingInfo,
          refundInfo: detail.refundInfo,
          images: detail.images,
        })
        .where(eq(products.id, detail.id));
    }
    
    console.log("Successfully updated all product details!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating product details:", error);
    process.exit(1);
  }
}

seedProductDetails();
