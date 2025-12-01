/**
 * Device configuration utilities for managing device type and room settings
 */

export type DeviceType = 'employee' | 'room';

export interface DeviceConfig {
  type: DeviceType;
  roomId?: string;
}

const CONFIG_KEY = 'dogo-device-config';

/**
 * Save device configuration to localStorage
 */
export const saveDeviceConfig = (config: DeviceConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }
};

/**
 * Get current device configuration from localStorage
 */
export const getDeviceConfig = (): DeviceConfig | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return null;
};

/**
 * Clear device configuration from localStorage
 */
export const clearDeviceConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONFIG_KEY);
  }
};

/**
 * Check if device is configured
 */
export const isDeviceConfigured = (): boolean => {
  const config = getDeviceConfig();
  if (!config) {
    return false;
  }

  // For room devices, both type and roomId must be set
  if (config.type === 'room') {
    return Boolean(config.roomId);
  }

  // For employee devices, only type is required
  return config.type === 'employee';
};

// Breakpoints
export const DESKTOP_BREAKPOINT = 1150; // widths >= 1150px considered desktop
export const DESKTOP_MIN_QUERY = `(min-width: ${DESKTOP_BREAKPOINT}px)`;
export const MOBILE_MAX_QUERY = `(max-width: ${DESKTOP_BREAKPOINT - 1}px)`;

