
import {
    ArrowUpRightIcon,
    Link2Icon,
    WandSparklesIcon,
    CalendarCheckIcon,
} from "lucide-react";

const steps = [
    {
        step: "01",
        label: "FIRST THINGS FIRST",
        title: "Connect your accounts.",
        description:
            "Link your social profiles in seconds. Bring Twitter, LinkedIn, Facebook, and Instagram together in one workspace.",
        icon: Link2Icon,
    },
    {
        step: "02",
        label: "LET IDEAS FLOW",
        title: "Create something worth sharing.",
        description:
            "Write your own post or let AI help craft captions and images based on your ideas and prompts.",
        icon: WandSparklesIcon,
    },
    {
        step: "03",
        label: "READY WHEN YOU ARE",
        title: "Schedule. Publish. Done.",
        description:
            "Choose your platforms, pick a publishing time, and schedule your content. Your publishing workflow takes it from there.",
        icon: CalendarCheckIcon,
    },
];

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative bg-[#F1EEE7] py-24 sm:py-28 lg:py-32 scroll-mt-20"
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-10">

                {/* Section heading */}
                <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 lg:mb-24">

                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 mb-7">
                        <span className="size-1.5 rounded-full bg-[#B97960]" />

                        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#887E6F]">
                            A simpler way to work
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="font-serif font-normal text-[42px] sm:text-6xl md:text-7xl leading-[1.08] tracking-[-0.045em] text-[#292720]">
                        Three steps.
                        <br />

                        <span className="italic text-[#B97960]">
                            A whole lot simpler.
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-6 sm:mt-7 text-[15px] sm:text-lg leading-7 sm:leading-8 text-[#817B70] max-w-xl mx-auto font-light">
                        No complicated onboarding. No unnecessary steps.
                        Just a thoughtful way to create, plan, and publish
                        your social content.
                    </p>

                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#D8D3C9]">

                    {steps.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.step}
                                className="group relative flex flex-col min-h-[320px] sm:min-h-[350px] p-7 sm:p-9 lg:p-10 border-r border-b border-[#D8D3C9] bg-transparent hover:bg-[#EAE5DC] transition-colors duration-300"
                            >

                                {/* Top section */}
                                <div className="flex items-center justify-between">

                                    <span className="text-[10px] sm:text-[11px] tracking-[0.18em] text-[#A39C90]">
                                        STEP {item.step}
                                    </span>

                                    <span className="size-10 rounded-full border border-[#D8D3C9] flex items-center justify-center text-[#B97960] group-hover:bg-[#B97960] group-hover:text-[#F8F7F3] group-hover:border-[#B97960] transition-all duration-300">

                                        <Icon
                                            className="size-[17px]"
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />

                                    </span>

                                </div>

                                {/* Main content */}
                                <div className="mt-12 sm:mt-14">

                                    <p className="text-[10px] tracking-[0.18em] uppercase text-[#A18A76] mb-4">
                                        {item.label}
                                    </p>

                                    <h3 className="font-serif font-normal text-[27px] sm:text-[30px] lg:text-[32px] leading-[1.15] tracking-[-0.025em] text-[#292720] max-w-xs">
                                        {item.title}
                                    </h3>

                                    <p className="mt-5 text-[13px] sm:text-sm leading-7 text-[#817B70] max-w-sm">
                                        {item.description}
                                    </p>

                                </div>

                                {/* Bottom step indicator */}
                                <div className="mt-auto pt-10 flex items-center gap-3">

                                    <span className="h-px w-8 bg-[#B97960]/50 group-hover:w-12 transition-all duration-300" />

                                    <span className="font-serif italic text-sm text-[#A39C90]">
                                        {item.step} / 03
                                    </span>

                                </div>

                            </div>
                        );
                    })}

                </div>

                {/* Bottom note */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mt-9 sm:mt-10">

                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#A39C90]">
                        Simple by design. Powerful by nature.
                    </p>

                    <a
                        href="#features"
                        className="group inline-flex items-center gap-2 text-[13px] sm:text-sm text-[#6E665A] hover:text-[#B97960] transition-colors duration-300"
                    >
                        Explore what you can do

                        <ArrowUpRightIcon
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                            aria-hidden="true"
                        />
                    </a>

                </div>

            </div>
        </section>
    );
}
