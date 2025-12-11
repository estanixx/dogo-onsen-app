import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Button, Dialog, Drawer, ScrollArea, media query and SpiritForm
vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => React.createElement('button', { ...props }, props.children),
}));
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => React.createElement('div', null, children),
  DialogTrigger: ({ children }: any) => React.createElement('div', null, children),
  DialogContent: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'dialog-content' }, children),
  DialogHeader: ({ children }: any) => React.createElement('div', null, children),
  DialogTitle: ({ children }: any) => React.createElement('div', null, children),
  DialogDescription: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children }: any) => React.createElement('div', null, children),
  DrawerTrigger: ({ children }: any) => React.createElement('div', null, children),
  DrawerContent: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'drawer-content' }, children),
  DrawerHeader: ({ children }: any) => React.createElement('div', null, children),
  DrawerTitle: ({ children }: any) => React.createElement('div', null, children),
  DrawerDescription: ({ children }: any) => React.createElement('div', null, children),
  DrawerFooter: ({ children }: any) => React.createElement('div', null, children),
  DrawerClose: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: (_q: any) => (globalThis as any).__TEST_IS_DESKTOP,
}));
vi.mock('@/components/employee/reception/spirit-form', () => ({
  __esModule: true,
  default: ({ id }: any) =>
    React.createElement('div', { 'data-testid': 'spirit-form' }, `form-${id}`),
}));
// Mock spirit context so SpiritForm (if accidentally imported) won't throw
vi.mock('@/context/spirit-context', () => ({
  useSpirit: () => ({ spirits: [], setSpirits: () => {} }),
  getSpirit: () => null,
}));
vi.mock('@radix-ui/react-scroll-area', () => ({
  ScrollArea: ({ children }: any) => React.createElement('div', null, children),
}));

import SpiritSelect from '@/components/employee/reception/spirit-select';

describe('SpiritSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis as any).__TEST_IS_DESKTOP = true;
  });

  it('renders dialog version on desktop', () => {
    (globalThis as any).__TEST_IS_DESKTOP = true;
    render(<SpiritSelect id={0} setId={() => {}} />);
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    expect(screen.getByTestId('spirit-form')).toBeInTheDocument();
  });

  it('renders drawer version on mobile', () => {
    (globalThis as any).__TEST_IS_DESKTOP = false;
    render(<SpiritSelect id={0} setId={() => {}} />);
    expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    expect(screen.getByTestId('spirit-form')).toBeInTheDocument();
  });
});
