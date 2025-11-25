import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth/auth';
import { isAdmin } from './rbac';

export interface AdminSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string | null;
    role?: string;
  };
  session: {
    token: string;
    expiresAt: Date;
  };
}

/**
 * Get the current session for admin operations
 * Returns null if no session or user is not an admin
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return null;
    }

    // Type assertion with role check
    const userWithRole = session.user as any;
    const role = userWithRole.role;

    if (!isAdmin(role)) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined,
        image: session.user.image,
        role: role
      },
      session: {
        token: session.session.token,
        expiresAt: session.session.expiresAt
      }
    };
  } catch (error) {
    console.error('Error getting admin session:', error);
    return null;
  }
}

/**
 * Require admin session or throw error
 * Use this in API routes and server actions that require admin access
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    throw new Error('Unauthorized: Admin access required');
  }

  return session;
}

/**
 * Get request metadata for audit logging
 */
export async function getRequestMetadata() {
  const headersList = await headers();
  
  return {
    ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown',
    userAgent: headersList.get('user-agent') || 'unknown'
  };
}
