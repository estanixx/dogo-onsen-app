import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8004';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> },
) {
  try {
    const { clerkId } = await params;
    const token = request.cookies.get('dogo-admin-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/employee/admin/employees/${clerkId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || 'Failed to update employee status' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating employee status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
