# Wellnix (웰닉스) - Health Food E-commerce Platform

## Overview

Wellnix is a Korean health food e-commerce platform targeting senior customers. The application provides:

- **Product Shopping Mall**: Health food products with category filtering and search
- **Jangsu Box Subscription**: Monthly themed health gift subscription service (장수박스)
- **Health Events**: Registration and management for seminars, classes, and wellness events
- **My Page**: Order history, reviews, wishlist, shipping, payment, and inquiry management
- **Admin System**: Product, member, subscription, event, payment, shipping, FAQ, and inquiry management with role-based permissions

The frontend is a mobile-first React application styled as a 430px-max-width mobile app view with a promotional sidebar for desktop users.

## User Preferences

- **Communication style**: Simple, everyday language (Korean)

### CRITICAL: External Services Only (Supabase)
**DO NOT use any Replit built-in services. Use ONLY Supabase for all data storage:**

1. **Database**: Use ONLY Supabase PostgreSQL (`SUPABASE_DATABASE_URL`)
   - ❌ DO NOT use Replit's PostgreSQL (`DATABASE_URL`, `PGHOST`, etc.)
   - ❌ DO NOT use `create_postgresql_database_tool`

2. **File/Image Storage**: Use ONLY Supabase Storage
   - ❌ DO NOT use Replit's Object Storage / App Storage
   - ❌ DO NOT use `setup_object_storage` or `check_object_storage_status`
   - ✅ All images/files must be stored in Supabase Storage bucket


## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool
- **Language**: TypeScript
- **Styling**: TailwindCSS with Radix UI components (shadcn/ui style)
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter (lightweight React router)
- **Component Pattern**: Feature-based pages in `client/src/pages/`, reusable components in `client/src/components/`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend Architecture
- **Framework**: Express.js (Node.js) serving as the API server
- **Language**: TypeScript
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Storage Layer**: Abstracted storage interface (`IStorage`) with PostgreSQL implementation
- **Build**: esbuild for server bundling, Vite for client bundling

### API Route Structure
Routes are organized by feature in `server/routes/`:
- `auth.ts` - Member authentication (register, login, logout, session)
- `admin-auth.ts` - Admin authentication
- `products.ts` - Products and categories CRUD
- `subscriptions.ts` - Subscription plans and member subscriptions
- `events.ts` - Health events and participant management
- `orders.ts` - Cart, orders, payments, shipping
- `members.ts` - Member profile, reviews, wishlist, notifications, addresses
- `support.ts` - Inquiries, notices, FAQs
- `admin.ts` - Admin management and dashboard stats

Middleware (`server/middleware.ts`):
- `requireAuth` - Member authentication check
- `requireAdmin` - Admin authentication check

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect configured
- **Schema Location**: `shared/schema.ts` contains table definitions using Drizzle's schema builder
- **Migrations**: Generated to `./migrations` directory via `drizzle-kit`
- **Current Schema**: Basic users table with id, username, and password fields
- **Session Storage**: connect-pg-simple available for PostgreSQL session storage

### Authentication Pattern
- **Planned**: Session-based authentication (Spring Security style mentioned in docs, but Express implementation)
- **Schema Ready**: Users table with username/password fields
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod

### Build & Development
- **Dev Command**: `npm run dev` starts Express server with Vite middleware for HMR
- **Build Command**: `npm run build` bundles client with Vite, server with esbuild
- **Database Push**: `npm run db:push` syncs schema to database

## External Dependencies

### Database
- **Supabase PostgreSQL**: Primary database (requires `SUPABASE_DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management

### UI Components
- **Radix UI**: Comprehensive primitive components (dialog, dropdown, tabs, toast, etc.)
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility

### API & Data
- **TanStack Query**: Server state management and caching
- **Zod**: Schema validation for API requests/responses

### Potential Third-Party Integrations (from API spec)
- Payment gateway integration planned (결제 관리)
- Shipping/delivery tracking planned (배송 관리)
- Email notifications (nodemailer in dependencies)
- File uploads (multer in dependencies)

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundler for production
- **TSX**: TypeScript execution for development