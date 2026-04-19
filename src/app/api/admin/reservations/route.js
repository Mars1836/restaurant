import { verifyAdminRequest } from "@/lib/admin-auth";
import { listReservationsForAdmin } from "@/lib/reservations-repo";

/**
 * GET /api/admin/reservations?date=YYYY-MM-DD&branchId=...
 * Header: Authorization: Basic base64(username:password)
 * Mặc định server: admin / admin (ADMIN_USER / ADMIN_PASSWORD)
 */
export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return Response.json(
      { error: "Sai tên đăng nhập hoặc mật khẩu." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const dateFilter = searchParams.get("date") || undefined;
  const branchId = searchParams.get("branchId") || undefined;

  try {
    const reservations = await listReservationsForAdmin({
      limit: 200,
      dateFilter,
      branchId,
    });
    return Response.json({ reservations });
  } catch (err) {
    return Response.json(
      {
        error: err?.message || String(err),
        code: err?.code,
      },
      { status: 500 },
    );
  }
}
