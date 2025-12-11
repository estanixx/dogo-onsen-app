import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock UI primitives
vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => React.createElement('button', { ...props }, props.children),
}));
vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => React.createElement('input', { ...props }),
}));
vi.mock('@/components/ui/label', () => ({
  Label: (props: any) => React.createElement('label', { ...props }, props.children),
}));

// Mock select like previous tests using context so SelectItem can call onValueChange
vi.mock('@/components/ui/select', () => {
  const React = require('react');
  const Ctx = React.createContext<any>(null);
  const Select = ({ children, value, onValueChange }: any) =>
    React.createElement(Ctx.Provider, { value: { onValueChange, value } }, children);
  const SelectTrigger = ({ children }: any) => React.createElement('div', null, children);
  const SelectContent = ({ children }: any) => React.createElement('div', null, children);
  const SelectValue = ({ placeholder }: any) => React.createElement('div', null, placeholder);
  const SelectItem = ({ children, value }: any) => {
    const ctx = React.useContext(Ctx);
    return React.createElement('button', { onClick: () => ctx?.onValueChange?.(value) }, children);
  };
  return { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
});

// Mock CameraCapture to avoid camera behavior in spirit-form tests
vi.mock('./camera-capture', () => ({
  __esModule: true,
  default: ({ onCapture, onUploadComplete }: any) =>
    React.createElement('div', { 'data-testid': 'mock-camera' }, 'camera'),
}));

// Mock SpiritCard to avoid heavy rendering
vi.mock('@/components/shared/spirit-card', () => ({
  __esModule: true,
  default: ({ spirit }: any) =>
    React.createElement('div', { 'data-testid': `spirit-${spirit?.id}` }, `spirit-${spirit?.id}`),
}));

// Mock spirit context
vi.mock('@/context/spirit-context', () => ({
  useSpirit: () => ({ spirits: [], setSpirits: () => {} }),
}));

// Mock API
const mockGetAllTypes = vi.fn(async () => [{ id: 't1', name: 'Type1' }]);
const mockGetSpirit = vi.fn(async (id: number) => null);
const mockCreateSpirit = vi.fn(async (id: number, name: string, typeId: string, image: string) => ({
  id: id,
  name,
}));
vi.mock('@/lib/api', () => ({
  getAllSpiritTypes: () => mockGetAllTypes(),
  getSpirit: (...args: any[]) => mockGetSpirit(...args),
  createSpirit: (...args: any[]) => mockCreateSpirit(...args),
}));

import SpiritForm from '@/components/employee/reception/spirit-form';

describe('SpiritForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads spirit types on mount', async () => {
    render(<SpiritForm id={1} setId={() => {}} setOpen={() => {}} />);
    await waitFor(() => expect(mockGetAllTypes).toHaveBeenCalled());
  });

  it('lookup calls getSpirit and shows create UI when not found', async () => {
    render(<SpiritForm id={7} setId={() => {}} setOpen={() => {}} />);
    const btn = screen.getByRole('button', { name: /Buscar/i });
    fireEvent.click(btn);
    await waitFor(() => expect(mockGetSpirit).toHaveBeenCalledWith(7));
    // After lookup with null, the form should show Crear button (creating state)
    expect(screen.getByRole('button', { name: /Crear/i })).toBeInTheDocument();
  });
});
