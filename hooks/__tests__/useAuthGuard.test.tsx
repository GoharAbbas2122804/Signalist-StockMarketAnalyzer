import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthGuard } from '../useAuthGuard';
import { useGuestSession } from '@/lib/context/GuestSessionContext';
import { showInfoToast, handleGuestActionAttempt } from '@/lib/utils/error-handling';

// Mock dependencies
jest.mock('@/lib/context/GuestSessionContext');
jest.mock('@/lib/utils/error-handling');

const mockUseGuestSession = useGuestSession as jest.MockedFunction<typeof useGuestSession>;
const mockShowInfoToast = showInfoToast as jest.MockedFunction<typeof showInfoToast>;
const mockHandleGuestActionAttempt = handleGuestActionAttempt as jest.MockedFunction<typeof handleGuestActionAttempt>;

describe('useAuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleGuestActionAttempt.mockClear();
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseGuestSession.mockReturnValue({
        isGuest: false,
        enterGuestMode: jest.fn(),
        exitGuestMode: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should return isAuthenticated as true', () => {
      const { result } = renderHook(() => useAuthGuard());
      
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isGuest).toBe(false);
    });

    it('should execute callback when requireAuth is called', async () => {
      const { result } = renderHook(() => useAuthGuard());
      const mockCallback = jest.fn();

      await act(async () => {
        await result.current.requireAuth('add to watchlist', mockCallback);
      });

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(result.current.showAuthPrompt).toBe(false);
      expect(mockShowInfoToast).not.toHaveBeenCalled();
    });

    it('should handle async callbacks', async () => {
      const { result } = renderHook(() => useAuthGuard());
      const mockAsyncCallback = jest.fn().mockResolvedValue('success');

      await act(async () => {
        await result.current.requireAuth('add to watchlist', mockAsyncCallback);
      });

      expect(mockAsyncCallback).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('when user is a guest', () => {
    beforeEach(() => {
      mockUseGuestSession.mockReturnValue({
        isGuest: true,
        enterGuestMode: jest.fn(),
        exitGuestMode: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should return isAuthenticated as false', () => {
      const { result } = renderHook(() => useAuthGuard());
      
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isGuest).toBe(true);
    });

    it('should show auth prompt instead of executing callback', async () => {
      const { result } = renderHook(() => useAuthGuard());
      const mockCallback = jest.fn();

      await act(async () => {
        await result.current.requireAuth('add to watchlist', mockCallback);
      });

      expect(mockCallback).not.toHaveBeenCalled();
      expect(result.current.showAuthPrompt).toBe(true);
      expect(result.current.authPromptAction).toBe('add to watchlist');
      expect(mockShowInfoToast).toHaveBeenCalledWith(
        'Sign in to add to watchlist',
        'Create an account to unlock all features'
      );
      expect(mockHandleGuestActionAttempt).toHaveBeenCalledWith('modify');
    });

    it('should respect guardType option when provided', async () => {
      const { result } = renderHook(() => useAuthGuard());

      await act(async () => {
        await result.current.requireAuth('remove from watchlist', jest.fn(), { guardType: 'remove' });
      });

      expect(mockHandleGuestActionAttempt).toHaveBeenCalledWith('remove');
    });

    it('should allow closing the auth prompt', async () => {
      const { result } = renderHook(() => useAuthGuard());

      await act(async () => {
        await result.current.requireAuth('add to watchlist', jest.fn());
      });

      expect(result.current.showAuthPrompt).toBe(true);

      act(() => {
        result.current.closeAuthPrompt();
      });

      expect(result.current.showAuthPrompt).toBe(false);
      expect(result.current.authPromptAction).toBe('');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      mockUseGuestSession.mockReturnValue({
        isGuest: false,
        enterGuestMode: jest.fn(),
        exitGuestMode: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should handle callback errors gracefully', async () => {
      const { result } = renderHook(() => useAuthGuard());
      const mockError = new Error('Test error');
      const mockCallback = jest.fn().mockRejectedValue(mockError);

      await act(async () => {
        await result.current.requireAuth('add to watchlist', mockCallback);
      });

      expect(result.current.error).toBe('Test error');
    });

    it('should allow clearing errors', async () => {
      const { result } = renderHook(() => useAuthGuard());
      const mockCallback = jest.fn().mockRejectedValue(new Error('Test error'));

      await act(async () => {
        await result.current.requireAuth('add to watchlist', mockCallback);
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
