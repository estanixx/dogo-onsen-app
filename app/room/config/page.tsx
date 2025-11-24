import { RoomConfigForm } from '@/components/device/room-config-form';
import { SyncDeviceConfig } from '@/components/device/device-config';
import { DogoPage, DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Room configuration page
 * Allows setting up a room device with a specific room identifier
 */
export default function RoomConfig() {
  async function configureRoom(roomId: string) {
    'use server';

    // Get existing config and update it with room ID
    const cookieStore = await cookies();
    const existingConfig = cookieStore.get('dogo-device-config')?.value;
    const config = existingConfig ? JSON.parse(existingConfig) : { type: 'room' };
    config.roomId = roomId;

    // Update configuration as httpOnly cookie
    cookieStore.set({
      name: 'dogo-device-config',
      value: JSON.stringify(config),
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Redirect to room dashboard
    redirect(`/room/${roomId}`);
  }

  return (
    <DogoPage>
      <div className="div w-full h-screen flex flex-col items-center justify-center">
        <SyncDeviceConfig config={{ type: 'room' }} />

        <DogoHeader title="Configuración de Habitación" />
        <DogoSection>
          <RoomConfigForm onSubmit={configureRoom} />
        </DogoSection>
      </div>
    </DogoPage>
  );
}
