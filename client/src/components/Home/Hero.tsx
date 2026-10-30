
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Dot } from "lucide-react";

export default function Hero() {
    const stats = [
        { val: "12", label: "Scheduled" },
        { val: "48", label: "Published" },
        { val: "04", label: "Accounts" },
        { val: "03", label: "AI automations" },
    ];

    const activities = [
        {
            text: "Post published to LinkedIn & Twitter",
            time: "2 min ago",
        },
        {
            text: "AI replied to 3 comments",
            time: "15 min ago",
        },
        {
            text: "New post scheduled for tomorrow",
            time: "1 hour ago",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#F8F7F3] text-[#292720]">

            {/* Hero content */}
            <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-24 sm:pt-32 pb-16 sm:pb-20">

                {/* Eyebrow */}
                <div className="flex justify-center mb-9">
                    <div className="inline-flex items-center gap-2 border border-[#DEDAD1] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#817B70]">
                        <span className="size-1.5 rounded-full bg-[#B97960]" />
                        A calmer way to manage social media
                    </div>
                </div>

                {/* Headline */}
                <div className="text-center max-w-5xl mx-auto">
                    <h1 className="font-serif font-normal text-[48px] leading-[1.08] sm:text-7xl md:text-8xl lg:text-[104px] tracking-[-0.055em]">
                        Your social media,
                        <br />
                        <span className="italic text-[#B97960]">
                            beautifully
                        </span>{" "}
                        organized.
                    </h1>

                    <p className="mt-8 max-w-xl mx-auto text-[#817B70] text-base sm:text-lg leading-8 font-light">
                        Create, schedule and manage your social presence
                        without the chaos. Let AI handle the busywork
                        while you focus on creating.
                    </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">

                    <Link
                        to="/login"
                        className="group inline-flex items-center justify-center gap-3 bg-[#292720] text-[#F8F7F3] px-8 py-4 text-sm font-medium hover:bg-[#49463E] transition-colors duration-300 w-full sm:w-auto"
                    >
                        Start for free

                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>

                    <a
                        href="#how-it-works"
                        className="inline-flex items-center justify-center gap-2 border border-[#D8D1C5] px-8 py-4 text-sm text-[#555044] hover:bg-[#F0EDE6] transition-colors duration-300 w-full sm:w-auto"
                    >
                        Discover how it works

                        <ArrowRight className="size-4" />
                    </a>

                </div>

                <p className="text-center mt-6 text-[10px] uppercase tracking-[0.16em] text-[#A39C90]">
                    Free forever plan · No credit card required
                </p>

            </div>

            {/* Dashboard preview */}
            <div className="relative max-w-6xl mx-auto px-5 sm:px-10">

                {/* Browser frame */}
                <div className="border border-[#DEDAD1] bg-[#FDFCF9] overflow-hidden">

                    {/* Browser bar */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE7E0] bg-[#F4F2EC]">

                        <div className="flex gap-1.5">
                            <span className="size-2 rounded-full bg-[#D9A49A]" />
                            <span className="size-2 rounded-full bg-[#D9C39A]" />
                            <span className="size-2 rounded-full bg-[#A9B99D]" />
                        </div>

                        <span className="text-[10px] tracking-[0.16em] uppercase text-[#999184]">
                            Your workspace
                        </span>

                        <div className="size-5" />

                    </div>

                    {/* Dashboard */}
                    <div className="p-5 sm:p-9 bg-[#FAF9F5]">

                        {/* Dashboard heading */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                            <div>
                                <p className="text-[10px] tracking-[0.2em] uppercase text-[#A39C90] mb-2">
                                    Your workspace
                                </p>

                                <h2 className="font-serif text-3xl sm:text-4xl tracking-tight">
                                    Good morning.
                                </h2>

                                <p className="text-sm text-[#938C80] mt-2">
                                    Here's what's happening with your content.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#91A88A]" />

                                <span className="text-xs text-[#777064]">
                                    All systems running
                                </span>
                            </div>

                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-[#FDFCF9] border border-[#EAE7E0] p-4 sm:p-6"
                                >
                                    <div className="font-serif text-3xl sm:text-4xl">
                                        {stat.val}
                                    </div>

                                    <div className="text-xs text-[#A39C90] mt-2">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Activity */}
                        <div className="grid md:grid-cols-[1.5fr_1fr] gap-4">

                            <div className="bg-[#FDFCF9] border border-[#EAE7E0] p-5 sm:p-6">

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-serif text-xl">
                                        Recent activity
                                    </h3>

                                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#A39C90]">
                                        View all
                                    </span>
                                </div>

                                <div className="space-y-5">

                                    {activities.map((item) => (
                                        <div
                                            key={item.text}
                                            className="flex items-center gap-3"
                                        >
                                            <Dot className="size-6 text-[#B97960] shrink-0" />

                                            <span className="text-xs sm:text-sm text-[#686257] flex-1">
                                                {item.text}
                                            </span>

                                            <span className="text-[10px] text-[#B1AA9E] whitespace-nowrap">
                                                {item.time}
                                            </span>
                                        </div>
                                    ))}

                                </div>
                            </div>

                            {/* AI card */}
                            <div className="bg-[#EEEAE1] p-5 sm:p-6 flex flex-col justify-between min-h-[190px]">

                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A18A76]">
                                        Your creative assistant
                                    </span>

                                    <h3 className="font-serif text-2xl mt-4 leading-tight">
                                        A little help.
                                        <br />
                                        A lot more creativity.
                                    </h3>

                                    <p className="text-xs text-[#898174] mt-3 leading-6">
                                        Turn your ideas into thoughtful
                                        content with AI.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-5">
                                    <span className="text-xs font-medium">
                                        Explore AI tools
                                    </span>

                                    <ArrowUpRight className="size-4" />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Bottom spacing */}
            <div className="h-16 sm:h-24" />

        </section>
    );
}
