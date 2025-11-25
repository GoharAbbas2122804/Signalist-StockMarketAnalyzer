import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/utils/adminAuth';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getAdminSession();

    if (!session) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col">
                {/* Admin Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold">Admin Panel</h1>
                        </div>
                        <div className="flex flex-1 items-center justify-end gap-4">
                            <span className="text-sm text-muted-foreground">
                                {session.user.email}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="container py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
