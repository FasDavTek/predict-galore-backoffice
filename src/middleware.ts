import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedPaths = [
  '/dashboard',
  '/predictions',
  '/users',
  '/transactions',
  '/settings',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('authToken')?.value;
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/predictions/:path*', '/users/:path*', '/transactions/:path*', '/settings/:path*'],
};

