import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'

const Header = () => {
  
  return (
    <header className='header sticky top-0 '>
      <div className='header-wrapper container'>
        <Link href='/'>
          <Image src='/assets/icons/logo.svg' alt='Signalist LOgo'  width={140} height={32} className='h-8 w-auto cursor-pointer' />
        </Link>

        <nav className='hidden sm:block '>
          {/* NavItems component will be added here */}
          <NavItems />
        </nav>
        {/* user drop down component will be added here */}
        <UserDropdown />
      </div>

    </header>
  )
}

export default Header