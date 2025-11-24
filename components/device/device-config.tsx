/**
 * Client component for handling localStorage synchronization of device configuration
 */
'use client';

import { useEffect } from 'react';
import { saveDeviceConfig, DeviceConfig } from '@/lib/config';

export function SyncDeviceConfig({ config }: { config: DeviceConfig }) {
  useEffect(() => {
    // Sync device configuration to localStorage when it changes
    saveDeviceConfig(config);
  }, [config]);

  useEffect(() => {
    // When running in the browser, fetch the authoritative device config
    // from the backend (cookie is httpOnly). This keeps localStorage in sync.
    async function syncFromServer() {
      try {
        const resp = await fetch('/api/device-config');
        if (resp.status === 204) {
          return;
        }
        if (!resp.ok) {
          return;
        }
        const cfg = await resp.json();
        if (cfg) {
          saveDeviceConfig(cfg as DeviceConfig);
        }
      } catch (e) {
        // ignore network errors
      }
    }

    if (typeof window !== 'undefined') {
      syncFromServer();
    }
  }, []);

  return null;
}
