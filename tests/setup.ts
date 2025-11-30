import '@testing-library/jest-dom';

// Polyfill sencillo de `fetch` para el entorno de pruebas en Node
import 'whatwg-fetch';

// Opcional: simular `console.error` para mantener las pruebas limpias (descomentar si se desea)
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     originalError(...args);
//   };
// });

// Asegura que React esté disponible como global para módulos que dependen de un identificador global `React`
import * as React from 'react';
(globalThis as any).React = React;
(global as any).React = React;

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
  const React = require('react');
  return {
    useUser: () => ({
      user: { id: 'test-user', publicMetadata: { role: 'admin' } },
      isLoaded: true,
    }),
    ClerkProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});
