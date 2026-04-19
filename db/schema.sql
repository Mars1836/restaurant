-- =============================================================================
-- Cùng nội dung migration: ../supabase/migrations/20260411120000_restaurant_initial.sql
-- (Sửa schema: cập nhật cả hai file cho đồng bộ.)
--
-- Schema PostgreSQL (Supabase / Neon / bất kỳ Postgres nào)
-- Chạy toàn bộ file trong SQL Editor (Supabase: Dashboard → SQL → New query).
--
-- Supabase:
-- - Dùng connection string "Transaction pooler" hoặc "Session" trong .env (DATABASE_URL).
-- - Nếu bật RLS: thêm policy cho anon/authenticated HOẶC tắt RLS cho các bảng này nếu chỉ
--   server Next.js kết nối bằng service role / connection string có quyền ghi.
-- - Bảng public mặc định; không cần extension thêm cho schema cơ bản.
--
-- Nâng cấp từ schema cũ (chỉ có reservations, không FK):
--   DROP TABLE IF EXISTS public.reservations CASCADE;
-- rồi chạy lại phần CREATE TABLE reservations bên dưới.
-- =============================================================================

-- Chi nhánh
CREATE TABLE IF NOT EXISTS public.branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  open_hours TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Món ăn / thực đơn
CREATE TABLE IF NOT EXISTS public.menu_items (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  price INT NOT NULL CHECK (price >= 0),
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  is_hot BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS menu_items_category_idx ON public.menu_items (category);
CREATE INDEX IF NOT EXISTS menu_items_is_hot_idx ON public.menu_items (is_hot) WHERE is_hot = true;

-- Đặt bàn (phụ thuộc branches)
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL REFERENCES public.branches (id) ON DELETE RESTRICT,
  branch_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  party_size INT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_normalized TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS reservations_slot_confirmed_unique
  ON public.reservations (branch_id, date, time)
  WHERE status = 'confirmed';

CREATE INDEX IF NOT EXISTS reservations_phone_normalized_idx
  ON public.reservations (phone_normalized);
