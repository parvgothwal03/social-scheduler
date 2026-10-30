
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

export default function Navbar() {
    const { isSignedIn } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-[#F8F7F3] border-b border-[#E8E5DE]">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className="flex items-center gap-2.5"
                >
                    <img
                        src="/logo.svg"
                        alt="Scheduler logo"
                        className="size-7 object-contain"
                    />

                    <span className="font-serif text-[23px] font-normal tracking-[-0.04em] text-[#292720]">
                       SocialPilot<span className="text-[#B97960]">.</span>
                    </span>
                </Link>

                {/* Navigation links */}
                <div className="hidden md:flex items-center gap-9 text-[13px] text-[#716D64]">

                    <a
                        href="#features"
                        className="hover:text-[#292720] transition-colors duration-200"
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        className="hover:text-[#292720] transition-colors duration-200"
                    >
                        How it works
                    </a>

                    <a
                        href="#pricing"
                        className="hover:text-[#292720] transition-colors duration-200"
                    >
                        Pricing
                    </a>

                </div>

                {/* Authentication actions */}
                <div className="flex items-center gap-6">

                    {isSignedIn ? (
                        <Link
                            to="/dashboard"
                            className="group inline-flex items-center gap-2 bg-[#292720] text-[#F8F7F3] text-[13px] px-5 py-2.5 hover:bg-[#49463E] transition-colors duration-200"
                        >
                            Go to Dashboard

                            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hidden sm:block text-[13px] text-[#716D64] hover:text-[#292720] transition-colors duration-200"
                            >
                                Sign in
                            </Link>

                            <Link
                                to="/login"
                                className="group inline-flex items-center gap-2 bg-[#292720] text-[#F8F7F3] text-[13px] px-5 py-2.5 hover:bg-[#49463E] transition-colors duration-200"
                            >
                                Get started

                                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </nav>
    );
}
