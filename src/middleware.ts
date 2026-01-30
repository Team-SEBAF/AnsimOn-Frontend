import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 필요한 경로 : TODO: 필요에 따라 경로 추가
const protectedRoutes = ['/my-page', '/my-space/case'];

// 로그인하면 접근 못하는 경로
const authRoutes = ['/auth/login', '/auth/signup'];

export function middleware(request: NextRequest) {
  // 현재 경로 & 토큰 확인
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // 보호된 경로 + 토큰 없을 시 리다이렉트 TODO: 리다이렉트 액션 수정 ex.모달
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 인증 경로 + 토큰 있음 → 메인으로
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
