# 웰닉스 백엔드 개발 가이드 (Spring Boot)

이 문서는 Spring Boot로 웰닉스 백엔드 API를 개발하기 위한 종합 가이드입니다.

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [시작하기](#시작하기)
5. [API 스펙](#api-스펙)
6. [데이터베이스 설계](#데이터베이스-설계)
7. [인증 및 권한](#인증-및-권한)
8. [프론트엔드 연동](#프론트엔드-연동)

---

## 프로젝트 개요

**웰닉스(Wellnix)**는 시니어를 타겟으로 하는 건강식품 이커머스 플랫폼입니다.

### 주요 기능
- 🛍️ **상품 쇼핑몰**: 건강식품 판매 (카테고리 필터링, 검색)
- 📦 **장수박스 구독**: 월별 테마 건강 선물 정기 구독
- 🎉 **건강 행사**: 세미나, 클래스 등 행사 신청 및 관리
- 👤 **마이페이지**: 주문, 리뷰, 위시리스트, 배송, 결제 관리
- 🔧 **관리자 시스템**: 상품/회원/구독/행사/FAQ 관리 및 권한 시스템

---

## 기술 스택

### 백엔드 (권장)
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+ 또는 Kotlin
- **Database**: PostgreSQL 또는 MySQL
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security (세션 기반 인증)
- **Build Tool**: Gradle 또는 Maven

### 프론트엔드 (이미 구현됨)
- React 18 + Vite
- TypeScript
- TailwindCSS + Radix UI
- TanStack Query (React Query)
- Wouter (라우팅)

---

## 프로젝트 구조

권장 Spring Boot 프로젝트 구조:

```
wellnix-backend/
├── src/
│   ├── main/
│   │   ├── java/com/wellnix/
│   │   │   ├── WellnixApplication.java
│   │   │   ├── config/
│   │   │   │   ├── WebConfig.java (CORS 설정)
│   │   │   │   └── SecurityConfig.java (인증/권한)
│   │   │   ├── controller/
│   │   │   │   ├── ProductController.java
│   │   │   │   ├── SubscriptionController.java
│   │   │   │   ├── MemberController.java
│   │   │   │   ├── EventController.java
│   │   │   │   └── AdminController.java
│   │   │   ├── service/
│   │   │   │   ├── ProductService.java
│   │   │   │   ├── SubscriptionService.java
│   │   │   │   └── ...
│   │   │   ├── repository/
│   │   │   │   ├── ProductRepository.java
│   │   │   │   └── ...
│   │   │   ├── entity/
│   │   │   │   ├── Product.java
│   │   │   │   ├── Member.java
│   │   │   │   ├── Subscription.java
│   │   │   │   └── ...
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   └── exception/
│   │   │       └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-dev.yml
│   └── test/
└── build.gradle (또는 pom.xml)
```

---

## 시작하기

### 1. Spring Boot 프로젝트 생성

[Spring Initializr](https://start.spring.io/)에서 프로젝트 생성:

- **Project**: Gradle - Groovy 또는 Maven
- **Language**: Java 17+ 또는 Kotlin
- **Spring Boot**: 3.2.x (최신 안정 버전)
- **Dependencies**:
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - PostgreSQL Driver (또는 MySQL Driver)
  - Lombok
  - Validation

### 2. application.yml 설정

```yaml
spring:
  application:
    name: wellnix-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/wellnix
    username: your_username
    password: your_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  
  session:
    timeout: 30m
    store-type: jdbc

server:
  port: 8080
  servlet:
    context-path: /api
```

### 3. CORS 설정

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5000") // 프론트엔드 URL
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## API 스펙

**전체 API 스펙은 `API_SPECIFICATION.md` 파일을 참조하세요.**

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

### 주요 엔드포인트

| 도메인 | 엔드포인트 | 메서드 | 설명 |
|--------|-----------|--------|------|
| 상품 | `/products` | GET | 상품 목록 조회 |
| 상품 | `/products/{id}` | GET | 상품 상세 조회 |
| 구독 | `/subscriptions/plans` | GET | 구독 플랜 목록 |
| 구독 | `/subscriptions` | POST | 구독 신청 |
| 행사 | `/events` | GET | 행사 목록 조회 |
| 행사 | `/events/{id}/apply` | POST | 행사 신청 |
| 리뷰 | `/reviews` | POST | 리뷰 작성 |
| 관리자 | `/admin/login` | POST | 관리자 로그인 |

---

## 데이터베이스 설계

### 주요 테이블

#### 1. products (상품)
```sql
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    price INTEGER NOT NULL,
    original_price INTEGER,
    image VARCHAR(500),
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. members (회원)
```sql
CREATE TABLE members (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    join_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. subscription_plans (구독 플랜)
```sql
CREATE TABLE subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER,
    description TEXT,
    features JSON,
    popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. subscriptions (구독)
```sql
CREATE TABLE subscriptions (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(id),
    plan_id VARCHAR(50) REFERENCES subscription_plans(id),
    start_date DATE NOT NULL,
    next_delivery_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. events (행사)
```sql
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50),
    location VARCHAR(200),
    max_participants INTEGER,
    status VARCHAR(20) DEFAULT 'recruiting',
    image VARCHAR(500),
    tag VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. event_participants (행사 참가자)
```sql
CREATE TABLE event_participants (
    id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) REFERENCES events(id),
    member_id VARCHAR(50) REFERENCES members(id),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'applied',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. reviews (리뷰)
```sql
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
    member_id VARCHAR(50) REFERENCES members(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    options VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. orders (주문)
```sql
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(id),
    product_id VARCHAR(50) REFERENCES products(id),
    product_name VARCHAR(200),
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. payments (결제)
```sql
CREATE TABLE payments (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    member_id VARCHAR(50) REFERENCES members(id),
    amount INTEGER NOT NULL,
    method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 10. shipping (배송)
```sql
CREATE TABLE shipping (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    member_id VARCHAR(50) REFERENCES members(id),
    address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'preparing',
    tracking_no VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 11. inquiries (문의)
```sql
CREATE TABLE inquiries (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(id),
    subject VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    answer TEXT,
    answered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 12. faqs (FAQ)
```sql
CREATE TABLE faqs (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer TEXT,
    status VARCHAR(20) DEFAULT 'published',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 13. admins (관리자)
```sql
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    permissions JSON,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 인증 및 권한

### 세션 기반 인증
- Spring Security + HttpSession 사용
- 쿠키 기반 세션 관리
- 세션 타임아웃: 30분

### 권한 레벨
1. **일반 사용자**: 상품 조회, 주문, 리뷰 작성 등
2. **관리자**: 메뉴별 권한 (products, members, subscription, events, payments, shipping, inquiries, faq)
3. **슈퍼 관리자**: 모든 권한 + 관리자 계정 관리

### SecurityConfig 예시

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/products/**", "/events/**", "/faqs/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 프론트엔드 연동

### 1. 환경 변수 설정

프론트엔드 `.env` 파일:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. API 클라이언트 사용

프론트엔드는 이미 API 클라이언트가 구현되어 있습니다:

```typescript
// client/src/lib/api-client.ts
import { apiClient } from '@/lib/api-client';

// GET 요청
const products = await apiClient.get('/products');

// POST 요청
const newOrder = await apiClient.post('/orders', {
  productId: '1',
  quantity: 1
});
```

### 3. 타입 정의

프론트엔드 타입 정의는 `client/src/types/api.ts`에 정의되어 있습니다.

백엔드 DTO와 일치하도록 개발하세요:
- `Product`
- `Subscription`
- `Event`
- `Review`
- `Order`
- etc.

---

## 개발 순서 (권장)

### Phase 1: 기본 설정
1. ✅ Spring Boot 프로젝트 생성
2. ✅ 데이터베이스 연결 설정
3. ✅ CORS 설정
4. ✅ Security 기본 설정

### Phase 2: 핵심 도메인 개발
5. 상품 관리 API (`ProductController`, `ProductService`, `ProductRepository`)
6. 구독 관리 API (`SubscriptionController` 등)
7. 회원 관리 API (`MemberController` 등)

### Phase 3: 부가 기능
8. 주문/결제/배송 API
9. 리뷰 API
10. 행사 관리 API
11. 문의/FAQ API

### Phase 4: 관리자 기능
12. 관리자 로그인 및 권한
13. 관리자 대시보드
14. 각 도메인별 관리자 CRUD

---

## 테스트

### 단위 테스트
```java
@SpringBootTest
class ProductServiceTest {
    
    @Autowired
    private ProductService productService;
    
    @Test
    void testGetProducts() {
        List<Product> products = productService.getProducts();
        assertNotNull(products);
    }
}
```

### API 테스트
- Postman 또는 REST Client 사용
- 프론트엔드와 연동 테스트

---

## 배포

### 개발 환경
- 로컬: `http://localhost:8080/api`
- 프론트엔드: `http://localhost:5000`

### 운영 환경
- 백엔드: `https://api.wellnix.com/api`
- 프론트엔드: `https://wellnix.com`

---

## 참고 자료

- [API 명세서](./API_SPECIFICATION.md) - 전체 API 엔드포인트 상세 스펙
- [프론트엔드 API 타입](./client/src/types/api.ts) - TypeScript 타입 정의
- [프론트엔드 API 클라이언트](./client/src/lib/api-client.ts) - Fetch wrapper 유틸리티

---

## 문의

백엔드 개발 중 질문이나 이슈가 있으시면 프론트엔드 개발팀에 연락주세요.

**Happy Coding! 🚀**
