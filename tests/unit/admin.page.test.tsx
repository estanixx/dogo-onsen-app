import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock admin context
const logoutAdmin = vi.fn();
const useAdminMock = vi.fn();

vi.mock('@/context/admin-context', () => ({
  useAdmin: () => useAdminMock(),
}));

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

import AdminPage from '@/app/employee/admin/page';

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and allows logout for admin', () => {
    useAdminMock.mockReturnValue({ isAdmin: true, isLoadingAdmin: false, logoutAdmin });
    render(<AdminPage />);
    expect(screen.getByText(/Empleados/i)).toBeInTheDocument();

    const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });
    fireEvent.click(logoutButton);
    expect(logoutAdmin).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/');
  });

  it('redirects to home if user is not admin', () => {
    useAdminMock.mockReturnValue({ isAdmin: false, isLoadingAdmin: false, logoutAdmin });
    render(<AdminPage />);

    expect(push).toHaveBeenCalledWith('/');
    expect(screen.queryByText(/Empleados/i)).not.toBeInTheDocument();
  });
});
