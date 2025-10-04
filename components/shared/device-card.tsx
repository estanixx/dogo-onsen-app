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
    <Card 
      onClick={onClick}
      className="
        cursor-pointer 
        flex flex-col items-start gap-3 
        p-6 rounded-2xl 
        shadow-md 
        transition 
        duration-300 
        hover:shadow-lg 
        hover:scale-105 
        hover:bg-muted/40
        active:scale-96
      ">
      {icon}
      <div className="flex flex-col">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  )
}
