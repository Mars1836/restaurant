import {
  listHotMenuItems,
  withMenuUrls,
} from "@/lib/catalog-repo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const limit = Math.min(Number(searchParams.get("limit") || 6), 20);
  const list = await listHotMenuItems(limit);
  return Response.json(withMenuUrls(list, origin));
}
