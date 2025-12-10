import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({ __esModule: true, default: (props: any) => React.createElement('img', { ...props, alt: props.alt }) }));

import { ServiceCard } from '@/components/room/service/service-card';
import { Service } from '@/lib/types';

describe('Room ServiceCard', () => {
  it('renders service and triggers onSelect', () => {
    const service = { id: 's1', name: 'Room Service', eiltRate: 10 } as unknown as Service;
    const onSelect = vi.fn();
    render(<ServiceCard service={service} onSelect={onSelect} />);
    expect(screen.getByText('Room Service')).toBeInTheDocument();
    const container = screen.getByRole('button');
    fireEvent.click(container);
    expect(onSelect).toHaveBeenCalledWith(service);
  });

  it('triggers onSelect with keyboard Enter and Space', () => {
    const service = { id: 's2', name: 'Room Service 2', eiltRate: 5 } as unknown as Service;
    const onSelect = vi.fn();
    render(<ServiceCard service={service} onSelect={onSelect} />);
    const container = screen.getByRole('button');
    fireEvent.keyDown(container, { key: 'Enter' });
    fireEvent.keyDown(container, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});
