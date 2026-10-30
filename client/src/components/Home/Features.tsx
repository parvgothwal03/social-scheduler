
import {
    CalendarDaysIcon,
    WandSparklesIcon,
    Share2Icon,
    ZapIcon,
    ChartNoAxesCombinedIcon,
    HashIcon,
    ArrowUpRightIcon,
} from "lucide-react";

const features = [
    {
        number: "01",
        icon: CalendarDaysIcon,
        title: "Smart scheduling",
        description:
            "Queue posts across your connected platforms from one place. Plan ahead and let your publishing workflow run smoothly.",
    },
    {
        number: "02",
        icon: WandSparklesIcon,
        title: "AI content generator",
        description:
            "Generate on-brand captions and images with built-in AI. Spend less time staring at a blank page and more time creating.",
    },
    {
        number: "03",
        icon: ChartNoAxesCombinedIcon,
        title: "Activity dashboard",
        description:
            "Keep track of published posts, scheduled content, and recent activity in one beautifully organized workspace.",
    },
    {
        number: "04",
        icon: Share2Icon,
        title: "Multi-platform publishing",
        description:
            "Connect Twitter, LinkedIn, Facebook, and Instagram. Manage your social content from a unified workspace.",
    },
    {
        number: "05",
        icon: ZapIcon,
        title: "Instant publishing",
        description:
            "Publish immediately or schedule posts for later. Plan content around your preferred posting times and timezones.",
    },
    {
        number: "06",
        icon: HashIcon,
        title: "Hashtag suggestions",
        description:
            "Discover AI-powered hashtag suggestions that complement your content and help you reach relevant audiences.",
    },
];

export default function Features() {
    return (
        <section
            id="features"
            className="relative bg-[#F8F7F3] py-24 sm:py-32 scroll-mt-20"
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-10">

                {/* Section heading */}
                <div className="max-w-3xl mb-16 sm:mb-20">

                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 mb-8">
                        <span className="size-1.5 rounded-full bg-[#B97960]" />

                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#887E6F]">
                            Thoughtfully designed tools
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="font-serif font-normal text-[42px] sm:text-6xl md:text-7xl leading-[1.08] tracking-[-0.045em] text-[#292720]">
                        Everything you need.
                        <br />
                        <span className="italic text-[#B97960]">
                            Nothing you don't.
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-7 text-base sm:text-lg leading-8 text-[#817B70] max-w-xl font-light">
                        From your first idea to your next published post,
                        every tool is designed to make social media
                        management feel a little more effortless.
                    </p>

                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#DEDAD1]">

                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.number}
                                className="group relative flex flex-col min-h-[290px] sm:min-h-[320px] p-7 sm:p-9 bg-[#F8F7F3] border-r border-b border-[#DEDAD1] hover:bg-[#F1EEE7] transition-colors duration-300"
                            >

                                {/* Top row */}
                                <div className="flex items-start justify-between">

                                    <span className="text-[10px] tracking-[0.16em] text-[#A39C90]">
                                        {feature.number} / 06
                                    </span>

                                    <ArrowUpRightIcon
                                        className="size-4 text-[#B97960] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                                        aria-hidden="true"
                                    />

                                </div>

                                {/* Feature icon */}
                                <div className="mt-10 mb-7">
                                    <div className="size-11 flex items-center justify-center border border-[#DEDAD1] rounded-full text-[#B97960] group-hover:bg-[#EDE5DB] transition-colors duration-300">
                                        <Icon
                                            className="size-[18px]"
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>

                                {/* Feature content */}
                                <div className="mt-auto">

                                    <h3 className="font-serif font-normal text-[26px] sm:text-[28px] leading-tight tracking-[-0.025em] text-[#292720] mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-[14px] leading-7 text-[#817B70] max-w-sm">
                                        {feature.description}
                                    </p>

                                </div>

                            </div>
                        );
                    })}

                </div>

                {/* Bottom editorial note */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">

                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#A39C90]">
                        Built for creators, by design.
                    </p>

                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-[#C7BDB0]" />

                        <span className="font-serif italic text-lg text-[#887E6F]">
                            Less managing. More creating.
                        </span>
                    </div>

                </div>

            </div>
        </section>
    );
}
