'use client';

import { getWebInstrumentations, initializeFaro } from '@grafana/faro-react';
import { useEffect } from 'react';

export default function FrontendObservability() {
  // skip if already initialized
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Skip initialization if Faro URL is not configured
    if (!process.env.NEXT_PUBLIC_FARO_URL || process.env.NEXT_PUBLIC_FARO_URL === 'my-url') {
      console.warn('Faro telemetry not configured (NEXT_PUBLIC_FARO_URL missing or placeholder)');
      return;
    }

    try {
      const faro = initializeFaro({
        url: process.env.NEXT_PUBLIC_FARO_URL,
        app: {
          name: process.env.NEXT_PUBLIC_FARO_APP_NAME || 'unknown_service:webjs',
          namespace: process.env.NEXT_PUBLIC_FARO_APP_NAMESPACE || undefined,
          version: process.env.VERCEL_DEPLOYMENT_ID || '1.0.0',
          environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
        },
        instrumentations: [
          // Mandatory, omits default instrumentations otherwise.
          ...getWebInstrumentations(),
        ],
      });
    } catch (e) {
      console.error('Failed to initialize Faro telemetry:', e);
    }
  }, []);

  return <></>;
}
