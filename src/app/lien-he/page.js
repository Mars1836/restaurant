import { BRANCHES } from "@/lib/restaurant-store";

export const metadata = {
  title: "Liên hệ",
};

export default function ContactPage() {
  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <h1>Liên hệ</h1>
          <p className="page-lead">
            Đặt bàn qua hotline hoặc form trên trang Đặt bàn. Chúng tôi phản hồi
            trong giờ làm việc.
          </p>
        </div>
      </div>

      <div className="container section-block">
        <div className="contact-hotline">
          <p>Hotline</p>
          <a href="tel:19006868" className="hotline-number">
            1900 6868
          </a>
          <p className="muted">8:00 – 21:00 hằng ngày</p>
        </div>

        <h2 className="section-title">Chi nhánh</h2>
        <div className="branch-grid">
          {BRANCHES.map((b) => (
            <article key={b.id} className="branch-card">
              <h3>{b.name}</h3>
              <p>{b.address}</p>
              <p>
                <span className="label">Giờ mở cửa:</span> {b.openHours}
              </p>
              <p>
                <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
