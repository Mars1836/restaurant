"use client";

import { useCallback, useEffect, useState } from "react";

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ReservationForm({ branches }) {
  const [branchId, setBranchId] = useState(branches[0]?.id || "");
  const [date, setDate] = useState(todayISO());
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const loadSlots = useCallback(async () => {
    if (!branchId || !date) return;
    setSlotsLoading(true);
    setSlotsError("");
    setTime("");
    try {
      const q = new URLSearchParams({
        branchId,
        date,
        partySize: String(partySize),
      });
      const res = await fetch(`/api/reservations/slots?${q}`);
      const data = await res.json();
      if (!res.ok) {
        setSlotsError(data.error || "Không tải được khung giờ.");
        setSlots([]);
        return;
      }
      setSlots(data.slots || []);
    } catch {
      setSlotsError("Lỗi mạng. Vui lòng thử lại.");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [branchId, date, partySize]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setResult(null);
    if (!time) {
      setSubmitError("Vui lòng chọn giờ đến.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          date,
          time,
          partySize,
          customerName,
          phone,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Đặt bàn không thành công.");
        return;
      }
      setResult(data);
      loadSlots();
    } catch {
      setSubmitError("Lỗi mạng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="branch">Chi nhánh</label>
        <select
          id="branch"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          required
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row two">
        <div>
          <label htmlFor="date">Ngày</label>
          <input
            id="date"
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="party">Số khách</label>
          <input
            id="party"
            type="number"
            min={1}
            max={20}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="slot">Giờ đến</label>
        {slotsLoading ? (
          <p className="muted">Đang tải khung giờ…</p>
        ) : slotsError ? (
          <p className="form-error">{slotsError}</p>
        ) : slots.length === 0 ? (
          <p className="muted">Không còn chỗ trong ngày này. Thử ngày khác.</p>
        ) : (
          <select
            id="slot"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">— Chọn giờ —</option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-row two">
        <div>
          <label htmlFor="name">Họ tên</label>
          <input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="phone">Điện thoại</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="note">Ghi chú (tuỳ chọn)</label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Dị ứng, trẻ em, dịp đặc biệt…"
        />
      </div>

      {submitError ? <p className="form-error">{submitError}</p> : null}

      {result ? (
        <div className="form-success" role="status">
          <p>
            <strong>Đặt bàn thành công.</strong> Mã: {result.id}. Chi nhánh:{" "}
            {result.branchName}. {result.date} lúc {result.time}, {result.partySize}{" "}
            khách.
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting || !slots.length}
      >
        {submitting ? "Đang gửi…" : "Xác nhận đặt bàn"}
      </button>
    </form>
  );
}
