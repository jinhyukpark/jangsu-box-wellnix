import { db } from "./db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";

const richDescriptionMarkdown = `## 고려홍삼 6년근 진액

![홍삼 제품](https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600)

### 100% 국내산 6년근 홍삼

전통 방식 그대로 오랜 시간 달여 홍삼의 유효성분을 최대한 추출했습니다. 6년근 홍삼만이 가진 깊은 맛과 풍부한 영양을 그대로 담았습니다.

---

## 이런 분께 추천해요

- **면역력이 약하신 분**: 환절기에 자주 감기에 걸리시는 분
- **피로를 자주 느끼시는 분**: 업무나 육아로 지치신 분
- **부모님께 건강 선물을 드리고 싶은 분**: 명절, 생신 선물로 최고
- **혈행 건강이 걱정되시는 분**: 건강한 혈액순환을 원하시는 분

---

## 상품 상세 정보

![제조 시설](https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600)

### 엄격한 품질 관리

최고급 원재료만을 엄선하여 정성껏 제조한 프리미엄 건강식품입니다. 6년근 홍삼의 깊은 맛과 향을 그대로 담아 건강한 하루를 시작할 수 있도록 도와드립니다.

| 구분 | 내용 |
|------|------|
| 제품명 | 고려홍삼 6년근 진액 |
| 내용량 | 70ml x 30포 |
| 원산지 | 대한민국 (경기도 이천) |
| 제조사 | 고려홍삼 |

---

## 제조 과정

![전통 제조](https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600)

청정 지역에서 재배한 6년근 홍삼을 수확 후 48시간 이내에 가공하여 신선함을 그대로 담았습니다.

### 3단계 정성 제조 공정

1. **원료 선별**: 최상급 6년근 홍삼만 엄선
2. **전통 달임**: 12시간 이상 저온 추출
3. **품질 검사**: 3중 품질 검사 시스템

---

## 제품 소개 영상

<video src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" controls width="100%"></video>

고려홍삼 6년근 진액의 제조 과정과 효능을 영상으로 확인해보세요.

---

## 품질 인증

![품질 인증](https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600)

- ✅ 식품의약품안전처 HACCP 인증
- ✅ ISO 22000 국제 식품안전 인증
- ✅ 유기농 인증 획득
- ✅ 매 생산 단계 철저한 품질 관리

---

## 섭취 방법

![섭취 방법](https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600)

### 권장 섭취량

- **아침**: 공복에 1포 (흡수율 최고)
- **오후**: 식후 1포

### 보관 방법

냉장 보관 시 더욱 시원하고 맛있게 즐기실 수 있습니다. 개봉 후에는 빠른 시일 내 섭취를 권장합니다.

---

## 고객 후기

> "매일 아침 공복에 한 포씩 먹고 있는데, 확실히 피로감이 줄었어요!" - 김○○님

> "부모님 생신 선물로 드렸더니 너무 좋아하세요. 재구매 예정입니다." - 박○○님

---

## 자주 묻는 질문

**Q. 하루에 몇 포까지 먹어도 되나요?**
A. 1일 1~2포 섭취를 권장합니다. 과다 섭취 시 위장 장애가 발생할 수 있습니다.

**Q. 어린이도 먹어도 되나요?**
A. 만 15세 이상부터 섭취를 권장합니다.

**Q. 임산부도 섭취 가능한가요?**
A. 임산부는 전문의와 상담 후 섭취하시기 바랍니다.
`;

async function updateProductDescription() {
  try {
    await db.update(products)
      .set({ descriptionMarkdown: richDescriptionMarkdown })
      .where(eq(products.id, 2));
    
    console.log("Product 2 description updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating product:", error);
    process.exit(1);
  }
}

updateProductDescription();
