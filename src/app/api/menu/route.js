import { normalizeText } from "@/lib/restaurant-store";
import {
  listMenuItemsFiltered,
  withMenuUrls,
} from "@/lib/catalog-repo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const category = normalizeText(searchParams.get("category"));
  const search = normalizeText(searchParams.get("search"));
  const maxPrice = Number(searchParams.get("maxPrice") || 0);

  const list = await listMenuItemsFiltered({ category, search, maxPrice });
  return Response.json(withMenuUrls(list, origin));
}
