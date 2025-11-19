import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import {searchStocks} from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();

    // Ensure proper user object for guest mode
    // The isGuest flag is set in the layout and passed through
    const userWithGuestStatus: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest || false
    };

    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="Signalist logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
                </Link>
                <nav className="hidden sm:block">
                    <NavItems initialStocks={initialStocks} />
                </nav>

                <UserDropdown user={userWithGuestStatus} initialStocks={initialStocks} />
            </div>
        </header>
    )
}
export default Header