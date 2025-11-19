import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuth } from '@/lib/better-auth/auth'

const ProfilePage = async () => {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const cookieStore = await cookies()
  const isGuest = cookieStore.get('signalist_guest_session')?.value === 'true'

  if (!session && !isGuest) {
    redirect('/sign-in')
  }

  if (isGuest || !session) {
    return (
      <section className="container max-w-2xl space-y-6 text-center py-10">
        <h1 className="text-3xl font-bold text-gray-100">Profile coming soon</h1>
        <p className="text-gray-400">
          Sign in or create an account to personalize your Signalist experience and manage your profile settings.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/sign-in" className="px-5 py-2 rounded-lg bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-400 transition-colors">
            Log in
          </Link>
          <Link href="/sign-up" className="px-5 py-2 rounded-lg border border-gray-600 text-gray-200 hover:border-yellow-500/60 transition-colors">
            Create account
          </Link>
        </div>
      </section>
    )
  }

  const { user } = session

  return (
    <section className="container max-w-3xl space-y-8 py-10">
      <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg">
        <div className="flex flex-col gap-2">
          <span className="text-sm uppercase tracking-wide text-gray-500">Profile</span>
          <h1 className="text-3xl font-bold text-gray-100">Account overview</h1>
          <p className="text-gray-500">
            Manage your personal details and keep your Signalist account secure.
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-700 bg-gray-900/40 p-4">
            <dt className="text-sm text-gray-500">Full name</dt>
            <dd className="text-xl font-semibold text-gray-100">{user.name}</dd>
          </div>
          <div className="rounded-lg border border-gray-700 bg-gray-900/40 p-4">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="text-xl font-semibold text-gray-100">{user.email}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-3">What&apos;s next?</h2>
        <ul className="space-y-2 text-gray-400">
          <li>• Set up price alerts to catch market moves</li>
          <li>• Customize your watchlist for faster research</li>
          <li>• Explore AI-powered insights tailored to your portfolio</li>
        </ul>
      </div>
    </section>
  )
}

export default ProfilePage

