/**
 * Client component for handling localStorage synchronization of device configuration
 */
"use client"

import { useEffect } from "react"
import { saveDeviceConfig, DeviceConfig } from "@/lib/config"

export function SyncDeviceConfig({ config }: { config: DeviceConfig }) {
  useEffect(() => {
    // Sync device configuration to localStorage when it changes
    saveDeviceConfig(config)
  }, [config])

  return null
}
