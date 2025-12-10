import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Button since component imports it
vi.mock('@/components/ui/button', () => ({ Button: (props: any) => React.createElement('button', { ...props }, props.children) }));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import CameraCapture from '@/components/employee/reception/camera-capture';

describe('CameraCapture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure navigator.mediaDevices mock exists
    (globalThis as any).navigator = (globalThis as any).navigator || {};
    (globalThis as any).navigator.mediaDevices = (globalThis as any).navigator.mediaDevices || {};
  });

  it('calls getUserMedia when opening camera', async () => {
    const fakeStream = { getTracks: () => [] };
    const getUserMedia = vi.fn(async () => fakeStream);
    (globalThis as any).navigator.mediaDevices.getUserMedia = getUserMedia;

    const onCapture = vi.fn();
    render(<CameraCapture typeId={''} onCapture={onCapture} />);

    const openBtn = screen.getByRole('button', { name: /Abrir cámara/i });
    fireEvent.click(openBtn);

    await waitFor(() => expect(getUserMedia).toHaveBeenCalled());
  });

  it('produces a dataUrl and calls onCapture when taking a photo', async () => {
    const fakeStream = { getTracks: () => [] };
    const getUserMedia = vi.fn(async () => fakeStream);
    (globalThis as any).navigator.mediaDevices.getUserMedia = getUserMedia;

    const onCapture = vi.fn();
    render(<CameraCapture typeId={''} onCapture={onCapture} />);

    // Open camera first
    fireEvent.click(screen.getByRole('button', { name: /Abrir cámara/i }));
    await waitFor(() => expect(getUserMedia).toHaveBeenCalled());

    // Get DOM video and canvas elements created by the component
    const video = document.querySelector('video') as HTMLVideoElement;
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    // Simulate a running video by setting dimensions
    if (video) {
      Object.defineProperty(video, 'videoWidth', { value: 320, configurable: true });
      Object.defineProperty(video, 'videoHeight', { value: 240, configurable: true });
    }

    // Mock canvas methods
    if (canvas) {
      canvas.getContext = () => ({ drawImage: () => {} }) as any;
      canvas.toDataURL = (_: string) => 'data:image/png;base64,TEST';
    }

    // Click take photo
    fireEvent.click(screen.getByRole('button', { name: /Tomar foto/i }));

    await waitFor(() => expect(onCapture).toHaveBeenCalledWith('data:image/png;base64,TEST'));
  });
});
