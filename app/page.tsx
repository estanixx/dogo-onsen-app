import { DeviceConfigurator } from '@/components/device/device-configurator';
import { SyncDeviceConfig } from '@/components/device/device-config';
import { DogoPage, DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Homepage component for device type selection
 * Allows users to configure the device as either an employee workstation or room tablet
 */
export default function Home() {
  async function configureDevice(type: 'employee' | 'room') {
    'use server';
    // Save configuration in cookies (for middleware)
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'dogo-device-config',
      value: JSON.stringify({ type }),
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    // Redirect based on device type
    if (type === 'employee') {
      redirect('/employee');
    } else {
      redirect('/room/config');
    }
  }

  return (
    <DogoPage>
      <div className="div w-full h-screen flex flex-col items-center justify-center">
        <SyncDeviceConfig config={{ type: 'room' }} />

        <DogoHeader
          title="Dogo Onsen"
          subtitle="Selecciona el tipo de dispositivo para comenzar tu viaje espiritual"
        />

        <DogoSection>
          <DeviceConfigurator configureDevice={configureDevice} />
        </DogoSection>
      </div>
    </DogoPage>
  );
}
