import { Pool } from "pg";

const globalForPool = globalThis;

/** Chuỗi kết nối Postgres: ưu tiên DATABASE_URL (tự cấu hình), sau đó POSTGRES_URL (Vercel ↔ Supabase integration). */
export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    ""
  );
}

/**
 * Pool PostgreSQL. Dùng trong Route Handlers (Node runtime).
 * Neon / Supabase / Railway: thường cần SSL.
 * Postgres local (Docker): thường không SSL → set DATABASE_SSL=false.
 */
export function getPool() {
  const url = getDatabaseUrl();
  if (!url) {
    return null;
  }
  if (!globalForPool._pgPool) {
    const local =
      /localhost|127\.0\.0\.1/.test(url) ||
      process.env.DATABASE_SSL === "false";
    globalForPool._pgPool = new Pool({
      connectionString: url,
      max: 10,
      ssl: local ? false : { rejectUnauthorized: false },
    });
  }
  return globalForPool._pgPool;
}

export function isPostgresEnabled() {
  return Boolean(getDatabaseUrl());
}
