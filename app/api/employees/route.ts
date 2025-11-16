import { NextRequest, NextResponse } from 'next/server';
import { proxyBackendRequest } from '@/lib/server/backend-client';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  const path = `/employee${query ? `?${query}` : ''}`;
  return proxyBackendRequest(path);
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    return proxyBackendRequest('/employee', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
}
