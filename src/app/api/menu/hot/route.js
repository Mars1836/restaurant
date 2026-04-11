import { MENU_ITEMS } from "@/lib/restaurant-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") || 6), 20);
  const list = MENU_ITEMS.filter((item) => item.isHot).slice(0, limit);
  return Response.json(list);
}
