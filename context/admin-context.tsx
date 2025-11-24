'use client';

import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface AdminContextType {
  isAdmin: boolean;
  isLoadingAdmin: boolean;
  loginAsAdmin: (clerkId: string) => Promise<void>;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Check for existing admin token in cookies on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Token is automatically sent by browser with credentials: 'include'
      // No need to manually track it
    }
  }, []);

  const isAdmin = useMemo(() => {
    if (!isLoaded || !user) {
      return false;
    }
    const metadata =
      typeof user.publicMetadata === 'object' && user.publicMetadata !== null
        ? user.publicMetadata
        : {};
    return (metadata as Record<string, unknown>).role === 'admin';
  }, [isLoaded, user]);

  const loginAsAdmin = useCallback(async (clerkId: string) => {
    setIsLoadingAdmin(true);
    try {
      const response = await fetch('/api/employees/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerk_id: clerkId }),
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = 'Failed to login as admin';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }

      // Token is automatically set in HttpOnly cookie by the API route
      // No need to manually handle it
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setIsLoadingAdmin(false);
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    // Clear admin token cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'dogo-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
  }, []);

  const value: AdminContextType = {
    isAdmin,
    isLoadingAdmin,
    loginAsAdmin,
    logoutAdmin,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
