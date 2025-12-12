'use client';

import { useAdmin } from '@/context/admin-context';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DeviceSelector } from './device-selector';

interface DeviceConfiguratorProps {
  configureDevice: (type: 'employee' | 'room') => Promise<void>;
}

export function DeviceConfigurator({ configureDevice }: DeviceConfiguratorProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const { loginAsAdmin } = useAdmin();
  const router = useRouter();

  const handleSelectDevice = async (type: 'employee' | 'room') => {
    // If employee device selected and user is admin, handle admin login

    if (type === 'employee') {
      clerk.openSignIn();
    } else if (type === 'room') {
      await configureDevice(type);
      router.push('/room/config');
    }
  };

  // In case the user has signed in, register as employee and go ahead.
  useEffect(() => {
    const registerEmployeeDevice = async () => {
      if (isSignedIn && isLoaded && user) {
        const metadata =
          typeof user.publicMetadata === 'object' && user.publicMetadata !== null
            ? user.publicMetadata
            : {};
        if ((metadata as Record<string, unknown>).role === 'admin') {
          try {
            await loginAsAdmin(user.id);
            await configureDevice('employee');
            router.push('/employee/admin');
          } catch (error) {
            console.error('Admin login failed:', error);
            alert(
              `Admin login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
          }
        }
      }
    };
    registerEmployeeDevice();
  }, [isSignedIn, isLoaded, user, loginAsAdmin, configureDevice, router]);

  return <DeviceSelector onSelect={handleSelectDevice} />;
}
