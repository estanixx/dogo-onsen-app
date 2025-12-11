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
