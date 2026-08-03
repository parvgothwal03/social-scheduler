import { Link } from "react-router-dom";

const footerLinks = {
    Product: ["Features", "How it works", "Pricing", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {
    return (
        <>
        <footer style={{ background: "#fafafa", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" onClick={() => scrollTo(0, 0)} className="inline-flex items-center gap-2 mb-5">
                            <img src="/logo.svg" alt="logo" className="size-6" />
                            <span className="font-medium font-serif text-xl text-gray-800">Scheduler</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">The AI-powered social media scheduler that helps creators and teams grow faster with less effort.</p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <div className="text-xs font-semibold uppercase tracking-widest mb-5 text-gray-600">{category}</div>
                            <ul className="space-y-1">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                                        
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} Scheduler. All rights reserved.</p>
                    <div className="flex items-center gap-4 mt-3">
                        <a href="https://github.com/parvgothwal03" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="size-4 hover:text-red-500" aria-hidden="true">
                                <path d="M12 .5C5.73.5.5 5.87.5 12.49c0 5.29 3.44 9.78 8.2 11.37.6.11.82-.27.82-.58v-2.03c-3.34.75-4.04-1.47-4.04-1.47-.55-1.44-1.34-1.82-1.34-1.82-1.1-.78.08-.77.08-.77 1.22.09 1.86 1.29 1.86 1.29 1.08 1.92 2.84 1.37 3.53 1.05.11-.81.42-1.37.76-1.69-2.67-.31-5.47-1.38-5.47-6.16 0-1.36.47-2.48 1.24-3.35-.12-.31-.54-1.57.12-3.27 0 0 1.01-.34 3.3 1.28.96-.28 1.99-.42 3.02-.43 1.03.01 2.06.15 3.03.43 2.28-1.62 3.29-1.28 3.29-1.28.67 1.7.25 2.96.13 3.27.77.87 1.24 1.99 1.24 3.35 0 4.8-2.81 5.85-5.49 6.15.43.39.82 1.16.82 2.34v3.47c0 .31.22.69.83.57 4.76-1.59 8.19-6.08 8.19-11.36C23.5 5.87 18.27.5 12 .5Z" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/parv-gothwal-a5496540b" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin size-4 hover:text-red-500" aria-hidden="true">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect width="4" height="12" x="2" y="9"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a href="https://parv-gothwal.me" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 hover:text-red-500" aria-hidden="true">
                                <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <path d="M2 13h20"></path>
                                <path d="M12 13v2"></path>
                            </svg>
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-gray-400 hover:text-gray-700">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-xs text-gray-400 hover:text-gray-700">
                            Terms of Service
                        </a>
                        <Link to="/login" className="text-xs text-gray-400 hover:text-gray-700">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
        </>
    );
}
