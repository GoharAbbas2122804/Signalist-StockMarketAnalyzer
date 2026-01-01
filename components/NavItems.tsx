'use client'

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "./SearchCommand";

const NavItems = ({ initialStocks }: { initialStocks: StockWithWatchlistStatus[] }) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';

        return pathname.startsWith(path);
    }

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {NAV_ITEMS.map(({ href, title }) => {
                if (href === '/search') return (
                    <li key="search-trigger">
                        <SearchCommand
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                        />
                    </li>
                )

                return <li key={href}>
                    <Link href={href} prefetch={true} className={`relative group py-1 transition-colors ${isActive(href) ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-100'
                        }`}>
                        {title}
                        <span className={`absolute left-0 bottom-0 w-full h-[2px] bg-yellow-500 transform transition-transform duration-300 origin-left ${isActive(href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                            }`} />
                    </Link>
                </li>
            })}
        </ul>
    )
}
export default NavItems