import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: {
    default: "Saigon Gourmet — Nhà hàng TP.HCM",
    template: "%s | Saigon Gourmet",
  },
  description:
    "Nhà hàng Saigon Gourmet: thực đơn Việt – Âu, không gian ấm cúng, đặt bàn trực tuyến.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <SiteHeader />
        <main className="main-wrap">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
