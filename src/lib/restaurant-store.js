export const BRANCHES = [
  {
    id: "cn-q1",
    name: "Saigon Gourmet — Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "1900 6868",
    openHours: "10:00 – 22:00",
  },
  {
    id: "cn-q7",
    name: "Saigon Gourmet — Quận 7",
    address: "88 Nguyễn Thị Thập, Quận 7, TP.HCM",
    phone: "1900 6868",
    openHours: "10:00 – 22:00",
  },
];

export const MENU_ITEMS = [
  {
    id: 1,
    slug: "bo-bit-tet-sot-tieu-den",
    name: "Bò bít tết sốt tiêu đen",
    category: "mon-chinh",
    categoryLabel: "Món chính",
    price: 289000,
    tags: ["bò", "bít tết", "bán chạy"],
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
    description: "Thịt bò mềm, sốt tiêu đen đậm vị, ăn kèm khoai tây nghiền.",
    isHot: true,
  },
  {
    id: 2,
    slug: "ca-hoi-ap-chao-sot-chanh-day",
    name: "Cá hồi áp chảo sốt chanh dây",
    category: "mon-chinh",
    categoryLabel: "Món chính",
    price: 259000,
    tags: ["cá hồi", "healthy"],
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200",
    description: "Cá hồi tươi áp chảo vừa tới, phục vụ cùng rau củ nướng.",
    isHot: true,
  },
  {
    id: 3,
    slug: "pizza-hai-san-pho-mai",
    name: "Pizza hải sản phô mai",
    category: "mon-chinh",
    categoryLabel: "Món chính",
    price: 219000,
    tags: ["pizza", "hải sản"],
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
    description: "Đế bánh giòn mỏng, nhân tôm mực và phô mai mozzarella.",
    isHot: false,
  },
  {
    id: 4,
    slug: "salad-ca-ngu-olive",
    name: "Salad cá ngừ olive",
    category: "khai-vi",
    categoryLabel: "Khai vị",
    price: 129000,
    tags: ["salad", "healthy"],
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1200",
    description: "Rau tươi trộn dầu olive, cá ngừ ngon, thanh mát.",
    isHot: false,
  },
  {
    id: 5,
    slug: "soup-bi-do-kem-banh-mi-toi",
    name: "Súp bí đỏ kèm bánh mì tỏi",
    category: "khai-vi",
    categoryLabel: "Khai vị",
    price: 99000,
    tags: ["soup", "bánh mì tỏi"],
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200",
    description: "Súp bí đỏ béo nhẹ, ăn kèm bánh mì tỏi nóng giòn.",
    isHot: true,
  },
  {
    id: 6,
    slug: "tiramisu-ca-phe",
    name: "Tiramisu cà phê",
    category: "trang-mieng",
    categoryLabel: "Tráng miệng",
    price: 89000,
    tags: ["bánh ngọt", "tráng miệng"],
    imageUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200",
    description: "Bánh tiramisu mềm mịn, vị cà phê nhẹ và cacao.",
    isHot: true,
  },
];

export const DEFAULT_TIME_SLOTS = [
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

/**
 * Mock DB: danh sách đặt bàn trong RAM (cùng process).
 * - `npm run dev`: giữ đến khi restart server.
 * - Production serverless: mỗi instance / cold start = mảng rỗng; không thay thế DB thật.
 */
export const reservations = [];

export function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

/** Chuẩn hoá SĐT để so khớp (chỉ giữ chữ số, bỏ khoảng trắng, +84…). */
export function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 10) {
    return `0${digits.slice(2)}`;
  }
  return digits;
}

/** Đường dẫn công khai tới món trên site (trang thực đơn + anchor theo slug). */
export function getMenuItemPath(slug) {
  return `/thuc-don#${slug}`;
}

/**
 * URL đầy đủ cho API/cards (truyền origin từ request, ví dụ https://....vercel.app).
 */
export function getMenuItemUrl(origin, slug) {
  const base = String(origin || "").replace(/\/$/, "");
  return `${base}${getMenuItemPath(slug)}`;
}
