import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require configuration
const PUBLIC_PATHS = ['/', '/room/config'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths without configuration
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Get device configuration from cookies
  const config = request.cookies.get('dogo-device-config')?.value;
  const deviceConfig = config ? JSON.parse(config) : null;

  // If no configuration exists, redirect to home
  if (!deviceConfig) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle room device routing
  if (deviceConfig.type === 'room') {
    // If room ID is not set, redirect to room config
    if (!deviceConfig.roomId && pathname !== '/room/config') {
      return NextResponse.redirect(new URL('/room/config', request.url));
    }
    
    // Prevent room devices from accessing employee routes
    if (pathname.startsWith('/employee')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Handle employee device routing
  if (deviceConfig.type === 'employee') {
    // Prevent employee devices from accessing room routes
    if (pathname.startsWith('/room')) {
      return NextResponse.redirect(new URL('/employee', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
