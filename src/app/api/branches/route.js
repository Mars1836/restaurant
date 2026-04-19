import { getBranchesList } from "@/lib/catalog-repo";

export async function GET() {
  const branches = await getBranchesList();
  return Response.json(branches);
}
