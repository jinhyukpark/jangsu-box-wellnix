-- Wellnix Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Members
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  auth_provider VARCHAR(20) DEFAULT 'email',
  status VARCHAR(20) DEFAULT 'active',
  membership_level VARCHAR(20) DEFAULT '일반',
  mileage INTEGER DEFAULT 0,
  profile_image TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verify_token TEXT,
  email_verify_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT '일반 관리자',
  status VARCHAR(20) DEFAULT 'active',
  permissions JSONB DEFAULT '[]',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  price INTEGER NOT NULL,
  original_price INTEGER,
  image TEXT,
  images JSONB DEFAULT '[]',
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  original_price INTEGER,
  description TEXT,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  plan_id INTEGER REFERENCES subscription_plans(id) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  start_date TIMESTAMP NOT NULL,
  next_delivery_date TIMESTAMP,
  delivery_day INTEGER DEFAULT 15,
  recipient_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_address TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Monthly Boxes
CREATE TABLE IF NOT EXISTS monthly_boxes (
  id SERIAL PRIMARY KEY,
  month VARCHAR(10) NOT NULL,
  year INTEGER NOT NULL,
  theme VARCHAR(200) NOT NULL,
  highlight VARCHAR(200),
  image TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  event_type VARCHAR(50),
  image TEXT,
  location VARCHAR(255),
  event_date TIMESTAMP,
  end_date TIMESTAMP,
  capacity INTEGER DEFAULT 0,
  participants INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) NOT NULL,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  status VARCHAR(20) DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(30) DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  shipping_fee INTEGER DEFAULT 0,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  recipient_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_address TEXT,
  delivery_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shipping
CREATE TABLE IF NOT EXISTS shipping (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  carrier VARCHAR(50),
  tracking_number VARCHAR(100),
  status VARCHAR(30) DEFAULT 'preparing',
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  order_id INTEGER REFERENCES orders(id),
  rating INTEGER NOT NULL,
  content TEXT,
  images JSONB DEFAULT '[]',
  is_best BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(member_id, product_id)
);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  discount_type VARCHAR(20) NOT NULL,
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  max_discount INTEGER,
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Member Coupons
CREATE TABLE IF NOT EXISTS member_coupons (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  coupon_id INTEGER REFERENCES coupons(id) NOT NULL,
  used_at TIMESTAMP,
  order_id INTEGER REFERENCES orders(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  notification_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id),
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reply TEXT,
  replied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  label VARCHAR(50),
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  postal_code VARCHAR(10),
  address TEXT NOT NULL,
  detail_address TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);
