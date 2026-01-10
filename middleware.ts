import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before every request
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies or localStorage (for now, we'll skip auth check)
  // In production, you'd validate JWT tokens here
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'));
  
  // For now, allow all routes (we'll implement proper auth later)
  // You can uncomment this when backend auth is ready:
  /*
  if (!isPublicRoute) {
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  */
  
  // Silence the unused variable warning
  console.log('Route check:', { pathname, isPublicRoute });
  
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
