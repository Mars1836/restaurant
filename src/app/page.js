import Link from "next/link";
import { MENU_ITEMS } from "@/lib/restaurant-store";

function formatPrice(vnd) {
  return Number(vnd || 0).toLocaleString("vi-VN") + " đ";
}

export default function HomePage() {
  const hotItems = MENU_ITEMS.filter((item) => item.isHot).slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Nhà hàng · TP.Hồ Chí Minh</p>
          <h1>Saigon Gourmet</h1>
          <p className="subtitle">
            Ẩm thực Việt kết hợp tinh hoa Âu: nguyên liệu tươi mỗi ngày, không
            gian hiện đại phù hợp gia đình và gặp gỡ đối tác.
          </p>
          <div className="hero-actions">
            <Link href="/thuc-don" className="btn btn-primary">
              Xem thực đơn
            </Link>
            <Link href="/dat-ban" className="btn btn-ghost">
              Đặt bàn
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section-block">
          <h2 className="section-title">Món được yêu thích</h2>
          <p className="section-lead">
            Một số gợi ý từ bếp — cập nhật theo mùa và nguyên liệu tốt nhất.
          </p>
          <div className="grid">
            {hotItems.map((item) => (
              <article className="card" key={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <div className="card-body">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="price">{formatPrice(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="section-cta">
            <Link href="/thuc-don">Xem toàn bộ thực đơn →</Link>
          </p>
        </section>

        <section className="section-block highlight-band">
          <div className="highlight-inner">
            <h2 className="section-title">Trải nghiệm tại chỗ</h2>
            <p>
              Hai chi nhánh tại Quận 1 và Quận 7, mở cửa trưa và tối. Đặt bàn
              trước để chọn khung giờ phù hợp — đặc biệt cuối tuần và ngày lễ.
            </p>
            <Link href="/lien-he" className="btn btn-primary">
              Xem địa chỉ &amp; giờ mở cửa
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
