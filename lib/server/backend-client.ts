import { NextResponse } from 'next/server';
import { BACKEND_BASE_URL } from '../api/constants';


export async function proxyBackendRequest(path: string, init?: RequestInit) {
  const url = `${BACKEND_BASE_URL}${path}`;
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers,
      cache: 'no-store',
    });

    return await transformResponse(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown backend error';
    return NextResponse.json(
      { message: 'Failed to connect to backend', error: message },
      { status: 502 },
    );
  }
}

async function transformResponse(response: Response) {
  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();

  if (!text) {
    return new NextResponse(null, { status: response.status });
  }

  if (contentType.includes('application/json')) {
    try {
      const payload = JSON.parse(text);
      return NextResponse.json(payload, { status: response.status });
    } catch {
      return NextResponse.json({ message: 'Invalid JSON from backend' }, { status: 502 });
    }
  }

  return new NextResponse(text, { status: response.status });
}
