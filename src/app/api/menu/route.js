import { MENU_ITEMS, normalizeText, getMenuItemUrl } from "@/lib/restaurant-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const category = normalizeText(searchParams.get("category"));
  const search = normalizeText(searchParams.get("search"));
  const maxPrice = Number(searchParams.get("maxPrice") || 0);

  let list = [...MENU_ITEMS];

  if (category) {
    list = list.filter((item) => normalizeText(item.category) === category);
  }

  if (search) {
    list = list.filter((item) => {
      return (
        normalizeText(item.name).includes(search) ||
        normalizeText(item.description).includes(search) ||
        item.tags.some((tag) => normalizeText(tag).includes(search))
      );
    });
  }

  if (maxPrice > 0) {
    list = list.filter((item) => Number(item.price) <= maxPrice);
  }

  const withUrls = list.map((item) => ({
    ...item,
    url: getMenuItemUrl(origin, item.slug),
  }));

  return Response.json(withUrls);
}
