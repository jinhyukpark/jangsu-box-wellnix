# 웰닉스(Wellnix) API 명세서

**프로젝트**: 웰닉스 건강식품 이커머스 플랫폼  
**백엔드**: Spring Boot  
**프론트엔드**: React + Vite  
**작성일**: 2026-01-15

---

## 목차

1. [개요](#개요)
2. [기본 정보](#기본-정보)
3. [인증 및 권한](#인증-및-권한)
4. [API 엔드포인트](#api-엔드포인트)
   - [상품 관리](#1-상품-관리-products)
   - [구독 관리 (장수박스)](#2-구독-관리-장수박스-subscriptions)
   - [회원 관리](#3-회원-관리-members)
   - [주문 관리](#4-주문-관리-orders)
   - [결제 관리](#5-결제-관리-payments)
   - [배송 관리](#6-배송-관리-shipping)
   - [리뷰 관리](#7-리뷰-관리-reviews)
   - [행사 관리](#8-행사-관리-events)
   - [고객 문의](#9-고객-문의-inquiries)
   - [FAQ 관리](#10-faq-관리-faqs)
   - [공지사항](#11-공지사항-notices)
   - [관리자](#12-관리자-admins)
   - [대시보드](#13-대시보드-dashboard)

---

## 개요

웰닉스는 시니어 고객을 타겟으로 하는 건강식품 이커머스 플랫폼입니다. 주요 기능은 다음과 같습니다:

- **상품 쇼핑몰**: 건강식품 판매 (카테고리별 필터링, 검색)
- **장수박스 구독**: 월별 테마 건강 선물 정기 구독 서비스
- **건강 행사**: 세미나, 클래스 등 오프라인/온라인 행사 신청 및 관리
- **마이페이지**: 주문, 리뷰, 위시리스트, 배송, 결제, 문의 관리
- **관리자 시스템**: 상품/회원/구독/행사/결제/배송/FAQ/문의 관리 및 권한 시스템

---

## 기본 정보

### Base URL
```
개발: http://localhost:8080/api
운영: https://api.wellnix.com/api
```

### 공통 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "message": "요청이 성공적으로 처리되었습니다."
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

### 페이지네이션

페이지네이션이 필요한 엔드포인트는 다음 파라미터를 지원합니다:

- `page`: 페이지 번호 (0부터 시작)
- `size`: 페이지당 항목 수 (기본값: 20)
- `sort`: 정렬 기준 (예: `createdAt,desc`)

**페이지네이션 응답 형식**:
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "size": 20,
  "number": 0,
  "first": true,
  "last": false
}
```

---

## 인증 및 권한

### 세션 기반 인증
- 쿠키 기반 세션 인증 사용
- 프론트엔드는 `credentials: 'include'` 옵션으로 요청
- 관리자 로그인 후 세션 유지

### 권한 레벨
1. **일반 사용자**: 상품 조회, 주문, 리뷰 작성 등
2. **관리자**: 메뉴별 권한 설정 (products, members, subscription, events, payments, shipping, inquiries, faq)
3. **슈퍼 관리자**: 모든 권한 + 관리자 계정 관리

---

## API 엔드포인트

## 1. 상품 관리 (Products)

### 1.1 상품 목록 조회 (페이지네이션)
```http
GET /api/products
```

**Query Parameters**:
- `page`: 페이지 번호 (기본값: 0)
- `size`: 페이지당 개수 (기본값: 20)
- `category`: 카테고리 필터 (예: "홍삼", "영양제", "관절건강")
- `minPrice`: 최소 가격
- `maxPrice`: 최대 가격
- `search`: 검색 키워드
- `sort`: 정렬 기준 (예: `price,asc`, `rating,desc`)

**Response**:
```json
{
  "content": [
    {
      "id": "1",
      "name": "6년근 홍삼 정과 선물세트",
      "category": "홍삼",
      "price": 89000,
      "originalPrice": 120000,
      "image": "/images/products/product-1.jpg",
      "rating": 4.9,
      "reviewCount": 1247,
      "stock": 150,
      "status": "active"
    }
  ],
  "totalElements": 8,
  "totalPages": 1,
  "number": 0
}
```

### 1.2 상품 상세 조회
```http
GET /api/products/{id}
```

**Response**:
```json
{
  "id": "1",
  "name": "6년근 홍삼 정과 선물세트",
  "category": "홍삼",
  "price": 89000,
  "originalPrice": 120000,
  "image": "/images/products/product-1.jpg",
  "rating": 4.9,
  "reviewCount": 1247,
  "stock": 150,
  "status": "active",
  "description": "6년근 홍삼을 사용한 프리미엄 선물세트입니다.",
  "createdAt": "2025-10-01T10:00:00",
  "updatedAt": "2026-01-10T15:30:00"
}
```

### 1.3 상품 생성 (관리자)
```http
POST /api/admin/products
```

**Request Body**:
```json
{
  "name": "신상품명",
  "category": "홍삼",
  "price": 89000,
  "originalPrice": 120000,
  "image": "/images/products/new-product.jpg",
  "stock": 100,
  "description": "상품 설명",
  "status": "active"
}
```

### 1.4 상품 수정 (관리자)
```http
PUT /api/admin/products/{id}
```

### 1.5 상품 삭제 (관리자)
```http
DELETE /api/admin/products/{id}
```

---

## 2. 구독 관리 (장수박스) (Subscriptions)

### 2.1 구독 플랜 목록 조회
```http
GET /api/subscriptions/plans
```

**Response**:
```json
[
  {
    "id": "basic",
    "name": "효심 박스",
    "price": 89000,
    "originalPrice": 120000,
    "description": "매월 엄선된 건강식품 3~4종",
    "features": ["홍삼/건강즙 포함", "계절별 맞춤 구성", "무료 배송"],
    "popular": false
  },
  {
    "id": "premium",
    "name": "장수 박스",
    "price": 159000,
    "originalPrice": 200000,
    "description": "엄선된 건강식품 5~6종 + 추억상자",
    "features": ["고급 홍삼/녹용 포함", "시즌 한정 특별구성", "고급 포장 & 추억상자"],
    "popular": true
  },
  {
    "id": "vip",
    "name": "천수 박스",
    "price": 289000,
    "originalPrice": 350000,
    "description": "최상급 건강식품 8종 + 프리미엄 케어",
    "features": ["최상급 산삼/녹용", "1:1 건강상담", "명인 한정 상품"],
    "popular": false
  }
]
```

### 2.2 월별 박스 테마 조회
```http
GET /api/subscriptions/monthly-boxes
```

**Response**:
```json
[
  {
    "id": "1",
    "month": "1월",
    "theme": "새해 건강 기원",
    "highlight": "6년근 홍삼정과 세트",
    "image": "/images/boxes/january.jpg"
  }
]
```

### 2.3 구독 신청
```http
POST /api/subscriptions
```

**Request Body**:
```json
{
  "planId": "premium",
  "startDate": "2026-02-01"
}
```

### 2.4 내 구독 정보 조회
```http
GET /api/subscriptions/my
```

**Response**:
```json
{
  "id": "sub-001",
  "memberId": "member-1",
  "memberName": "김영수",
  "planId": "premium",
  "planName": "장수 박스",
  "startDate": "2025-10-15",
  "nextDeliveryDate": "2026-02-01",
  "status": "active",
  "amount": 159000
}
```

### 2.5 구독 해지
```http
DELETE /api/subscriptions/{id}
```

### 2.6 관리자: 전체 구독 목록 조회
```http
GET /api/admin/subscriptions
```

---

## 3. 회원 관리 (Members)

### 3.1 회원 목록 조회 (관리자)
```http
GET /api/admin/members
```

**Query Parameters**:
- `page`, `size`, `sort`
- `status`: 회원 상태 필터 (`active`, `dormant`, `withdrawn`)
- `search`: 이름, 이메일, 전화번호 검색

**Response**:
```json
{
  "content": [
    {
      "id": "1",
      "name": "김영수",
      "email": "kim@example.com",
      "phone": "010-1234-5678",
      "joinDate": "2025-10-15",
      "status": "active",
      "subscription": "장수박스",
      "address": "서울시 강남구 테헤란로 123"
    }
  ],
  "totalElements": 4
}
```

### 3.2 회원 상세 조회 (관리자)
```http
GET /api/admin/members/{id}
```

### 3.3 회원 히스토리 조회 (관리자)
```http
GET /api/admin/members/{id}/history
```

**Response**:
```json
{
  "orders": [
    {
      "id": "ORD-001",
      "product": "장수박스 1월호",
      "date": "2026-01-12",
      "amount": 159000,
      "status": "shipping"
    }
  ],
  "reviews": [
    {
      "id": 1,
      "product": "프리미엄 홍삼 스틱",
      "rating": 5,
      "content": "부모님이 너무 좋아하세요.",
      "date": "2026-01-05"
    }
  ],
  "events": [
    {
      "eventId": "1",
      "title": "2026 건강한 설맞이 특별 세미나",
      "date": "2026-01-25",
      "status": "applied"
    }
  ]
}
```

---

## 4. 주문 관리 (Orders)

### 4.1 내 주문 목록 조회
```http
GET /api/orders/my
```

**Response**:
```json
[
  {
    "id": "ORD-001",
    "memberId": "member-1",
    "product": "장수박스 1월호",
    "productId": "sub-premium-202601",
    "date": "2026-01-12",
    "amount": 159000,
    "status": "shipping"
  }
]
```

### 4.2 주문 생성
```http
POST /api/orders
```

**Request Body**:
```json
{
  "productId": "1",
  "quantity": 1,
  "shippingAddress": "서울시 강남구..."
}
```

### 4.3 주문 취소
```http
PATCH /api/orders/{id}/cancel
```

### 4.4 관리자: 전체 주문 조회
```http
GET /api/admin/orders
```

---

## 5. 결제 관리 (Payments)

### 5.1 결제 내역 조회
```http
GET /api/payments/my
```

**Response**:
```json
[
  {
    "id": "PAY-20260112-001",
    "memberId": "member-1",
    "memberName": "김영수",
    "amount": 159000,
    "method": "card",
    "status": "completed",
    "date": "2026-01-12"
  }
]
```

### 5.2 관리자: 전체 결제 내역 조회
```http
GET /api/admin/payments
```

**Query Parameters**:
- `status`: 결제 상태 필터 (`completed`, `pending`, `failed`, `refunded`)

---

## 6. 배송 관리 (Shipping)

### 6.1 내 배송 정보 조회
```http
GET /api/shipping/my
```

**Response**:
```json
[
  {
    "id": "SHP-20260112-001",
    "orderId": "ORD-001",
    "memberId": "member-1",
    "memberName": "김영수",
    "address": "서울시 강남구 테헤란로 123",
    "status": "shipping",
    "trackingNo": "1234567890",
    "date": "2026-01-12"
  }
]
```

### 6.2 배송 추적
```http
GET /api/shipping/{id}/track
```

### 6.3 관리자: 배송 상태 업데이트
```http
PATCH /api/admin/shipping/{id}
```

**Request Body**:
```json
{
  "status": "delivered",
  "trackingNo": "1234567890"
}
```

---

## 7. 리뷰 관리 (Reviews)

### 7.1 상품 리뷰 조회
```http
GET /api/products/{productId}/reviews
```

**Query Parameters**:
- `page`, `size`, `sort`

**Response**:
```json
{
  "content": [
    {
      "id": 1,
      "productId": "1",
      "productName": "6년근 홍삼 정과 선물세트",
      "productImage": "/images/products/product-1.jpg",
      "rating": 5,
      "date": "2026-01-10 14:30",
      "content": "부모님이 정말 좋아하세요!",
      "options": "옵션: 1.5kg (30뿌리)",
      "memberName": "김**"
    }
  ]
}
```

### 7.2 내 리뷰 조회
```http
GET /api/reviews/my
```

### 7.3 리뷰 작성
```http
POST /api/reviews
```

**Request Body**:
```json
{
  "productId": "1",
  "rating": 5,
  "content": "정말 좋은 상품입니다!",
  "options": "옵션: 1.5kg"
}
```

### 7.4 리뷰 삭제
```http
DELETE /api/reviews/{id}
```

---

## 8. 행사 관리 (Events)

### 8.1 행사 목록 조회
```http
GET /api/events
```

**Query Parameters**:
- `month`: 월 필터 (예: "2026-01")
- `category`: 카테고리 필터 (예: "여행", "건강식품", "운동")
- `status`: 상태 필터 (`recruiting`, `closed`, `cancelled`)

**Response**:
```json
[
  {
    "id": "1",
    "title": "2026 건강한 설맞이 특별 세미나",
    "date": "2026-01-25",
    "time": "14:00 - 16:00",
    "location": "서울 강남구 웰닉스홀",
    "participants": 127,
    "maxParticipants": 150,
    "status": "recruiting",
    "image": "/images/events/event-1.jpg",
    "tag": "무료 세미나",
    "description": "새해 건강 관리 비법과 면역력 증진 방법을 전문가와 함께 알아봅니다."
  }
]
```

### 8.2 행사 상세 조회
```http
GET /api/events/{id}
```

### 8.3 행사 신청
```http
POST /api/events/{id}/apply
```

**Request Body**:
```json
{
  "name": "김영수",
  "phone": "010-1234-5678"
}
```

### 8.4 행사 신청 취소
```http
DELETE /api/events/{id}/apply
```

### 8.5 관리자: 행사 참가자 목록 조회
```http
GET /api/admin/events/{id}/participants
```

**Response**:
```json
[
  {
    "id": "participant-1",
    "name": "김영수",
    "phone": "010-1234-5678",
    "status": "confirmed"
  }
]
```

### 8.6 관리자: 행사 생성
```http
POST /api/admin/events
```

### 8.7 관리자: 행사 수정
```http
PUT /api/admin/events/{id}
```

### 8.8 관리자: 행사 삭제
```http
DELETE /api/admin/events/{id}
```

---

## 9. 고객 문의 (Inquiries)

### 9.1 내 문의 목록 조회
```http
GET /api/inquiries/my
```

**Response**:
```json
[
  {
    "id": "1",
    "memberId": "member-1",
    "memberName": "김영수",
    "subject": "배송 지연 문의",
    "category": "shipping",
    "status": "pending",
    "date": "2026-01-12",
    "content": "주문한 상품이 아직 도착하지 않았습니다.",
    "answer": null,
    "answeredAt": null
  }
]
```

### 9.2 문의 작성
```http
POST /api/inquiries
```

**Request Body**:
```json
{
  "subject": "배송 지연 문의",
  "category": "shipping",
  "content": "주문한 상품이 아직 도착하지 않았습니다."
}
```

### 9.3 관리자: 전체 문의 조회
```http
GET /api/admin/inquiries
```

**Query Parameters**:
- `status`: 상태 필터 (`pending`, `in_progress`, `answered`)
- `category`: 카테고리 필터

### 9.4 관리자: 문의 답변
```http
PATCH /api/admin/inquiries/{id}/answer
```

**Request Body**:
```json
{
  "answer": "죄송합니다. 배송이 지연되고 있습니다. 내일 도착 예정입니다."
}
```

---

## 10. FAQ 관리 (FAQs)

### 10.1 FAQ 목록 조회
```http
GET /api/faqs
```

**Query Parameters**:
- `category`: 카테고리 필터 (예: "장수박스", "배송", "교환/환불")

**Response**:
```json
[
  {
    "id": 1,
    "category": "장수박스",
    "question": "장수박스 구독은 어떻게 신청하나요?",
    "answer": "웹사이트에서 원하는 플랜을 선택하고...",
    "status": "published",
    "createdAt": "2025-10-01T10:00:00"
  }
]
```

### 10.2 관리자: FAQ 생성
```http
POST /api/admin/faqs
```

**Request Body**:
```json
{
  "category": "장수박스",
  "question": "구독 해지는 어떻게 하나요?",
  "answer": "마이페이지에서 구독 관리 메뉴를 통해...",
  "status": "published"
}
```

### 10.3 관리자: FAQ 수정
```http
PUT /api/admin/faqs/{id}
```

### 10.4 관리자: FAQ 삭제
```http
DELETE /api/admin/faqs/{id}
```

---

## 11. 공지사항 (Notices)

### 11.1 공지사항 목록 조회
```http
GET /api/notices
```

**Query Parameters**:
- `category`: 카테고리 필터 (`general`, `event`, `system`, `update`)
- `important`: 중요 공지 필터 (boolean)

**Response**:
```json
[
  {
    "id": "1",
    "title": "2026 설 명절 배송 안내",
    "content": "설 명절 기간 배송이 지연될 수 있습니다...",
    "category": "general",
    "important": true,
    "views": 1247,
    "createdAt": "2026-01-10T10:00:00"
  }
]
```

### 11.2 공지사항 상세 조회
```http
GET /api/notices/{id}
```

### 11.3 관리자: 공지사항 생성
```http
POST /api/admin/notices
```

### 11.4 관리자: 공지사항 수정
```http
PUT /api/admin/notices/{id}
```

### 11.5 관리자: 공지사항 삭제
```http
DELETE /api/admin/notices/{id}
```

---

## 12. 관리자 (Admins)

### 12.1 관리자 로그인
```http
POST /api/admin/login
```

**Request Body**:
```json
{
  "email": "admin@wellnix.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "최고관리자",
  "email": "admin@wellnix.com",
  "role": "슈퍼 관리자",
  "permissions": ["all"]
}
```

### 12.2 관리자 로그아웃
```http
POST /api/admin/logout
```

### 12.3 관리자 목록 조회 (슈퍼 관리자)
```http
GET /api/admin/admins
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "최고관리자",
    "email": "admin@wellnix.com",
    "role": "슈퍼 관리자",
    "status": "active",
    "lastLogin": "2026-01-15 10:30",
    "permissions": ["all"]
  },
  {
    "id": 2,
    "name": "김철수",
    "email": "cs@wellnix.com",
    "role": "CS 매니저",
    "status": "active",
    "lastLogin": "2026-01-15 09:15",
    "permissions": ["inquiries", "members", "faq"]
  }
]
```

### 12.4 관리자 생성 (슈퍼 관리자)
```http
POST /api/admin/admins
```

**Request Body**:
```json
{
  "name": "이영희",
  "email": "md@wellnix.com",
  "password": "password123",
  "role": "MD",
  "permissions": ["products", "events", "subscription"]
}
```

### 12.5 관리자 권한 수정 (슈퍼 관리자)
```http
PATCH /api/admin/admins/{id}/permissions
```

**Request Body**:
```json
{
  "permissions": ["products", "events", "subscription", "faq"]
}
```

### 12.6 관리자 삭제 (슈퍼 관리자)
```http
DELETE /api/admin/admins/{id}
```

**참고**: 슈퍼 관리자 계정은 삭제 불가

---

## 13. 대시보드 (Dashboard)

### 13.1 대시보드 통계 조회 (관리자)
```http
GET /api/admin/dashboard/stats
```

**Response**:
```json
{
  "totalSales": 15890000,
  "totalOrders": 324,
  "totalMembers": 1247,
  "activeSubscriptions": 89,
  "todaySales": 1240000,
  "todayOrders": 23
}
```

---

## 에러 코드

| 코드 | 메시지 | 설명 |
|------|--------|------|
| 400 | Bad Request | 잘못된 요청 |
| 401 | Unauthorized | 인증 실패 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 중복 데이터 |
| 500 | Internal Server Error | 서버 에러 |

**에러 응답 예시**:
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "해당 상품을 찾을 수 없습니다."
  }
}
```

---

## 개발 참고사항

### 1. 프론트엔드 연동
- 프론트엔드에서 `client/src/lib/api-client.ts` 유틸리티 사용
- 타입 정의는 `client/src/types/api.ts` 참조
- 환경 변수 `VITE_API_BASE_URL`로 API URL 설정

### 2. CORS 설정
Spring Boot에서 CORS 허용 필요:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .allowCredentials(true);
    }
}
```

### 3. 세션 관리
- Spring Session 사용 권장
- 세션 타임아웃: 30분

### 4. 데이터베이스
- PostgreSQL 또는 MySQL 사용 권장
- JPA/Hibernate 사용

### 5. 파일 업로드
- 상품 이미지, 행사 이미지 등 파일 업로드 지원 필요
- 별도 엔드포인트: `POST /api/upload`

---

## 문의
백엔드 개발 중 API 스펙 관련 문의사항이 있으시면 프론트엔드 개발팀에 연락 주세요.
