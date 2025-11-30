import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock admin context
const logoutAdmin = vi.fn();
vi.mock('@/context/admin-context', () => ({
  useAdmin: () => ({ isAdmin: true, isLoadingAdmin: false, logoutAdmin }),
}));

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

import AdminPage from '@/app/employee/admin/page';

describe('AdminPage', () => {
  it('renders and allows logout', () => {
    render(<AdminPage />);
    expect(screen.getByText(/Empleados/i)).toBeInTheDocument();

    const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });
    fireEvent.click(logoutButton);
    expect(logoutAdmin).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/');
  });
});
