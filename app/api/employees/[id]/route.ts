import { NextRequest, NextResponse } from 'next/server';
import { proxyBackendRequest } from '@/lib/server/backend-client';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyBackendRequest(`/employee/${encodeURIComponent(id)}`);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await request.json();
    const { id } = await params;
    return proxyBackendRequest(`/employee/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyBackendRequest(`/employee/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
