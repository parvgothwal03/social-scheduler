import { BarChart3Icon, CalendarDaysIcon, LayoutDashboardIcon, MessageSquareReplyIcon, UserIcon, Wand2Icon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";

const Sidebar = ({isOpen, setIsOpen} : {isOpen: boolean, setIsOpen: (val: boolean) => void}) => {
 
    const { user } = useUser();
    const location = useLocation();

    const navItems = [
        {name: "Dashboard", icon: LayoutDashboardIcon, path: "/dashboard"},
        {name: "Social Accounts", icon: UserIcon, path: "/accounts"},
        {name: "Post Scheduler", icon: CalendarDaysIcon, path: "/schedule"},
        {name: "AI Composer", icon: Wand2Icon, path: "/ai-composer"},
        { name: "Auto Reply", icon: MessageSquareReplyIcon, path: "/auto-reply" },
        { name: "Analytics", icon: BarChart3Icon, path: "/analytics" }
    ]

    return (
        <div  className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200
        flex flex-col h-full transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-50 md:z-auto`}>

            {/* Logo */}
            <div className='p-6 pb-4'>
                <div className='text-xl tracking-tight text-slate-800 flex items-center gap-1.5'>
                    <img src="/logo.svg" alt="Logo" className='size-6'/>
                    Scheduler
                </div>
            </div>
            
            {/* Navigation */}
            <div className='px-6 py-2'>
                <span className='text-sm text-slate-500 uppercase tracking-wider'>Menu</span>
            </div>
            
            {/* Nav Items */}
            <nav className='flex-1 px-3 space-y-1'>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <NavLink key={item.name} to={item.path}
                        end={item.path === "/dashboard"} onClick={() =>setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm
                        transition-all duration-150 border ${isActive ? "bg-red-50 text-red-600 border-red-100" : "text-slate-500 hover:bg-slate-50 border-transparent hover:border-slate-700" }`}>
                            <item.icon className={`size-4.5 shrink-0 ${isActive ?
                            'text-red-500' : 'text-slate-500'}`}/>
                            {item.name}
                            {isActive && <span className='ml-auto w-[5px] h-5 rounded-full
                            bg-red-500' />}
                        </NavLink>
                    )})}
            </nav>
            
            {/* User Footer */}
            <div className='p-4 border-t border-slate-100'>
                <div className='flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors'>
                    <div className="shrink-0 flex items-center justify-center">
                        {/* Clerk UserButton handles avatar, account management, and sign out */}
                        <UserButton afterSignOutUrl="/" />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <div className='text-sm text-slate-800 truncate'>{user?.fullName}</div>
                        <div className='text-xs text-slate-400 truncate'>{user?.primaryEmailAddress?.emailAddress}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;