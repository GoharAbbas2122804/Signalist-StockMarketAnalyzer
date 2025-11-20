import { render } from '@testing-library/react'
import ClientSessionSync from '../ClientSessionSync'
import { useGuestSession } from '@/lib/context/GuestSessionContext'

jest.mock('@/lib/context/GuestSessionContext')

const mockUseGuestSession = useGuestSession as jest.MockedFunction<typeof useGuestSession>

describe('ClientSessionSync', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('enters guest mode silently when server indicates guest but client is not guest', () => {
    const enterGuestMode = jest.fn()
    mockUseGuestSession.mockReturnValue({
      isGuest: false,
      enterGuestMode,
      exitGuestMode: jest.fn(),
      error: null,
      clearError: jest.fn(),
    })

    render(<ClientSessionSync user={{ id: 'guest', name: 'Guest', email: '', isGuest: true }} />)

    expect(enterGuestMode).toHaveBeenCalledWith({ silent: true })
  })

  it('exits guest mode when server user is authenticated but client is still guest', () => {
    const exitGuestMode = jest.fn()
    mockUseGuestSession.mockReturnValue({
      isGuest: true,
      enterGuestMode: jest.fn(),
      exitGuestMode,
      error: null,
      clearError: jest.fn(),
    })

    render(<ClientSessionSync user={{ id: '123', name: 'Signalist User', email: 'user@example.com', isGuest: false }} />)

    expect(exitGuestMode).toHaveBeenCalled()
  })
})

