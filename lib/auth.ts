/**
 * JWT 토큰 localStorage 기반 저장/조회/삭제
 * 브라우저 환경에서만 동작 (SSR 시 window 체크)
 */

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (!isClient()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAccessToken(accessToken: string): void {
  if (!isClient()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearTokens(): void {
  if (!isClient()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

function decodeTokenPayload(): Record<string, unknown> | null {
  const token = getAccessToken();
  if (!token || !isClient()) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * JWT payload에서 username 추출 (작성자 판별용)
 * 로컬 로그인: username, OAuth: email
 */
export function getUsernameFromToken(): string | null {
  const decoded = decodeTokenPayload();
  return (decoded?.username as string) ?? null;
}

/**
 * JWT payload에서 role 추출 (RBAC용)
 */
export function getRoleFromToken(): "USER" | "ADMIN" | null {
  const decoded = decodeTokenPayload();
  const role = decoded?.role as string | undefined;
  if (role === "ADMIN" || role === "USER") return role;
  return null;
}

export function isAdmin(): boolean {
  return getRoleFromToken() === "ADMIN";
}
