import Link from "next/link";
import { MENU_ITEMS } from "@/lib/restaurant-store";

export const metadata = {
  title: "Thực đơn",
};

function formatPrice(vnd) {
  return Number(vnd || 0).toLocaleString("vi-VN") + " đ";
}

export default function MenuPage() {
  const byCategory = MENU_ITEMS.reduce((acc, item) => {
    const key = item.categoryLabel || item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const order = ["Khai vị", "Món chính", "Tráng miệng"];

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <h1>Thực đơn</h1>
          <p className="page-lead">
            Thực đơn tham khảo; giá và món có thể thay đổi theo mùa. Vui lòng hỏi
            nhân viên khi đến nhà hàng.
          </p>
        </div>
      </div>

      <div className="container section-block">
        {order.map((cat) => {
          const items = byCategory[cat];
          if (!items?.length) return null;
          return (
            <section key={cat} className="menu-category">
              <h2 className="section-title">{cat}</h2>
              <ul className="menu-list">
                {items.map((item) => (
                  <li key={item.id} className="menu-row">
                    <div className="menu-row-img">
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className="menu-row-body">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="menu-row-price">{formatPrice(item.price)}</div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="container section-block">
        <p className="section-cta">
          <Link href="/dat-ban">Đặt bàn để giữ chỗ →</Link>
        </p>
      </div>
    </div>
  );
}
