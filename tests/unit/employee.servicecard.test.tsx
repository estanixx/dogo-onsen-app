import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock next/image to a simple img element
vi.mock('next/image', () => ({ __esModule: true, default: (props: any) => React.createElement('img', { ...props, alt: props.alt }) }));

import { ServiceCard } from '@/components/employee/service/service-card';
import { Service } from '@/lib/types';

describe('ServiceCard', () => {
  it('renders service name and rate and calls onSelect when clicked', () => {
    const service = { id: 's1', name: 'My Service', eiltRate: 42, image: undefined } as unknown as Service;
    const onSelect = vi.fn();

    render(<ServiceCard service={service} onSelect={onSelect} />);

    expect(screen.getByText('My Service')).toBeInTheDocument();
    expect(screen.getByText('42 EILT')).toBeInTheDocument();

    // The outer div has role="button"; find it via the service title to avoid inner buttons
    const title = screen.getByText('My Service');
    const container = title.closest('[role="button"]') as HTMLElement | null;
    expect(container).not.toBeNull();
    fireEvent.click(container!);
    expect(onSelect).toHaveBeenCalledWith(service);

    // Keyboard activation: Enter
    fireEvent.keyDown(container!, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(2);

    // Keyboard activation: Space
    fireEvent.keyDown(container!, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(3);
  });
});
