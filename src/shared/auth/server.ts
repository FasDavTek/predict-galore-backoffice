/**
 * Server-side auth helpers
 */

import { cookies } from 'next/headers';

const AUTH_COOKIE = 'authToken';

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token ?? null;
}
