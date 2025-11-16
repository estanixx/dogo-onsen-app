'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';
import type {
  EmployeeAccessStatus,
  EmployeeProfile,
  EmployeeRole,
  EmployeeAuthState,
} from '@/lib/types';

interface EmployeeContextType extends EmployeeAuthState {
  refreshEmployeeProfile: () => Promise<void>;
  signOutEmployee: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();

  const employeeProfile = useMemo(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return null;
    }
    return mapClerkUserToEmployeeProfile(user);
  }, [isLoaded, isSignedIn, user]);

  const accessStatus: EmployeeAccessStatus = employeeProfile?.accessStatus ?? 'pending';
  const hasApprovedAccess = accessStatus === 'approved';

  const refreshEmployeeProfile = useCallback(async () => {
    if (user && 'reload' in user && typeof user.reload === 'function') {
      await user.reload();
    }
  }, [user]);

  const signOutEmployee = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const value: EmployeeContextType = {
    employeeProfile,
    accessStatus,
    isEmployeeAuthenticated: Boolean(isSignedIn && employeeProfile),
    isEmployeeLoading: !isLoaded,
    hasApprovedAccess,
    refreshEmployeeProfile,
    signOutEmployee,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}

function mapClerkUserToEmployeeProfile(user: UserResource): EmployeeProfile {
  const {
    id,
    firstName,
    lastName,
    fullName,
    imageUrl,
    emailAddresses,
    publicMetadata,
    primaryEmailAddress,
  } = user;

  const metadata =
    typeof publicMetadata === 'object' && publicMetadata !== null ? publicMetadata : {};
  const resolvedRole = resolveEmployeeRole((metadata as Record<string, unknown>).role);
  const resolvedAccess = resolveEmployeeAccessStatus(
    (metadata as Record<string, unknown>).accessStatus,
  );

  const organizationIds = extractOrganizationIds(user);

  const fallbackFullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

  return {
    id,
    clerkId: id,
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    fullName: fullName ?? fallbackFullName,
    emailAddress: primaryEmailAddress?.emailAddress ?? emailAddresses?.[0]?.emailAddress ?? '',
    imageUrl: imageUrl ?? undefined,
    role: resolvedRole,
    accessStatus: resolvedAccess,
    organizationIds,
  };
}

function resolveEmployeeRole(candidate: unknown): EmployeeRole {
  if (
    candidate === 'reception' ||
    candidate === 'banquet' ||
    candidate === 'inventory' ||
    candidate === 'services' ||
    candidate === 'admin'
  ) {
    return candidate;
  }
  return 'reception';
}

function resolveEmployeeAccessStatus(candidate: unknown): EmployeeAccessStatus {
  if (candidate === 'approved' || candidate === 'pending' || candidate === 'revoked') {
    return candidate;
  }
  return 'pending';
}

type ClerkOrganizationMembership = {
  organization: { id: string };
};

function extractOrganizationIds(user: UserResource): string[] {
  const candidate = user as unknown as {
    organizationMemberships?: ClerkOrganizationMembership[];
  };

  if (!Array.isArray(candidate.organizationMemberships)) {
    return [];
  }

  return candidate.organizationMemberships.map((membership) => membership.organization.id);
}
