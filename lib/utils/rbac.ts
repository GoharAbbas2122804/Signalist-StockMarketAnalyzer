import { UserRole } from '@/lib/types/user';

export const ROLES = {
  GUEST: UserRole.GUEST,
  USER: UserRole.USER,
  ADMIN: UserRole.ADMIN
} as const;

/**
 * Check if a user has the required role
 */
export function hasRole(userRole: string, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.GUEST]: 0,
    [UserRole.USER]: 1,
    [UserRole.ADMIN]: 2
  };

  const userLevel = roleHierarchy[userRole as UserRole] ?? -1;
  const requiredLevel = roleHierarchy[requiredRole] ?? 999;

  return userLevel >= requiredLevel;
}

/**
 * Check if user has admin role
 */
export function isAdmin(userRole?: string): boolean {
  return userRole === UserRole.ADMIN;
}

/**
 * Check if user has at least user role (not guest)
 */
export function isAuthenticatedUser(userRole?: string): boolean {
  return userRole === UserRole.USER || userRole === UserRole.ADMIN;
}

/**
 * Require admin role or throw error
 */
export function requireAdmin(userRole?: string): void {
  if (!isAdmin(userRole)) {
    throw new Error('Admin access required');
  }
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [UserRole.GUEST]: 'Guest',
    [UserRole.USER]: 'User',
    [UserRole.ADMIN]: 'Admin'
  };

  return displayNames[role] || 'Unknown';
}

/**
 * Get role badge color for UI
 */
export function getRoleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'destructive' {
  const variants: Record<UserRole, 'default' | 'secondary' | 'destructive'> = {
    [UserRole.GUEST]: 'secondary',
    [UserRole.USER]: 'default',
    [UserRole.ADMIN]: 'destructive'
  };

  return variants[role] || 'default';
}
