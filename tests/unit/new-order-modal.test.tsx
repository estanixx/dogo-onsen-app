import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dialog + scroll primitives
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => React.createElement('div', null, children),
  DialogContent: ({ children }: any) => React.createElement('div', null, children),
  DialogDescription: ({ children }: any) => React.createElement('div', null, children),
  DialogFooter: ({ children }: any) => React.createElement('div', null, children),
  DialogHeader: ({ children }: any) => React.createElement('div', null, children),
  DialogTitle: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => React.createElement('div', null, children),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...rest }: any) => React.createElement('button', rest, children),
}));
vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => React.createElement('input', props),
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...rest }: any) => React.createElement('label', rest, children),
}));

const mockGetItems = vi.fn();
const mockCreateOrder = vi.fn();
vi.mock('@/lib/api', () => ({
  getItems: () => mockGetItems(),
  createOrder: (...args: any[]) => mockCreateOrder(...args),
}));

// Provide an employee profile so submit is enabled
vi.mock('@/context/employee-context', () => ({
  useEmployee: () => ({ employeeProfile: { id: 'emp1', clerkId: 'emp1' } }),
}));

// Silence toasts
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { NewOrderModal } from '@/components/employee/inventory/new-order-modal';

describe('NewOrderModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads products when opened', async () => {
    mockGetItems.mockResolvedValueOnce([
      { id: '1', name: 'Agua', unit: 'u' },
      { id: '2', name: 'Jugo', unit: 'u' },
    ]);

    render(<NewOrderModal open onOpenChange={() => {}} />);

    await waitFor(() => expect(mockGetItems).toHaveBeenCalled());
    expect(screen.getByText(/Agua/)).toBeInTheDocument();
  });

  it('adds and removes items', async () => {
    mockGetItems.mockResolvedValue([
      { id: '1', name: 'Agua', unit: 'u' },
      { id: '2', name: 'Jugo', unit: 'u' },
    ]);

    render(<NewOrderModal open onOpenChange={() => {}} />);
    await waitFor(() => expect(mockGetItems).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /Agregar producto/i }));
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2);

    fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/i })[1]);
    expect(screen.getAllByRole('combobox').length).toBe(1);
  });

  it('disables submit with invalid quantity and calls API on success', async () => {
    mockGetItems.mockResolvedValue([{ id: '1', name: 'Agua', unit: 'u' }]);
    mockCreateOrder.mockResolvedValue({ id: 'order1' });

    const handleOpenChange = vi.fn();
    const handleCreated = vi.fn();

    render(<NewOrderModal open onOpenChange={handleOpenChange} onOrderCreated={handleCreated} />);
    await waitFor(() => expect(mockGetItems).toHaveBeenCalled());

    // Set invalid quantity to disable
    fireEvent.change(screen.getByLabelText(/Cantidad/i), { target: { value: '0' } });
    const submitBtn = screen.getByRole('button', { name: /Realizar pedido/i });
    expect(submitBtn).toBeDisabled();

    // Fix quantity and submit
    fireEvent.change(screen.getByLabelText(/Cantidad/i), { target: { value: '2' } });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => expect(mockCreateOrder).toHaveBeenCalled());
    expect(handleCreated).toHaveBeenCalledWith({ id: 'order1' });
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
