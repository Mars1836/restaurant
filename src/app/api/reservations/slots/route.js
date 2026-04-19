import { DEFAULT_TIME_SLOTS, normalizeText } from "@/lib/restaurant-store";
import { findBranchById } from "@/lib/catalog-repo";
import { getBookedSlotTimes } from "@/lib/reservations-repo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const branchId = normalizeText(searchParams.get("branchId"));
  const date = String(searchParams.get("date") || "").trim();
  const partySize = Number(searchParams.get("partySize") || 2);

  if (!branchId || !date) {
    return Response.json(
      { error: "branchId va date la bat buoc." },
      { status: 400 },
    );
  }

  const branch = await findBranchById(branchId);
  if (!branch) {
    return Response.json({ error: "Chi nhanh khong ton tai." }, { status: 404 });
  }

  let slots = [...DEFAULT_TIME_SLOTS];
  if (partySize >= 6) {
    slots = slots.filter((s) => !["12:00", "19:00"].includes(s));
  }

  const bookedSlots = await getBookedSlotTimes(branchId, date);

  slots = slots.filter((slot) => !bookedSlots.includes(slot));

  return Response.json({
    branchId: branch.id,
    date,
    partySize,
    slots,
  });
}
