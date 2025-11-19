/**
 * Guest Session Storage Utilities
 * Manages guest session state in sessionStorage
 */

const GUEST_SESSION_KEY = 'signalist_guest_session';

export interface GuestSession {
  isGuest: boolean;
  enteredAt: number;
  sessionId: string;
}

/**
 * Generate a random UUID for session tracking
 */
const generateSessionId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if we're in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
};

/**
 * Set guest session in sessionStorage
 */
export const setGuestSession = (): void => {
  if (!isBrowser()) return;

  const session: GuestSession = {
    isGuest: true,
    enteredAt: Date.now(),
    sessionId: generateSessionId(),
  };

  try {
    sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to set guest session:', error);
  }
};

/**
 * Get guest session from sessionStorage
 */
export const getGuestSession = (): GuestSession | null => {
  if (!isBrowser()) return null;

  try {
    const sessionData = sessionStorage.getItem(GUEST_SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData) as GuestSession;
    return session.isGuest ? session : null;
  } catch (error) {
    console.error('Failed to get guest session:', error);
    return null;
  }
};

/**
 * Check if user is in guest mode
 */
export const isGuestSession = (): boolean => {
  const session = getGuestSession();
  return session?.isGuest ?? false;
};

/**
 * Clear guest session from sessionStorage
 */
export const clearGuestSession = (): void => {
  if (!isBrowser()) return;

  try {
    sessionStorage.removeItem(GUEST_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear guest session:', error);
  }
};

/**
 * Get guest session ID for analytics
 */
export const getGuestSessionId = (): string | null => {
  const session = getGuestSession();
  return session?.sessionId ?? null;
};
