import { MENU_ITEMS, getMenuItemUrl } from "@/lib/restaurant-store";

export async function GET(request, { params }) {
  const resolved = await params;
  const origin = new URL(request.url).origin;
  const item = MENU_ITEMS.find((x) => x.slug === resolved.slug);
  if (!item) {
    return Response.json({ error: "Khong tim thay mon an." }, { status: 404 });
  }
  return Response.json({
    ...item,
    url: getMenuItemUrl(origin, item.slug),
  });
}
