
import { useState } from "react";
import Sidebar from "./SideBar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/accounts": "Social Accounts",
    "/schedule": "Post Scheduler",
    "/ai-composer": "AI Composer",
    "/auto-reply": "Auto Reply",
    "/analytics": "Analytics",
};

const Layout = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const location = useLocation();

    const title = pageTitles[location.pathname] || "SocialPilot";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8F7F3]">
                <div className="size-8 animate-spin rounded-full border-[3px] border-[#B97960] border-t-transparent" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F7F3]">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    className="fixed inset-0 z-40 bg-[#292720]/40 backdrop-blur-[2px] md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="z-30 flex h-16 shrink-0 items-center gap-4 border-b border-[#DED7CA] bg-[#FDFCF9] px-4 sm:px-6 md:px-8">
                    <button
                        type="button"
                        aria-label={
                            isMobileMenuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        className="-ml-2 rounded-lg p-2 text-[#817B70] transition-colors hover:bg-[#F1EEE8] hover:text-[#292720] md:hidden"
                        onClick={() =>
                            setIsMobileMenuOpen(!isMobileMenuOpen)
                        }
                    >
                        {isMobileMenuOpen ? (
                            <XIcon className="size-5" />
                        ) : (
                            <MenuIcon className="size-5" />
                        )}
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate font-serif text-xl text-[#292720]">
                            {title}
                        </h1>

                        <p className="mt-0.5 hidden text-xs text-[#817B70] sm:block">
                            Manage and automate your social presence
                        </p>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
