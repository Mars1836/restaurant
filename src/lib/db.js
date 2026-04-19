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
 * Bỏ sslmode (verify-full, …) khỏi query string để không ép verify CA trong build/serverless.
 * Pool bên dưới dùng ssl: { rejectUnauthorized: false } — chuẩn Supabase/Neon + `pg`.
 */
function sanitizeConnectionString(raw) {
  try {
    const u = new URL(raw.replace(/^postgres:\/\//i, "postgresql://"));
    u.searchParams.delete("sslmode");
    u.searchParams.delete("sslrootcert");
    let s = u.toString();
    if (raw.startsWith("postgres://")) {
      s = s.replace(/^postgresql:\/\//, "postgres://");
    }
    return s;
  } catch {
    return raw;
  }
}

/**
 * Pool PostgreSQL. Dùng trong Route Handlers (Node runtime).
 * Neon / Supabase / Railway: thường cần SSL.
 * Postgres local (Docker): thường không SSL → set DATABASE_SSL=false.
 */
export function getPool() {
  const rawUrl = getDatabaseUrl();
  if (!rawUrl) {
    return null;
  }
  if (!globalForPool._pgPool) {
    const local =
      /localhost|127\.0\.0\.1/.test(rawUrl) ||
      process.env.DATABASE_SSL === "false";
    const connectionString = local ? rawUrl : sanitizeConnectionString(rawUrl);
    globalForPool._pgPool = new Pool({
      connectionString,
      max: 10,
      ssl: local ? false : { rejectUnauthorized: false },
    });
  }
  return globalForPool._pgPool;
}

export function isPostgresEnabled() {
  return Boolean(getDatabaseUrl());
}
