import AdminReservationsPanel from "./AdminReservationsPanel";

export const metadata = {
  title: "Admin — Quản lý đặt bàn",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <h1>Quản lý đặt bàn</h1>
          <p className="page-lead">
            Đăng nhập để xem danh sách đặt bàn. Trang không hiển thị trên menu
            công khai.
          </p>
        </div>
      </div>

      <div className="container section-block">
        <AdminReservationsPanel />
      </div>
    </div>
  );
}
