import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Lightweight mocks for table primitives used by InventoryTable
vi.mock('@/components/ui/table-component', () => ({
  Table: (props: any) => React.createElement('table', props),
  TableHeader: (props: any) => React.createElement('thead', props),
  TableBody: (props: any) => React.createElement('tbody', props),
  TableRow: (props: any) => React.createElement('tr', props),
  TableHead: (props: any) => React.createElement('th', props),
  TableCell: (props: any) => React.createElement('td', props),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, ...rest }: any) =>
    React.createElement('input', { value, onChange, ...rest }),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...rest }: any) => React.createElement('button', rest, children),
}));

const mockGetItems = vi.fn();
vi.mock('@/lib/api', () => ({ getItems: () => mockGetItems() }));

import { InventoryTable } from '@/components/employee/inventory/inventory-table';

describe('InventoryTable', () => {
  it('shows loading then renders items', async () => {
    mockGetItems.mockResolvedValueOnce([
      { id: '1', name: 'Agua', quantity: 20, unit: 'u' },
    ]);

    render(<InventoryTable />);

    expect(screen.getByText(/Cargando inventario/)).toBeInTheDocument();

    await waitFor(() => expect(mockGetItems).toHaveBeenCalled());
    expect(screen.getByText('Agua')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('filters by search query', async () => {
    mockGetItems.mockResolvedValueOnce([
      { id: '1', name: 'Gin', quantity: 5, unit: 'bot' },
      { id: '2', name: 'Vodka', quantity: 15, unit: 'bot' },
    ]);

    render(<InventoryTable />);
    await waitFor(() => expect(mockGetItems).toHaveBeenCalled());

    fireEvent.change(screen.getByPlaceholderText(/Buscar producto/i), {
      target: { value: 'Gin' },
    });

    expect(screen.getByText('Gin')).toBeInTheDocument();
    expect(screen.queryByText('Vodka')).not.toBeInTheDocument();
  });

  it('marks low inventory items', async () => {
    mockGetItems.mockResolvedValueOnce([
      { id: '1', name: 'Agua', quantity: 3, unit: 'u' },
    ]);

    render(<InventoryTable />);
    await waitFor(() => expect(mockGetItems).toHaveBeenCalled());

    expect(await screen.findByText(/Bajo inventario/i)).toBeInTheDocument();
  });
});
