import { normalizePhone } from "@/lib/restaurant-store";
import { findReservationsByPhoneNormalized } from "@/lib/reservations-repo";

/**
 * GET /api/reservations/lookup?phone=0909...
 * Cùng nguồn dữ liệu với POST /api/reservations (RAM hoặc PostgreSQL nếu có DATABASE_URL).
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = String(searchParams.get("phone") || "").trim();

  if (!raw) {
    return Response.json(
      { error: "phone la bat buoc (query ?phone=...)." },
      { status: 400 },
    );
  }

  const needle = normalizePhone(raw);
  if (!needle) {
    return Response.json(
      { error: "So dien thoai khong hop le." },
      { status: 400 },
    );
  }

  const items = await findReservationsByPhoneNormalized(needle);

  return Response.json({
    phoneQuery: raw,
    phoneNormalized: needle,
    count: items.length,
    reservations: items,
  });
}
