import { getPool, isPostgresEnabled } from "./db";
import { findBranchById } from "./catalog-repo";
import { reservations, normalizePhone, normalizeText } from "./restaurant-store";

function rowToApi(row) {
  const d = row.date;
  const dateStr =
    d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10);
  const ca = row.created_at;
  const createdAt =
    ca instanceof Date
      ? ca.toISOString()
      : ca
        ? String(ca)
        : new Date().toISOString();

  return {
    id: row.id,
    branchId: row.branch_id,
    branchName: row.branch_name,
    date: dateStr,
    time: row.time,
    partySize: row.party_size,
    customerName: row.customer_name,
    phone: row.phone,
    note: row.note ?? "",
    status: row.status,
    createdAt,
  };
}

/** Khung giờ đã booked (để trừ khỏi slots). */
export async function getBookedSlotTimes(branchId, date) {
  const bid = normalizeText(branchId);
  if (isPostgresEnabled()) {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT time FROM reservations
       WHERE branch_id = $1 AND date = $2::date AND status = $3`,
      [bid, date, "confirmed"],
    );
    return rows.map((r) => r.time);
  }

  return reservations
    .filter(
      (r) =>
        normalizeText(r.branchId) === bid &&
        r.date === date &&
        r.status === "confirmed",
    )
    .map((r) => r.time);
}

/** true nếu đã có bàn confirmed cùng chi nhánh + ngày + giờ. */
async function hasConflict(branchId, date, time) {
  const bid = normalizeText(branchId);
  if (isPostgresEnabled()) {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT 1 FROM reservations
       WHERE branch_id = $1 AND date = $2::date AND time = $3 AND status = $4
       LIMIT 1`,
      [bid, date, time, "confirmed"],
    );
    return rows.length > 0;
  }

  return reservations.some(
    (r) =>
      normalizeText(r.branchId) === bid &&
      r.date === date &&
      r.time === time &&
      r.status === "confirmed",
  );
}

/**
 * @returns {{ ok: true, reservation: object } | { ok: false, status: number, error: string }}
 */
export async function createReservation(payload) {
  const {
    branchId,
    date,
    time,
    partySize,
    customerName,
    phone,
    note,
  } = payload;

  const branch = await findBranchById(branchId);
  if (!branch) {
    return { ok: false, status: 404, error: "Chi nhanh khong ton tai." };
  }

  if (await hasConflict(branchId, date, time)) {
    return {
      ok: false,
      status: 409,
      error: "Khung gio nay vua het cho. Vui long chon gio khac.",
    };
  }

  const id = `RES-${Date.now()}`;
  const phoneNorm = normalizePhone(phone);

  if (isPostgresEnabled()) {
    const pool = getPool();
    await pool.query(
      `INSERT INTO reservations (
        id, branch_id, branch_name, date, time, party_size,
        customer_name, phone, phone_normalized, note, status
      ) VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        branch.id,
        branch.name,
        date,
        time,
        Number(partySize),
        customerName,
        phone,
        phoneNorm,
        note || "",
        "confirmed",
      ],
    );

    const { rows } = await pool.query(
      `SELECT * FROM reservations WHERE id = $1`,
      [id],
    );
    const reservation = rowToApi(rows[0]);
    return { ok: true, reservation };
  }

  const reservation = {
    id,
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
  return { ok: true, reservation };
}

export async function findReservationsByPhoneNormalized(needle) {
  if (isPostgresEnabled()) {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT * FROM reservations
       WHERE phone_normalized = $1
       ORDER BY created_at DESC`,
      [needle],
    );
    return rows.map(rowToApi);
  }

  return reservations
    .filter((r) => normalizePhone(r.phone) === needle)
    .map((r) => ({
      id: r.id,
      branchId: r.branchId,
      branchName: r.branchName,
      date: r.date,
      time: r.time,
      partySize: r.partySize,
      customerName: r.customerName,
      phone: r.phone,
      note: r.note || "",
      status: r.status,
      createdAt: r.createdAt,
    }));
}
