import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => {
  const push = vi.fn();
  (globalThis as any).__TEST_PUSH = push;
  return { useRouter: () => ({ push }), usePathname: () => '/services' };
});
vi.mock('@/components/ui/input', () => ({ Input: (props: any) => React.createElement('input', { ...props }) }));
vi.mock('@/components/ui/button', () => ({ Button: (props: any) => React.createElement('button', { ...props }, props.children) }));

import ServiceSearch from '@/components/room/service/service-search';

describe('ServiceSearch', () => {
  beforeEach(() => vi.clearAllMocks());

  it('submits search and calls router.push with query', () => {
    const push = (globalThis as any).__TEST_PUSH as jest.Mock | undefined || (globalThis as any).__TEST_PUSH;
    render(<ServiceSearch initialQuery={''} />);
    const input = screen.getByPlaceholderText(/Busca servicios.../i);
    fireEvent.change(input, { target: { value: 'spa' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(push).toHaveBeenCalledWith('/services?q=spa');
  });

  it('submits empty search and pushes pathname', () => {
    const push = (globalThis as any).__TEST_PUSH as jest.Mock | undefined || (globalThis as any).__TEST_PUSH;
    render(<ServiceSearch initialQuery={''} />);
    fireEvent.submit(screen.getByRole('search'));
    expect(push).toHaveBeenCalledWith('/services');
  });
});
