import "./globals.css";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const WIDGET_SCRIPT = "https://smart-chat-assistant-nestjs-fe.vercel.app/widget.js";
const CHATBOT_ID = "837e6e52-ba4a-4864-aa41-0942d36fc438";
const API_BASE = "https://api-chatbot.codelife138.io.vn";

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
        <Script
          src={WIDGET_SCRIPT}
          strategy="afterInteractive"
          data-chatbot-id={CHATBOT_ID}
          data-api-base={API_BASE}
          data-position="bottom-right"
          data-color="#b88d00"
          data-lang="vi"
        />
      </body>
    </html>
  );
}
