import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인하면 접근 못하는 경로
const authRoutes = ['/auth/login', '/auth/signup'];

export function middleware(request: NextRequest) {
  // 현재 경로 & 토큰 확인
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // 인증 경로 + 토큰 있음 → 메인으로
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/my-space/stalking', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
