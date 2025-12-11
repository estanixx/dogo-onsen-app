import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  getCurrentVenueAccount: vi.fn(async () => ({ id: 'v1', pin: '0000' })),
}));
vi.mock('react-icons/md', () => ({
  MdOutlineMeetingRoom: () => React.createElement('span', null, 'icon'),
}));
vi.mock('react-icons/vsc', () => ({ VscKey: () => React.createElement('span', null, 'icon') }));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
// Mock Input and Dogo UI components
vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => React.createElement('input', { ...props }),
}));
vi.mock('@/components/shared/dogo-ui', () => ({
  DogoCard: ({ children }: any) => React.createElement('div', null, children),
  DogoButton: (props: any) => React.createElement('button', { ...props }, props.children),
}));

import { RoomConfigForm } from '@/components/device/room-config-form';

describe('RoomConfigForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders input fields and submit button', () => {
    const onSubmit = vi.fn(async () => {});
    render(<RoomConfigForm onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText(/Identificador de habitación/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/PIN de seguridad/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Configurar/i })).toBeInTheDocument();
  });

  it('inputs have required attributes', async () => {
    const onSubmit = vi.fn(async () => {});
    render(<RoomConfigForm onSubmit={onSubmit} />);
    const room = screen.getByPlaceholderText(/Identificador de habitación/i);
    const pin = screen.getByPlaceholderText(/PIN de seguridad/i);
    expect(room).toHaveAttribute('required');
    expect(pin).toHaveAttribute('required');
  });
});
