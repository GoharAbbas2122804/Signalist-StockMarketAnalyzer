'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button";
import {  LogOutIcon } from "lucide-react";
import NavItems from "./NavItems";
import { signOut } from "@/lib/actions/auth.action";



const UserDropdown = ({ user }: { user: User }) => {
    const router = useRouter();
    const handleSignOut = async () => {
        await signOut();
        router.push('/sign-in');
    }

    // const users = {
    //     name: 'GoharAbbas',
    //     email: 'john.doe@example.com',
    //     // image: 'https://github.com/shadcn.png',
    // }



    return (
        <div>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-yellow-500 p-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-yellow-500 text-white text-lg font-bold ">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:flex flex-col items-start">
                            <span className="text-sm sm:text-base font-medium text-gray-400">
                                {user.name}
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="text-gray-400">
                    <DropdownMenuLabel>

                        <div className="flex relative items-center gap-3 py-2 ">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="bg-yellow-500 text-white text-lg font-bold ">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col ">
                                <span className="text-base font-medium text-gray-400">
                                    {user.name}
                                </span>
                                <span className="text-base font-medium text-gray-400">
                                    {user.email}
                                </span>
                            </div>


                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-600"/>
                    <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-bold focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer text-center ">
                        <LogOutIcon className="w-4 h-4 mr-2 hidden sm:block"/>
                        LogOut 
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-600"/>
                    <nav className="block lg:hidden">
                        <div className="px-2 py-1">
                            <NavItems />
                        </div>
                    </nav>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default UserDropdown