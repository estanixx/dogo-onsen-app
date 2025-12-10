import '@testing-library/jest-dom';

// Polyfill sencillo de `fetch` para el entorno de pruebas en Node
import 'whatwg-fetch';

// Normalize relative URLs used in fetch/Request during tests by prefixing a localhost origin.
// This prevents `ERR_INVALID_URL` when components call `fetch('/api/...')` or `new Request('/api/...')`.
const _origFetch = (globalThis as any).fetch;
if (_origFetch) {
  (globalThis as any).fetch = (input: any, init?: any) => {
    try {
      if (typeof input === 'string' && input.startsWith('/')) {
        input = `${process.env.TEST_BASE_URL ?? 'http://localhost:3000'}${input}`;
      } else if (input && typeof input === 'object' && input.url && typeof input.url === 'string' && input.url.startsWith('/')) {
        // If a Request-like object is passed, clone it with an absolute URL
        const cloned = new Request(`${process.env.TEST_BASE_URL ?? 'http://localhost:3000'}${input.url}`, input);
        input = cloned;
      }
    } catch (e) {
      // swallow and let original fetch throw if needed
    }
    // Short-circuit common admin employees endpoint to avoid network calls in unit tests
    try {
      const urlStr = typeof input === 'string' ? input : input?.url;
      if (typeof urlStr === 'string' && urlStr.includes('/api/employees/admin/employees')) {
        return Promise.resolve(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
    } catch (e) {
      // ignore
    }
    return _origFetch(input, init);
  };
}

// Patch Request constructor similarly so `new Request('/api/...')` works in Node tests
try {
  const _RealRequest = (globalThis as any).Request;
  if (_RealRequest) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Request = class extends _RealRequest {
      constructor(input: any, init?: any) {
        if (typeof input === 'string' && input.startsWith('/')) {
          input = `${process.env.TEST_BASE_URL ?? 'http://localhost'}${input}`;
        }
        super(input, init);
      }
    } as any;
  }
} catch (e) {
  // ignore
}

// Opcional: simular `console.error` para mantener las pruebas limpias (descomentar si se desea)
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     originalError(...args);
//   };
// });

// Asegura que React esté disponible como global para módulos que dependen de un identificador global `React`
import * as React from 'react';
(globalThis as any).React = React; //eslint-disable-line @typescript-eslint/no-explicit-any
(global as any).React = React; //eslint-disable-line @typescript-eslint/no-explicit-any

// Polyfill de `matchMedia` para jsdom (usado por `use-mobile` y hooks similares)
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Provee un mock sencillo para los hooks de Clerk usados por muchos componentes.
// Algunos componentes llaman a `useUser()` que espera un `ClerkProvider` presente.
// El mock aquí evita que las pruebas necesiten montar el proveedor real.
import { vi } from 'vitest';
vi.mock('@clerk/nextjs', () => {
  const React = require('react'); //eslint-disable-line
  return {
    useUser: () => ({
      user: { id: 'test-user', publicMetadata: { role: 'admin' } },
      isLoaded: true,
    }),
    ClerkProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});
