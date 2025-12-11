import { ServiceCreateForm } from '@/components/employee/service/service-create-form';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Local expected items used for assertions (do NOT reference this inside vi.mock factories)
const mockItems = [
  { id: 1, name: 'Toallas', unit: 'unidades' },
  { id: 2, name: 'Sales de baño', unit: 'kg' },
];

// Mock modules: factories must not reference top-level mutable bindings because vi.mock is hoisted.
vi.mock('@/lib/api', () => ({
  getItems: vi.fn(async () => [
    { id: 1, name: 'Toallas', unit: 'unidades' },
    { id: 2, name: 'Sales de baño', unit: 'kg' },
  ]),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

describe('ServiceCreateForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('matches snapshot when open and items loaded', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const onOpenChange = vi.fn();

    const { container } = render(
      <ServiceCreateForm open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />,
    );

    // wait for items to load into the select
    await waitFor(() => expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0));

    expect(container).toMatchSnapshot();
  });

  it('does not call onSubmit when rows have missing item selection', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const onOpenChange = vi.fn();

    render(<ServiceCreateForm open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />);

    // Wait for items to be available
    await waitFor(() => expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0));

    // Fill other fields but do not select item
    fireEvent.change(screen.getByLabelText(/Nombre del servicio/i), {
      target: { value: 'Masaje' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Relax' } });
    fireEvent.change(screen.getByLabelText(/Tarifa/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/URL de imagen/i), {
      target: { value: 'https://example.com/img.jpg' },
    });

    const submit = screen.getByRole('button', { name: /Crear servicio/i });
    fireEvent.click(submit);

    await waitFor(() => expect(toast.error as any).toHaveBeenCalled());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with parsed payload when form is valid', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const onOpenChange = vi.fn();

    render(<ServiceCreateForm open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />);

    // Wait for items
    await waitFor(() => expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0));

    // Fill fields
    fireEvent.change(screen.getByLabelText(/Nombre del servicio/i), {
      target: { value: 'Masaje' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Relax' } });
    fireEvent.change(screen.getByLabelText(/Tarifa/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/URL de imagen/i), {
      target: { value: 'https://example.com/img.jpg' },
    });

    // Select first available item in the items select (combobox)
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
    const itemSelect = selects[0] as HTMLSelectElement;
    fireEvent.change(itemSelect, { target: { value: String(mockItems[0].id) } });

    // Quantity input: select last spinbutton (there are two numeric inputs: eiltRate and quantity)
    const spinbuttons = screen.getAllByRole('spinbutton');
    // Ensure at least two: eiltRate and quantity
    expect(spinbuttons.length).toBeGreaterThanOrEqual(2);
    const qtyInput = spinbuttons[spinbuttons.length - 1] as HTMLInputElement;
    fireEvent.change(qtyInput, { target: { value: '2' } });

    const submit = screen.getByRole('button', { name: /Crear servicio/i });
    fireEvent.click(submit);

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());

    // Validate payload
    const call = (onSubmit as any).mock.calls[0];
    const servicePayload = call[0];
    const itemsPayload = call[1];
    expect(servicePayload).toMatchObject({
      name: 'Masaje',
      description: 'Relax',
      eiltRate: 100,
      image: 'https://example.com/img.jpg',
    });
    expect(itemsPayload).toEqual([{ itemId: mockItems[0].id, quantity: 2 }]);
    // should close dialog
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows error when removing the only row and submitting', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const onOpenChange = vi.fn();

    render(<ServiceCreateForm open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0));

    // Remove the only row
    const removeButtons = screen.getAllByRole('button', { name: /Eliminar/i });
    expect(removeButtons.length).toBeGreaterThan(0);
    fireEvent.click(removeButtons[0]);

    // Fill other fields minimally
    fireEvent.change(screen.getByLabelText(/Nombre del servicio/i), {
      target: { value: 'Masaje' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Relax' } });
    fireEvent.change(screen.getByLabelText(/Tarifa/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/URL de imagen/i), {
      target: { value: 'https://example.com/img.jpg' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Crear servicio/i }));

    await waitFor(() => expect(toast.error as any).toHaveBeenCalled());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables add button when items exhausted', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const onOpenChange = vi.fn();

    render(<ServiceCreateForm open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0));

    const addButton = screen.getByRole('button', { name: /Agregar item/i });
    // With two available items and one initial row, adding one more should be allowed
    expect(addButton).not.toBeDisabled();
    fireEvent.click(addButton);
    // After adding second row, further add should be disabled
    await waitFor(() => expect(addButton).toBeDisabled());
  });
});
