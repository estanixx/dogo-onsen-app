import { DeviceSelector } from "@/components/device/device-selector";
import { SyncDeviceConfig } from "@/components/device/device-config";
import { DogoPage, DogoHeader, DogoSection } from "@/components/shared/dogo-ui";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Homepage component for device type selection
 * Allows users to configure the device as either an employee workstation or room tablet
 */
export default function Home() {
  async function configureDevice(type: "employee" | "room") {
    "use server";
    
    // Save configuration in cookies (for middleware)
    const cookieStore = await cookies();
    cookieStore.set("dogo-device-config", JSON.stringify({ type }));
    
    // Redirect based on device type
    if (type === "employee") {
      redirect("/employee");
    } else {
      redirect("/room/config");
    }
  }

  return (
    <DogoPage>
      <div className="div w-full h-screen flex flex-col items-center justify-center">

      <SyncDeviceConfig config={{ type: "room" }} />
      
      <DogoHeader 
        title="Dogo Onsen"
        subtitle="Selecciona el tipo de dispositivo para comenzar tu viaje espiritual"
      />

      <DogoSection>
        <DeviceSelector onSelect={configureDevice} />
      </DogoSection>
      </div>
    </DogoPage>
  );
}
