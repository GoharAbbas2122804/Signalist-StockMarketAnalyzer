import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { getAuth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const layout = async({ children }: { children: React.ReactNode }) => {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers()
  })

  //if there is no session , then redirect to the sign in page
  if(!session) redirect('/sign-in')

  //but if the user exists then 
  const user  = {
    id: session.user.id,
    name: session.user.name,
    email : session.user.email
  }




  return (

      <main className='min-h-screen text-gray-400 flex flex-col'>
        <Header user={user} />
        <div className='container py-10 flex-1'>
          {children}
        </div>
        <Footer />
      </main>


  )
}

export default layout