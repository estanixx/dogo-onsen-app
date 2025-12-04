import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardStats } from '@/components/employee/dashboard/dashboard-stats';

describe('DashboardStats', () => {
  it('renders header and mocked stats', () => {
    render(<DashboardStats />);
    expect(screen.getByText(/Estado Actual/i)).toBeInTheDocument();
    // There are multiple '5' values in the component; find the large stat element specifically
    const allFives = screen.getAllByText('0%');
    // find one with the large stat class
    const largeFive = allFives.find((el) => el.className && el.className.includes('text-4xl'));
    expect(largeFive).toBeDefined();
  });
});
