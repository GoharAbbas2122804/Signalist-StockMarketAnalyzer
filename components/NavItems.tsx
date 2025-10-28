'use client'
import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavItems = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if(path === '/') return pathname === '/';
    return pathname.startsWith(path);
  }
  return (
    <ul className='flex flex-col sm:flex-row gap-3 sm:gap-10 font-medium'>
      {NAV_ITEMS.map((item) => (
        <li key={item.href}>
          {item.href === '/contact-us' ? (
            <Link
              href={item.href}
              className={`block sm:inline rounded-md px-4 py-2 font-semibold text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 shadow-[0_0_0_0_rgba(0,0,0,0)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,179,0,0.35)] hover:scale-[1.03] focus:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${isActive(item.href) ? 'opacity-100' : 'opacity-95'} animate-[pulse_6s_ease-in-out_infinite]`}
            >
              {item.title}
            </Link>
          ) : (
            <Link 
              href={item.href} 
              className={`hover:text-yellow-500 transition-colors py-2 px-3 rounded-md block sm:inline ${isActive(item.href) ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-400'}`}
            >
              {item.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export default NavItems