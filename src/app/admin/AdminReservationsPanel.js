"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sg-admin-creds";

function formatCreated(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return String(iso);
  }
}

function basicHeader(username, password) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

export default function AdminReservationsPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stored, setStored] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterBranch, setFilterBranch] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const j = JSON.parse(raw);
        if (j?.username != null && j?.password != null) {
          setStored({ username: j.username, password: j.password });
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetch("/api/branches")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBranches(data);
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    const cred = stored || { username, password };
    if (!cred.username?.trim() || cred.password == null) {
      setError("Nhập tên đăng nhập và mật khẩu.");
      return;
    }
    setLoading(true);
    setError("");
    const q = new URLSearchParams();
    if (filterDate) q.set("date", filterDate);
    if (filterBranch) q.set("branchId", filterBranch);
    const url = `/api/admin/reservations${q.toString() ? `?${q}` : ""}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: basicHeader(
            cred.username.trim(),
            String(cred.password),
          ),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Lỗi ${res.status}`);
        setList([]);
        return;
      }
      setList(data.reservations || []);
    } catch (e) {
      setError(e?.message || "Lỗi mạng");
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [stored, username, password, filterDate, filterBranch]);

  useEffect(() => {
    if (stored) load();
  }, [stored, load]);

  function handleLogin(e) {
    e.preventDefault();
    const u = username.trim();
    const p = password;
    if (!u || p === "") return;
    const next = { username: u, password: p };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setStored(next);
    setUsername("");
    setPassword("");
  }

  function handleLogout() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setStored(null);
    setList([]);
    setError("");
  }

  if (!stored) {
    return (
      <div className="admin-gate">
        <p className="muted admin-gate-lead">
          Mặc định: <code className="admin-code">admin</code> /{" "}
          <code className="admin-code">admin</code> (đổi trên server bằng{" "}
          <code className="admin-code">ADMIN_USER</code> và{" "}
          <code className="admin-code">ADMIN_PASSWORD</code>).
        </p>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-fields">
            <label className="admin-label" htmlFor="admin-user">
              Tên đăng nhập
            </label>
            <input
              id="admin-user"
              type="text"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="admin"
            />
            <label className="admin-label" htmlFor="admin-pass">
              Mật khẩu
            </label>
            <input
              id="admin-pass"
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary admin-btn admin-btn--block">
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div className="admin-filters">
          <label className="admin-filter">
            <span>Ngày</span>
            <input
              type="date"
              className="admin-input admin-input--sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </label>
          <label className="admin-filter">
            <span>Chi nhánh</span>
            <select
              className="admin-input admin-input--sm"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            >
              <option value="">Tất cả</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn-primary admin-btn"
            onClick={() => load()}
            disabled={loading}
          >
            {loading ? "Đang tải…" : "Lọc / Làm mới"}
          </button>
        </div>
        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>

      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Chi nhánh</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Khách</th>
              <th>Tên</th>
              <th>SĐT</th>
              <th>Ghi chú</th>
              <th>TT</th>
              <th>Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && !loading ? (
              <tr>
                <td colSpan={10} className="admin-table-empty">
                  Không có đặt bàn nào (hoặc chưa khớp bộ lọc).
                </td>
              </tr>
            ) : (
              list.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code className="admin-code">{r.id}</code>
                  </td>
                  <td>{r.branchName}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.partySize}</td>
                  <td>{r.customerName}</td>
                  <td>
                    <a href={`tel:${r.phone}`}>{r.phone}</a>
                  </td>
                  <td className="admin-note">{r.note || "—"}</td>
                  <td>{r.status}</td>
                  <td className="admin-muted">{formatCreated(r.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="muted admin-footnote">
        Tối đa 200 bản ghi mới nhất. Đổi mật khẩu mặc định bằng biến môi trường
        trước khi public.
      </p>
    </div>
  );
}
