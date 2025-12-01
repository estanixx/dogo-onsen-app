import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Clerk useUser (setup.ts also provides a default mock)
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({ user: { id: 'u1', publicMetadata: { role: 'admin' } }, isLoaded: true }),
}));

// Mock admin context
const loginAsAdmin = vi.fn(() => Promise.resolve());
vi.mock('@/context/admin-context', () => ({
  useAdmin: () => ({ loginAsAdmin }),
}));

// Mock next/navigation
const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

import { DeviceConfigurator } from '@/components/device/device-configurator';

describe('DeviceConfigurator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in as admin and redirects when selecting employee device and user is admin', async () => {
    render(<DeviceConfigurator configureDevice={async () => {}} />);

    const titles = screen.getAllByText(/Empleados/i);
    const title = titles.find((el) => el.getAttribute('data-slot') === 'card-title') || titles[0];
    const card = title.closest('[data-slot="card"]') || title.parentElement;
    if (!card) {
      throw new Error('Card element not found');
    }
    fireEvent.click(card);

    await waitFor(() => {
      expect(loginAsAdmin).toHaveBeenCalledWith('u1');
      expect(push).toHaveBeenCalledWith('/employee/admin');
    });
  });

  it('calls configureDevice with "room" when selecting room device', async () => {
    const configureDeviceMock = vi.fn();
    render(<DeviceConfigurator configureDevice={configureDeviceMock} />);

    // Updated to match "Habitaciones" from the component
    const titles = screen.getAllByText(/Habitaciones/i);
    const title = titles.find((el) => el.getAttribute('data-slot') === 'card-title') || titles[0];
    const card = title.closest('[data-slot="card"]') || title.parentElement;
    if (!card) {
      throw new Error('Card element not found');
    }
    fireEvent.click(card);

    await waitFor(() => {
      expect(configureDeviceMock).toHaveBeenCalledWith('room');
    });
  });
});
