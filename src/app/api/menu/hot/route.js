import { MENU_ITEMS, getMenuItemUrl } from "@/lib/restaurant-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const limit = Math.min(Number(searchParams.get("limit") || 6), 20);
  const list = MENU_ITEMS.filter((item) => item.isHot)
    .slice(0, limit)
    .map((item) => ({
      ...item,
      url: getMenuItemUrl(origin, item.slug),
    }));
  return Response.json(list);
}
