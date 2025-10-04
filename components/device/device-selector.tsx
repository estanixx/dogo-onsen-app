"use client"

import { Building2, BedDouble } from "lucide-react"
import { DeviceCard } from "../shared/device-card"

interface DeviceSelectorProps {
  onSelect: (type: "employee" | "room") => Promise<void>
}

export function DeviceSelector({ onSelect }: DeviceSelectorProps) {

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full justify-center">
      <DeviceCard
        title="Empleados"
        description="Panel de administración para empleados del Dogo Onsen"
        icon={<Building2 className="h-6 w-6 text-[#dbb16d]"/>}
        onClick={() => onSelect("employee")}
      />
      
      <DeviceCard
        title="Habitaciones"
        description="Panel de servicios para huéspedes del Dogo Onsen"
        icon={<BedDouble className="h-6 w-6 text-[#dbb16d]"/>}
        onClick={() => onSelect("room")}
      />
    </div>
  )
}
