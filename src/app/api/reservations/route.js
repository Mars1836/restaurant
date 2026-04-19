import { createReservation } from "@/lib/reservations-repo";

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

  const result = await createReservation({
    branchId,
    date,
    time,
    partySize,
    customerName,
    phone,
    note,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return Response.json(result.reservation, { status: 201 });
}
