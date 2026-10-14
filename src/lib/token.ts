/**
 * Helper quản lý lưu trữ Token:
 * - LocalStorage: Lưu accessToken, user ({ username, role }) và role (không lưu customerId)
 * - Cookie: Lưu refreshToken (phục vụ Next.js proxy và refresh token)
 */

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const ROLE_COOKIE = "role";
const USER_KEY = "user";
const ROLE_KEY = "role";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

/**
 * Lấy accessToken từ LocalStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Lấy refreshToken từ Cookie khi token hết hạn
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(REFRESH_TOKEN_COOKIE);
}

/**
 * Lấy user ({ username, role }) từ LocalStorage
 */
export function getStoredUser(): { username: string; role: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

/**
 * Lấy role từ LocalStorage
 */
export function getStoredRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

/**
 * Lưu accessToken, user ({ username, role }) và role lên LocalStorage; refreshToken và role vào Cookie
 * Không lưu customerId lên LocalStorage
 */
export function saveAuthTokens(params: {
  accessToken: string;
  refreshToken?: string;
  user?: { username: string; role: string };
  role?: string;
}) {
  if (typeof window === "undefined") return;

  if (params.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken);
  }

  if (params.refreshToken) {
    setCookie(REFRESH_TOKEN_COOKIE, params.refreshToken);
  }

  const role = params.role || params.user?.role;
  const username = params.user?.username;

  if (username && role) {
    localStorage.setItem(USER_KEY, JSON.stringify({ username, role }));
  }

  if (role) {
    localStorage.setItem(ROLE_KEY, role);
    setCookie(ROLE_COOKIE, role);
  }
}

/**
 * Dọn sạch accessToken, user, role ở LocalStorage và refreshToken, role ở Cookie
 */
export function clearAuthTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
  deleteCookie(REFRESH_TOKEN_COOKIE);
  deleteCookie(ROLE_COOKIE);
}
