import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

describe('Sidebar cookie behavior', () => {
  it('sets sidebar_state cookie when toggled', async () => {
    // Ensure no cookie initially
    document.cookie = '';
    // Force desktop viewport so cookie path is used (sidebar cookie only set on desktop)
    // `useIsMobile` reads `window.innerWidth` in an effect, so set it before render.
    // Desktop breakpoint is 1150 in `lib/config.ts`, so use 1200 here.
    // Also dispatch a resize event after rendering if needed by the hook.
    (window as any).innerWidth = 1200; // eslint-disable-line @typescript-eslint/no-explicit-any
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>,
    );

    const btn = screen.getByRole('button');
    fireEvent.click(btn);

    // Trigger a resize event so `useIsMobile` picks up the desktop width in its effect
    window.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      expect(document.cookie).toContain('sidebar_state');
    });
  });
});
