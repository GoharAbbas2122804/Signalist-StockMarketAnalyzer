import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuth } from '@/lib/better-auth/auth'
import { ProfileClient } from '@/components/ProfileClient'

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

  // Prepare profile data for client component
  const profileData = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image || null,
  }

  return <ProfileClient initialData={profileData} />
}

export default ProfilePage
