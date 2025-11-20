'use client';

import { useMemo } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut, UserCircle} from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.action";
import { useGuestSession } from "@/lib/context/GuestSessionContext";
import { showSuccessToast, showErrorToast } from "@/lib/utils/error-handling";

const UserDropdown = ({ user, initialStocks }: {user: User, initialStocks: StockWithWatchlistStatus[]}) => {
    const router = useRouter();
    const { isGuest, exitGuestMode } = useGuestSession();

    const handleSignOut = async () => {
        try {
            await signOut();
            exitGuestMode();
            showSuccessToast('Signed out successfully', 'Come back soon!');
            router.push("/sign-in");
        } catch (error) {
            console.error('Error signing out:', error);
            showErrorToast('Sign out failed', 'Please try again');
        }
    }

    const handleLogin = () => {
        router.push("/sign-in");
    }

    const handleSignup = () => {
        router.push("/sign-up");
    }

    const handleProfile = () => {
        router.push("/profile");
    }

    const initials = useMemo(() => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .slice(0, 2)
            .join('') || 'U';
    }, [user?.name]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                    <Avatar className="h-8 w-8">
                        {isGuest ? (
                            <AvatarFallback className="bg-gray-600 text-gray-400">
                                <UserCircle className="h-5 w-5" />
                            </AvatarFallback>
                        ) : (
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400'>
                            {isGuest ? 'Guest' : user.name}
                        </span>
                        {!isGuest && <span className="text-xs text-gray-500">{user.email}</span>}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            {isGuest ? (
                                <AvatarFallback className="bg-gray-600 text-gray-400">
                                    <UserCircle className="h-6 w-6" />
                                </AvatarFallback>
                            ) : (
                                <AvatarFallback className="bg-yellow-500 text-yellow-900 text-base font-bold">
                                    {initials}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col">
                            <span className='text-base font-medium text-gray-400'>
                                {isGuest ? 'Guest' : user.name}
                            </span>
                            {!isGuest && <span className="text-sm text-gray-500">{user.email}</span>}
                            {isGuest && <span className="text-sm text-gray-500">Exploring mode</span>}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600"/>
                
                {isGuest ? (
                    <>
                        <DropdownMenuItem onClick={handleLogin} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                            <UserCircle className="h-4 w-4 mr-2 hidden sm:block" />
                            Log In
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignup} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                            <UserCircle className="h-4 w-4 mr-2 hidden sm:block" />
                            Sign Up
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem onClick={handleProfile} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                            <UserCircle className="h-4 w-4 mr-2 hidden sm:block" />
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                            <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                            Logout
                        </DropdownMenuItem>
                    </>
                )}
                
                <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>
                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks} />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown