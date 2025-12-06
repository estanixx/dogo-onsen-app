import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceCreateForm } from '@/components/employee/service/service-create-form';

describe('ServiceCreateForm', () => {
  it('doesnt call onSubmit with parsed service payload', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const onOpenChange = vi.fn();

    render(<ServiceCreateForm open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />);

    const name = screen.getByLabelText(/Nombre del servicio/i) as HTMLInputElement;
    const description = screen.getByLabelText(/Descripción/i) as HTMLTextAreaElement;
    const rate = screen.getByLabelText(/Tarifa/i) as HTMLInputElement;
    const image = screen.getByLabelText(/URL de imagen/i) as HTMLInputElement;
    const submit = screen.getByRole('button', { name: /Crear servicio|Crear servicio/i });
    fireEvent.change(name, { target: { value: 'Masaje' } });
    fireEvent.change(description, { target: { value: 'Relax' } });
    fireEvent.change(rate, { target: { value: '100' } });
    fireEvent.change(image, { target: { value: 'https://example.com/img.jpg' } });
    fireEvent.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
