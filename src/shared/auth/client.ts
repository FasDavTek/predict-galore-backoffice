/**
 * Client-side auth cookie helpers
 * Note: This is a transitional bridge until http-only cookies are set by the server.
 */

const AUTH_COOKIE = 'authToken';
const MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

