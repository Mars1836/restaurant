import { BRANCHES, reservations } from "@/lib/restaurant-store";

export async function POST(request) {
  const body = await request.json();
  const { branchId, date, time, partySize, customerName, phone, note } = body;

  if (!branchId || !date || !time || !partySize || !customerName || !phone) {
    return Response.json(
      {
        error:
          "branchId, date, time, partySize, customerName, phone la bat buoc.",
      },
      { status: 400 },
    );
  }

  const branch = BRANCHES.find((b) => b.id === branchId);
  if (!branch) {
    return Response.json({ error: "Chi nhanh khong ton tai." }, { status: 404 });
  }

  const conflict = reservations.some(
    (r) =>
      r.branchId === branchId &&
      r.date === date &&
      r.time === time &&
      r.status === "confirmed",
  );

  if (conflict) {
    return Response.json(
      { error: "Khung gio nay vua het cho. Vui long chon gio khac." },
      { status: 409 },
    );
  }

  const reservation = {
    id: `RES-${Date.now()}`,
    branchId,
    branchName: branch.name,
    date,
    time,
    partySize: Number(partySize),
    customerName,
    phone,
    note: note || "",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  reservations.push(reservation);
  return Response.json(reservation, { status: 201 });
}
