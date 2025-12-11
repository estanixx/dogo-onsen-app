import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { trace } from '@opentelemetry/api';

type DeviceConfig = {
  type?: 'room' | 'employee';
  roomId?: string;
};

const PUBLIC_PATHS = ['/room/config', '/sign-in', '/sign-up'];
const isEmployeeRoute = createRouteMatcher(['/employee(.*)']);
const isAdminRoute = createRouteMatcher(['/employee/admin(.*)']);

/**
 * Add Grafana observability headers to response
 */
function addObservabilityHeaders(response: NextResponse): void {
  const current = trace.getActiveSpan();

  if (current) {
    response.headers.set(
      'server-timing',
      `traceparent;desc="00-${current.spanContext().traceId}-${current.spanContext().spanId}-01"`,
    );
  }
}

/**
 * Handle authentication logic for employee and admin routes
 */
async function handleAuthentication(
  auth: any,
  request: NextRequest,
  pathname: string,
): Promise<NextResponse | null> {
  const authState = await auth();

  // Protect employee routes
  if (isEmployeeRoute(request)) {
    if (!authState.userId) {
      return authState.redirectToSignIn({ returnBackUrl: request.url });
    }
  }

  // Protect admin routes with token validation
  if (isAdminRoute(request)) {
    if (!authState.userId) {
      return authState.redirectToSignIn({ returnBackUrl: request.url });
    }

    // Check for admin token in cookies
    const adminToken = request.cookies.get('dogo-admin-token')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return null;
}

/**
 * Handle device configuration logic for rooms and employees
 */
function handleDeviceConfiguration(request: NextRequest, pathname: string): NextResponse | null {
  if (PUBLIC_PATHS.includes(pathname)) {
    return null;
  }

  const deviceConfig = readDeviceConfig(request);

  // If no device config cookie is present, send user to selector (home)
  if (!deviceConfig) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user lands on the homepage and a device is configured, redirect
  if (pathname === '/') {
    if (deviceConfig.type === 'employee') {
      return NextResponse.redirect(new URL('/employee', request.url));
    }

    if (deviceConfig.type === 'room') {
      if (!deviceConfig.roomId) {
        return NextResponse.redirect(new URL('/room/config', request.url));
      }
      return NextResponse.redirect(new URL(`/room/${deviceConfig.roomId}`, request.url));
    }
  }

  // Existing protections: prevent room devices from accessing employee routes
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

  return null;
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Handle authentication
  const authResponse = await handleAuthentication(auth, request, pathname);
  if (authResponse) {
    addObservabilityHeaders(authResponse);
    return authResponse;
  }

  // Handle device configuration
  const deviceResponse = handleDeviceConfiguration(request, pathname);
  if (deviceResponse) {
    addObservabilityHeaders(deviceResponse);
    return deviceResponse;
  }

  // Default response with observability headers
  const response = NextResponse.next();
  addObservabilityHeaders(response);
  return response;
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
