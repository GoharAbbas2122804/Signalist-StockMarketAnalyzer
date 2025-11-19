import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ClientSessionSync from "@/components/ClientSessionSync"
import { getAuth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const layout = async({ children }: { children: React.ReactNode }) => {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Check for guest session in cookies
  const cookieStore = await cookies();
  const guestSessionCookie = cookieStore.get('signalist_guest_session');
  const isGuestSession = guestSessionCookie?.value === 'true';

  // Create user object based on session type
  let user: User;
  
  if (session) {
    // Authenticated user
    user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      isGuest: false
    }
  } else if (isGuestSession) {
    // Guest user
    user = {
      id: 'guest',
      name: 'Guest',
      email: '',
      isGuest: true
    }
  } else {
    // No session at all - redirect to sign-in
    redirect('/sign-in')
  }




  return (

      <main className='min-h-screen text-gray-400 flex flex-col'>
        <ClientSessionSync user={user} />
        <Header user={user} />
        <div className='container py-10 flex-1'>
          {children}
        </div>
        <Footer />
      </main>


  )
}

export default layout