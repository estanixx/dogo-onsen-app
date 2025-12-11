'use client';

import { useAdmin } from '@/context/admin-context';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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
    console.log('Selected device type:', type);
    console.log('User loaded:', isLoaded);
    console.log('User info:', user);
    await configureDevice(type);
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
          setIsProcessing(false);
          router.push('/employee');
        } catch (error) {
          console.error('Admin login failed:', error);
          alert(`Admin login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsProcessing(false);
          return;
        }
      }
    } else if (type === 'room') {
      // For room devices, redirect to room config
      setIsProcessing(false);
      router.push('/room/config');
    }
  };

  return <DeviceSelector onSelect={handleSelectDevice} />;
}
