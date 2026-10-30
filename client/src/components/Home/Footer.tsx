
import { Link } from "react-router-dom";
import {
    BriefcaseBusinessIcon,
    ArrowUpRightIcon,
    CodeXmlIcon,
    ContactRoundIcon,
} from "lucide-react";

const footerLinks = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#" },
    ],
    Company: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
    ],
    Legal: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
        { label: "Cookies", href: "#" },
    ],
};

const socialLinks = [
    {
        label: "GitHub",
        href: "https://github.com/parvgothwal03",
        icon: CodeXmlIcon,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/parv-gothwal-a5496540b",
        icon: ContactRoundIcon,
    },
    {
        label: "Portfolio",
        href: "https://parv-gothwal.me",
        icon: BriefcaseBusinessIcon,
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-[#DED7CA] bg-[#F8F7F3] text-[#292720]">
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-10 sm:pt-20">

                {/* Main footer content */}
                <div className="grid grid-cols-1 gap-12 border-b border-[#DED7CA] pb-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">

                    {/* Brand section */}
                    <div className="lg:col-span-2">
                        <Link
                            to="/"
                            onClick={() => window.scrollTo(0, 0)}
                            className="mb-5 inline-flex items-center gap-2"
                        >
                            <img
                                src="/logo.svg"
                                alt="Scheduler logo"
                                className="size-7 object-contain"
                            />

                            <span className="font-serif text-2xl font-medium tracking-tight">
                                SocialPilot
                                <span className="text-[#B97960]">.</span>
                            </span>
                        </Link>

                        <p className="max-w-xs text-sm leading-7 text-[#817B70]">
                            The AI-powered social media scheduler that helps
                            creators and teams grow faster with less effort.
                        </p>

                        {/* Social links — original icons and styling preserved */}
                        <div className="mt-7 flex items-center gap-3">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="size-9 rounded-full border border-[#DED7CA] flex items-center justify-center text-[#817B70] hover:text-[#B97960] hover:border-[#B97960] transition-colors duration-300"
                                >
                                    <Icon
                                        className="size-4"
                                        strokeWidth={1.6}
                                        aria-hidden="true"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer navigation */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#A39C90]">
                                {category}
                            </h3>

                            <ul className="space-y-4">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            className="group inline-flex items-center gap-1 text-sm text-[#817B70] transition-colors duration-200 hover:text-[#B97960]"
                                        >
                                            {label}

                                            <ArrowUpRightIcon
                                                className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom footer */}
                <div className="pt-7">
                    <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

                        {/* Copyright */}
                        <p className="text-xs text-[#A39C90]">
                            © {new Date().getFullYear()} SocialPilot.
                            All rights reserved.
                        </p>

                        {/* Legal and account links */}
                        <div className="flex flex-wrap items-center justify-center gap-5">
                            <a
                                href="#"
                                className="text-xs text-[#817B70] transition-colors hover:text-[#B97960]"
                            >
                                Privacy Policy
                            </a>

                            <a
                                href="#"
                                className="text-xs text-[#817B70] transition-colors hover:text-[#B97960]"
                            >
                                Terms of Service
                            </a>

                            <Link
                                to="/login"
                                className="text-xs text-[#817B70] transition-colors hover:text-[#B97960]"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Closing line */}
                    <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#DED7CA] pt-7 sm:flex-row">
                        <p className="font-serif text-lg italic text-[#887E6F]">
                            Less managing. More creating.
                        </p>

                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#A39C90]">
                            By Parv Gothwal
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
