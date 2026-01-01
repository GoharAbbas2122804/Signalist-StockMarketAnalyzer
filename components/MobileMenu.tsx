'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { UserCircle, LogOut, Search, X } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { signOut } from '@/lib/actions/auth.action';
import { useGuestSession } from '@/lib/context/GuestSessionContext';
import { showSuccessToast, showErrorToast } from '@/lib/utils/error-handling';
import SearchCommand from './SearchCommand';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const MobileMenu = ({ user, initialStocks }: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const container = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { isGuest, exitGuestMode } = useGuestSession();

    useGSAP(() => {
        gsap.set(menuRef.current, { xPercent: 100 });

        tl.current = gsap.timeline({ paused: true })
            .to(menuRef.current, {
                xPercent: 0,
                duration: 0.5,
                ease: 'power3.inOut',
            })
            .from('.mobile-nav-item', {
                x: 50,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
            }, '-=0.3')
            .from('.mobile-nav-bottom', {
                y: 20,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out',
            }, '-=0.2');

    }, { scope: container });

    useGSAP(() => {
        if (isOpen) {
            tl.current?.play();
            document.body.style.overflow = 'hidden';
        } else {
            tl.current?.reverse();
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            exitGuestMode();
            showSuccessToast('Signed out successfully', 'Come back soon!');
            router.push("/sign-in");
            setIsOpen(false);
        } catch (error) {
            console.error('Error signing out:', error);
            showErrorToast('Sign out failed', 'Please try again');
        }
    }

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    }

    const initials = user?.name
        ?.split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('') || 'U';

    return (
        <div ref={container} className="sm:hidden">
            <button
                onClick={toggleMenu}
                className="relative z-50 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
            >
                <div className="w-6 h-6 flex flex-col justify-center items-end gap-1.5">
                    <span className={`block h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                    <span className={`block h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`} />
                    <span className={`block h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`} />
                </div>
            </button>

            <div
                ref={menuRef}
                className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl flex flex-col h-screen w-screen"
                style={{ visibility: 'visible' }} // GSAP handles transform
            >
                <div className="flex-1 flex flex-col justify-center items-center gap-8 p-8">
                    <nav className="flex flex-col items-center gap-6 w-full max-w-sm">

                        <div className="mobile-nav-item w-full">
                            <SearchCommand
                                renderAs="text"
                                label="Search Stocks..."
                                initialStocks={initialStocks}
                            />
                        </div>

                        {NAV_ITEMS.map((item) => {
                            if (item.href === '/search') return null; // Already handled above

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={`mobile-nav-item text-3xl font-medium tracking-tight transition-colors ${isActive(item.href)
                                            ? 'text-yellow-500'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="mobile-nav-bottom p-8 border-t border-white/10 bg-zinc-900/50">
                    {isGuest ? (
                        <div className="flex gap-4">
                            <Button
                                onClick={() => { router.push("/sign-in"); setIsOpen(false); }}
                                className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400"
                            >
                                Log In
                            </Button>
                            <Button
                                onClick={() => { router.push("/sign-up"); setIsOpen(false); }}
                                variant="outline"
                                className="flex-1 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10"
                            >
                                Sign Up
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-4">
                            <Link
                                href="/profile"
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 flex-1 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                                <Avatar className="h-10 w-10 border border-white/10 group-hover:border-yellow-500/50 transition-colors">
                                    {user.image && <AvatarImage src={user.image} alt={user.name} />}
                                    <AvatarFallback className="bg-yellow-500 text-yellow-900 font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium group-hover:text-yellow-500 transition-colors">
                                        {user.name}
                                    </span>
                                    <span className="text-xs text-gray-500">View Profile</span>
                                </div>
                            </Link>

                            <Button
                                onClick={handleSignOut}
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full h-12 w-12"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
