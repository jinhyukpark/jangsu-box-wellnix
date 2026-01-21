import type { Express } from "express";
import { type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

import authRoutes from "./routes/auth";
import adminAuthRoutes from "./routes/admin-auth";
import productRoutes from "./routes/products";
import subscriptionRoutes from "./routes/subscriptions";
import eventRoutes from "./routes/events";
import orderRoutes from "./routes/orders";
import memberRoutes from "./routes/members";
import supportRoutes from "./routes/support";
import adminRoutes from "./routes/admin";
import promotionRoutes from "./routes/promotions";
import { registerSupabaseStorageRoutes } from "./routes/supabase-storage";

const { Pool } = pg;

declare module "express-session" {
  interface SessionData {
    memberId?: number;
    adminId?: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgSession = connectPgSimple(session);
  const pool = new Pool({
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // 세션 테이블이 올바른 스키마로 생성되도록 확인
  const sessionStore = new PgSession({
    pool,
    tableName: "sessions",
    createTableIfMissing: true,
    // v9에서는 options 컬럼이 필요 없음
  });

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "wellnix-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      },
    })
  );

  app.use(authRoutes);
  app.use(adminAuthRoutes);
  app.use(productRoutes);
  app.use(subscriptionRoutes);
  app.use(eventRoutes);
  app.use(orderRoutes);
  app.use(memberRoutes);
  app.use(supportRoutes);
  app.use(adminRoutes);
  app.use(promotionRoutes);
  
  registerSupabaseStorageRoutes(app);

  return httpServer;
}
