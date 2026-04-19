/**
 * Đăng nhập admin: username + password.
 * Mặc định admin / admin — ghi đè bằng ADMIN_USER và ADMIN_PASSWORD trên server.
 */

export function getExpectedAdminCredentials() {
  return {
    user: process.env.ADMIN_USER?.trim() || "admin",
    pass: process.env.ADMIN_PASSWORD?.trim() || "admin",
  };
}

function parseBasicAuth(request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return null;
  try {
    const raw = Buffer.from(auth.slice(6).trim(), "base64").toString("utf8");
    const colon = raw.indexOf(":");
    if (colon === -1) return null;
    return { user: raw.slice(0, colon), pass: raw.slice(colon + 1) };
  } catch {
    return null;
  }
}

/** API route: header Authorization: Basic base64(user:password) */
export function verifyAdminRequest(request) {
  const expected = getExpectedAdminCredentials();
  const parsed = parseBasicAuth(request);
  if (!parsed) return false;
  return parsed.user === expected.user && parsed.pass === expected.pass;
}
