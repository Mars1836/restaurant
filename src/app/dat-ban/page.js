import { getBranchesList } from "@/lib/catalog-repo";
import ReservationForm from "./ReservationForm";

export const metadata = {
  title: "Đặt bàn",
};

export default async function ReservePage() {
  const branches = await getBranchesList();

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <h1>Đặt bàn</h1>
          <p className="page-lead">
            Chọn chi nhánh, ngày và số khách để xem khung giờ còn trống. Chúng
            tôi sẽ giữ chỗ theo thông tin bạn cung cấp.
          </p>
        </div>
      </div>

      <div className="container section-block">
        <ReservationForm branches={branches} />
        <p className="muted form-footnote">
          Cần hỗ trợ gấp? Gọi{" "}
          <a href="tel:19006868">1900 6868</a> trong giờ làm việc.
        </p>
      </div>
    </div>
  );
}
