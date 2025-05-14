import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 허용된 경로 목록
const ALLOWED_PATHS = ['/login', '/list', '/recommend/subject'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 정적 파일이나 API 요청은 건너뛰기
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 토큰 확인
  const accessToken = request.cookies.get('access_token');
  const userId = request.cookies.get('user_id');
  const refreshToken = request.cookies.get('refresh_token');
  const username = request.cookies.get('username');

  const isAuthenticated = accessToken && userId && refreshToken && username;
  const isAllowedPath = ALLOWED_PATHS.includes(pathname);

  // 인증되지 않은 사용자
  if (!isAuthenticated) {
    // 로그인 페이지가 아닌 경우에만 리다이렉트
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 인증된 사용자
  if (isAuthenticated) {
    // 허용된 경로가 아닌 경우 /list로 리다이렉트
    if (!isAllowedPath) {
      return NextResponse.redirect(new URL('/list', request.url));
    }
    // 로그인 페이지 접근 시 /list로 리다이렉트
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/list', request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
