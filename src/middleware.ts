import { NextRequest, NextResponse } from 'next/server';

// المسارات المحمية
const protectedRoutes = ['/admin', '/admin/'];
const publicRoutes = ['/admin/login'];

// التحقق من وجود كوكي الجلسة بشكل بسيط (بدون استخدام admin-auth في Edge)
// التحقق الكامل من التوقيع يتم في API routes و SessionProvider
function hasSessionCookie(request: NextRequest): boolean {
  try {
    const sessionId = request.cookies.get('admin-session')?.value;
    if (!sessionId || typeof sessionId !== 'string') return false;
    return sessionId.includes('.');
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // عدم تشغيل الـ middleware على الملفات الثابتة أو _next أو api
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname.startsWith(route) && !pathname.startsWith('/admin/login')
    );
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute) {
      if (!hasSessionCookie(request)) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    if (isPublicRoute) {
      if (hasSessionCookie(request)) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    return NextResponse.next();
  } catch (_err) {
    // تجنب أي 500 من الـ middleware؛ المتابعة للطلب
    return NextResponse.next();
  }
}

// تشغيل الـ middleware فقط على مسارات /admin (لا يشمل _next أو api)
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};