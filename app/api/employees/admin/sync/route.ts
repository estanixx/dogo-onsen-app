import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8004';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('dogo-admin-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/employee/admin/sync-from-clerk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || 'Failed to sync from Clerk' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error syncing from Clerk:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
