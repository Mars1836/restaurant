import Link from "next/link";

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/thuc-don", label: "Thực đơn" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/dat-ban", label: "Đặt bàn" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden>
            SG
          </span>
          <span className="brand-text">Saigon Gourmet</span>
        </Link>
        <nav className="site-nav" aria-label="Chính">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
