// import { render, fireEvent } from '@testing-library/react'
import { AuthPromptDialog } from '../AuthPromptDialog'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('AuthPromptDialog', () => {
  const push = jest.fn()
  const onOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({ push } as any)
  })

  it('navigates to sign-in when Log In is clicked', () => {
    const { getByText } = render(
      <AuthPromptDialog open={true} onOpenChange={onOpenChange} action="add stocks to your watchlist" />
    )

    fireEvent.click(getByText(/log in/i))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(push).toHaveBeenCalledWith('/sign-in')
  })

  it('navigates to sign-up when Sign Up is clicked', () => {
    const { getByText } = render(
      <AuthPromptDialog open={true} onOpenChange={onOpenChange} action="add stocks to your watchlist" />
    )

    fireEvent.click(getByText(/sign up/i))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(push).toHaveBeenCalledWith('/sign-up')
  })
})

