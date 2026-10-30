
import {
    BarChart3Icon,
    CalendarDaysIcon,
    LayoutDashboardIcon,
    MessageSquareReplyIcon,
    UserIcon,
    Wand2Icon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";

const Sidebar = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}) => {
    const { user } = useUser();
    const location = useLocation();

    const navItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboardIcon,
            path: "/dashboard",
        },
        {
            name: "Social Accounts",
            icon: UserIcon,
            path: "/accounts",
        },
        {
            name: "Post Scheduler",
            icon: CalendarDaysIcon,
            path: "/schedule",
        },
        {
            name: "AI Composer",
            icon: Wand2Icon,
            path: "/ai-composer",
        },
        {
            name: "Auto Reply",
            icon: MessageSquareReplyIcon,
            path: "/auto-reply",
        },
        {
            name: "Analytics",
            icon: BarChart3Icon,
            path: "/analytics",
        },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col border-r border-[#DED7CA] bg-[#FDFCF9] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* Logo */}
            <div className="px-6 pb-5 pt-7">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        className="size-7 object-contain"
                    />

                    <span className="font-serif text-2xl tracking-tight text-[#292720]">
                        SocialPilot
                    </span>
                </div>

                <p className="ml-9 mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-[#B97960]">
                    Social workspace
                </p>
            </div>

            {/* Navigation Label */}
            <div className="px-6 pb-3 pt-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A49C8F]">
                    Menu
                </span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-1 px-3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            onClick={() => setIsOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-all duration-200 ${
                                isActive
                                    ? "border-[#B97960]/20 bg-[#B97960]/10 font-medium text-[#A35F49]"
                                    : "border-transparent text-[#817B70] hover:border-[#DED7CA] hover:bg-[#F8F7F3] hover:text-[#292720]"
                            }`}
                        >
                            <item.icon
                                className={`size-[18px] shrink-0 transition-colors ${
                                    isActive
                                        ? "text-[#B97960]"
                                        : "text-[#A49C8F] group-hover:text-[#B97960]"
                                }`}
                                strokeWidth={1.7}
                            />

                            <span>{item.name}</span>

                            {isActive && (
                                <span className="ml-auto h-5 w-1 rounded-full bg-[#B97960]" />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="border-t border-[#DED7CA] p-4">
                <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#F8F7F3]">
                    <div className="flex shrink-0 items-center justify-center">
                        {/* Clerk handles avatar, account management, and sign out */}
                        <UserButton afterSignOutUrl="/" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#292720]">
                            {user?.fullName}
                        </p>

                        <p className="truncate text-xs text-[#817B70]">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
