import { BRANCHES } from "@/lib/restaurant-store";

export async function GET() {
  return Response.json(BRANCHES);
}
