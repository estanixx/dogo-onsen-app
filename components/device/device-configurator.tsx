'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/admin-context';
import { useState } from 'react';
import { DeviceSelector } from './device-selector';

interface DeviceConfiguratorProps {
  configureDevice: (type: 'employee' | 'room') => Promise<void>;
}

export function DeviceConfigurator({ configureDevice }: DeviceConfiguratorProps) {
  const { user, isLoaded } = useUser();
  const { loginAsAdmin } = useAdmin();
  const router = useRouter();
  const [, setIsProcessing] = useState(false);

  const handleSelectDevice = async (type: 'employee' | 'room') => {
    setIsProcessing(true);

    // If employee device selected and user is admin, handle admin login
    if (type === 'employee' && isLoaded && user) {
      const metadata =
        typeof user.publicMetadata === 'object' && user.publicMetadata !== null
          ? user.publicMetadata
          : {};

      if ((metadata as Record<string, unknown>).role === 'admin') {
        try {
          // Login as admin and get token
          await loginAsAdmin(user.id);
          // Redirect to admin dashboard
          router.push('/employee/admin');
          return;
        } catch (error) {
          console.error('Admin login failed:', error);
          alert(`Admin login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsProcessing(false);
          return;
        }
      }
    }

    // Normal flow
    try {
      await configureDevice(type);
    } finally {
      setIsProcessing(false);
    }
  };

  return <DeviceSelector onSelect={handleSelectDevice} />;
}
