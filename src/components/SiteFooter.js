import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>
          <p className="footer-brand">Saigon Gourmet</p>
          <p className="footer-tagline">
            Nhà hàng phong cách hiện đại, hương vị Việt – Âu tinh tế.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/thuc-don">Thực đơn</Link>
          <Link href="/lien-he">Chi nhánh</Link>
          <Link href="/dat-ban">Đặt bàn</Link>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Saigon Gourmet. Đặt chỗ:{" "}
          <a href="tel:19006868">1900 6868</a>
        </p>
      </div>
    </footer>
  );
}
