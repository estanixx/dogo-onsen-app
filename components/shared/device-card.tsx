"use client"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface DeviceCardProps {
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
}

/**
 * A card component for device type selection
 * Used in the homepage for choosing between employee and room devices
 */

export function DeviceCard({ title, description, icon, onClick }: DeviceCardProps) {
  return (
    <Card onClick={onClick}>
      {icon}
      <div className="flex flex-col">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  )
}
