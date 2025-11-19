import { setGuestSession, getGuestSession, isGuestSession, clearGuestSession, getGuestSessionId } from '../guest-session'

const STORAGE_KEY = 'signalist_guest_session'

describe('guest-session utilities', () => {
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: jest.fn((key: string) => store[key] ?? null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),
      reset: () => {
        store = {}
      },
    }
  })()

  beforeEach(() => {
    sessionStorageMock.reset()
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
    })
  })

  it('should set and detect guest session', () => {
    expect(isGuestSession()).toBe(false)

    setGuestSession()

    expect(sessionStorageMock.setItem).toHaveBeenCalled()
    expect(isGuestSession()).toBe(true)
  })

  it('should return generated session details', () => {
    setGuestSession()
    const session = getGuestSession()

    expect(session).not.toBeNull()
    expect(session?.isGuest).toBe(true)
    expect(typeof session?.sessionId).toBe('string')
    expect(getGuestSessionId()).toBe(session?.sessionId)
  })

  it('should clear guest session', () => {
    setGuestSession()
    expect(isGuestSession()).toBe(true)

    clearGuestSession()
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
    expect(isGuestSession()).toBe(false)
  })
})

