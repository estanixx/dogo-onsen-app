import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

type DeviceConfig = {
  type?: 'room' | 'employee';
  roomId?: string;
};

const PUBLIC_PATHS = ['/', '/room/config', '/sign-in', '/sign-up'];
const isEmployeeRoute = createRouteMatcher(['/employee(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const authState = await auth();

  if (isEmployeeRoute(request)) {
    if (!authState.userId) {
      return authState.redirectToSignIn({ returnBackUrl: request.url });
    }
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const deviceConfig = readDeviceConfig(request);

  if (!deviceConfig) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (deviceConfig.type === 'room') {
    if (!deviceConfig.roomId && pathname !== '/room/config') {
      return NextResponse.redirect(new URL('/room/config', request.url));
    }

    if (pathname.startsWith('/employee')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (deviceConfig.type === 'employee' && pathname.startsWith('/room')) {
    return NextResponse.redirect(new URL('/employee', request.url));
  }

  return NextResponse.next();
});

function readDeviceConfig(request: NextRequest): DeviceConfig | null {
  const config = request.cookies.get('dogo-device-config')?.value;
  if (!config) {
    return null;
  }
  try {
    return JSON.parse(config) as DeviceConfig;
  } catch {
    return null;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
