import { NextRequest } from 'next/server';
import { proxyBackendRequest } from '@/lib/server/backend-client';

interface RouteParams {
  params: Promise<{
    clerkId: string;
  }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { clerkId } = await params;
  return proxyBackendRequest(`/employee/clerk/${encodeURIComponent(clerkId)}`);
}
