import { BACKEND_BASE_URL } from '@/lib/api/constants';

async function forward(request: Request, params: { path?: string[] }) {
  const pathParts = (await params)?.path ?? [];
  const incomingUrl = new URL(request.url);
  try {
    // Build target URL: BACKEND_URL + /path/parts + original search
    const targetBase = BACKEND_BASE_URL?.replace(/\/+$/, '');
    if (!targetBase || !/^https?:\/\//.test(targetBase)) {
      return new Response(JSON.stringify({ error: 'Bad backend url', url: BACKEND_BASE_URL }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const path = pathParts.map(encodeURIComponent).join('/');
    const search = incomingUrl.search || '';
    const target = new URL(`${targetBase}/${path}${search}`);

    // Clone and filter headers
    const outgoingHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      // don't forward host header
      if (key.toLowerCase() === 'host') {
        return;
      }
      outgoingHeaders[key] = value;
    });

    // Prepare body for non-GET/HEAD
    let body: BodyInit | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const buf = await request.arrayBuffer();
      body = buf.byteLength ? Buffer.from(buf) : undefined;
    }

    const res = await fetch(target.toString(), {
      method: request.method,
      headers: outgoingHeaders,
      body,
      // follow redirects server-side
      redirect: 'follow',
    });

    // Build response headers to return to client
    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      // Avoid some hop-by-hop headers
      if (
        ['connection', 'keep-alive', 'transfer-encoding', 'upgrade'].includes(key.toLowerCase())
      ) {
        return;
      }
      responseHeaders.set(key, value);
    });

    // Return streamed body if available
    return new Response(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    // Return a friendly 502 Bad Gateway with error details (no stack)
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: 'Bad gateway', message: msg }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request: Request, { params }: { params: { path?: string[] } }) {
  return forward(request, params);
}

export async function POST(request: Request, { params }: { params: { path?: string[] } }) {
  return forward(request, params);
}

export async function PUT(request: Request, { params }: { params: { path?: string[] } }) {
  return forward(request, params);
}

export async function PATCH(request: Request, { params }: { params: { path?: string[] } }) {
  return forward(request, params);
}

export async function DELETE(request: Request, { params }: { params: { path?: string[] } }) {
  return forward(request, params);
}

export async function OPTIONS(request: Request, { params }: { params: { path?: string[] } }) {
  return forward(request, params);
}

export async function HEAD(request: Request, { params }: { params: { path?: string[] } }) {
  return forward(request, params);
}
