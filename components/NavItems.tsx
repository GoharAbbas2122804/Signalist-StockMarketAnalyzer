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
          <Link 
            href={item.href} 
            className={`hover:text-yellow-500 transition-colors py-2 px-3 rounded-md block sm:inline ${isActive(item.href) ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-400'}`}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavItems