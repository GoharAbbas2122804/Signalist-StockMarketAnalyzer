import { render, fireEvent } from '@testing-library/react'
import GuestModeButton from '../GuestModeButton'
import { useGuestSession } from '@/lib/context/GuestSessionContext'
import { useRouter } from 'next/navigation'

jest.mock('@/lib/context/GuestSessionContext')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockUseGuestSession = useGuestSession as jest.MockedFunction<typeof useGuestSession>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('GuestModeButton', () => {
  const enterGuestMode = jest.fn()
  const push = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGuestSession.mockReturnValue({
      isGuest: false,
      enterGuestMode,
      exitGuestMode: jest.fn(),
      error: null,
      clearError: jest.fn(),
    })
    mockUseRouter.mockReturnValue({ push } as any)
  })

  it('enters guest mode and navigates home on click', () => {
    const { getByRole } = render(<GuestModeButton />)

    fireEvent.click(getByRole('button', { name: /continue as guest/i }))

    expect(enterGuestMode).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/')
  })

  it('calls optional callback after entering guest mode', () => {
    const onEnter = jest.fn()
    const { getByRole } = render(<GuestModeButton onGuestModeEnter={onEnter} />)

    fireEvent.click(getByRole('button', { name: /continue as guest/i }))

    expect(onEnter).toHaveBeenCalledTimes(1)
  })
})

