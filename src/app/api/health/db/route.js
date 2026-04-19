import { getPool, isPostgresEnabled } from "@/lib/db";

/**
 * GET /api/health/db
 * Kiểm tra kết nối Postgres (không dùng cho production monitoring nếu không muốn lộ trạng thái).
 */
export async function GET() {
  if (!isPostgresEnabled()) {
    return Response.json({
      ok: true,
      mode: "static",
      message:
        "Chưa có DATABASE_URL / POSTGRES_URL — app dùng dữ liệu trong restaurant-store.js.",
    });
  }

  const pool = getPool();
  if (!pool) {
    return Response.json(
      { ok: false, error: "Pool không khởi tạo được." },
      { status: 503 },
    );
  }

  try {
    await pool.query("SELECT 1");
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS n FROM branches",
    );
    const branchCount = rows[0]?.n ?? 0;

    return Response.json({
      ok: true,
      mode: "postgres",
      connected: true,
      branches_table_rows: branchCount,
      hint:
        branchCount === 0
          ? "Kết nối OK nhưng bảng branches trống — chạy db/seed.sql trên Supabase."
          : "Kết nối OK và có dữ liệu chi nhánh.",
    });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        connected: false,
        error: err?.message || String(err),
        code: err?.code,
      },
      { status: 503 },
    );
  }
}
