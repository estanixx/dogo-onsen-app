"use client"

import { Building2, BedDouble } from "lucide-react"
import { CardButton } from "../shared/card-button"

interface DeviceSelectorProps {
  onSelect: (type: "employee" | "room") => Promise<void>
}

export function DeviceSelector({ onSelect }: DeviceSelectorProps) {

  return (
    <div className="mx-auto flex flex-col md:flex-row gap-6 max-w-4xl w-full justify-center">
      <CardButton
        title="Empleados"
        description="Panel de administración para empleados del Dogo Onsen"
        icon={<Building2 className='size-6 text-primary' />}
        onClick={() => onSelect("employee")}
      />
      
      <CardButton
        title="Habitaciones"
        description="Panel de servicios para huéspedes del Dogo Onsen"
        icon={<BedDouble className='size-6 text-primary' />}
        onClick={() => onSelect("room")}
      />
    </div>
  )
}
