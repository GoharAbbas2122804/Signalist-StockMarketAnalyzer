import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'

const Header = ({ user }: { user: User }) => {
  
  return (
    <header className='header sticky top-0 z-50'>
      <div className='header-wrapper container flex items-center justify-between py-4'>
        <Link href='/' className='flex-shrink-0'>
          <Image 
            src='/assets/icons/logo.svg' 
            alt='Signalist Logo'  
            width={140} 
            height={32} 
            className='h-8 w-auto cursor-pointer' 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden lg:block'>
          <NavItems />
        </nav>

        {/* User Dropdown - Always visible */}
        <div className='flex-shrink-0'>
          <UserDropdown  user={user}/>
        </div>
      </div>
    </header>
  )
}

export default Header