import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Get the token with the secret
  const token = await getToken({
    req: request,
    secret: authOptions.secret,
  });

  const isAuthenticated = !!token;

  // Check if the request is for a dashboard route
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // If trying to access dashboard without being authenticated
  if (isDashboardRoute && !isAuthenticated) {
    // Redirect to signin page
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Temporarily disable middleware while we use client-side auth checks
export const config = {
  matcher: ["/dashboard/:path*"],
};
