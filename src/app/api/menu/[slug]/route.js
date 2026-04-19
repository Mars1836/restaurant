import { getMenuItemUrl } from "@/lib/restaurant-store";
import { getMenuItemBySlug } from "@/lib/catalog-repo";

export async function GET(request, { params }) {
  const resolved = await params;
  const origin = new URL(request.url).origin;
  const item = await getMenuItemBySlug(resolved.slug);
  if (!item) {
    return Response.json({ error: "Khong tim thay mon an." }, { status: 404 });
  }
  return Response.json({
    ...item,
    url: getMenuItemUrl(origin, item.slug),
  });
}
