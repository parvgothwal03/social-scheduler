
import { StarIcon } from "lucide-react";

const testimonials = [
    {
        name: "Sarah K.",
        role: "Marketing Manager",
        avatar: "S",
        text: "SocialPilot has saved our team 10+ hours a week. The AI composer is genuinely impressive — it writes content that sounds like us.",
    },
    {
        name: "Marcus L.",
        role: "Indie Creator",
        avatar: "M",
        text: "I used to dread posting. Now I queue up a whole week of content in 20 minutes. The smart scheduling feature alone is worth it.",
    },
    {
        name: "Priya D.",
        role: "Startup Founder",
        avatar: "P",
        text: "Finally a scheduler that's beautiful AND powerful. The clean dashboard makes it easy to see exactly what's going out and when.",
    },
];

export default function Testimonials() {
    return (
        <section className="relative overflow-hidden bg-[#F8F7F3] py-24 text-[#292720] sm:py-32">
            <div className="mx-auto max-w-7xl px-6 sm:px-10">
                {/* Section heading */}
                <div className="mb-16 text-center">
                    <div className="mb-8 inline-flex items-center gap-2">
                        <StarIcon
                            className="size-3 text-[#B97960]"
                            aria-hidden="true"
                        />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#887E6F]">
                            What people are saying
                        </span>
                    </div>

                    <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.04em] sm:text-6xl">
                        Loved by
                        <br className="sm:hidden" />{" "}
                        <span className="italic text-[#B97960]">
                            creators &amp; teams.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-lg text-base font-light leading-8 text-[#817B70] sm:text-lg">
                        Join thousands of people who automate their social media
                        with SocialPilot and find more time to create.
                    </p>
                </div>

                {/* Testimonial cards */}
                <div className="grid grid-cols-1 gap-0 border-l border-t border-[#DED7CA] md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <article
                            key={testimonial.name}
                            className="flex flex-col gap-7 border-b border-r border-[#DED7CA] bg-[#F8F7F3] p-7 transition-colors duration-300 hover:bg-[#F1EDE4] sm:p-8"
                        >
                            {/* Stars */}
                            <div
                                className="flex items-center gap-1"
                                aria-label="5 out of 5 stars"
                            >
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className="size-3.5 fill-[#B97960] text-[#B97960]"
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <div className="flex-1">
                                <span
                                    className="font-serif text-4xl leading-none text-[#B97960]/60"
                                    aria-hidden="true"
                                >
                                    “
                                </span>

                                <p className="-mt-1 text-sm font-light leading-7 text-[#686257]">
                                    {testimonial.text}
                                </p>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3 border-t border-[#DED7CA] pt-6">
                                <div className="flex size-10 shrink-0 items-center justify-center border border-[#E3DCCE] bg-[#EEEAE1] font-serif text-lg text-[#B97960]">
                                    {testimonial.avatar}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#292720]">
                                        {testimonial.name}
                                    </p>

                                    <p className="mt-1 text-xs text-[#A39C90]">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Bottom note */}
                <p className="mt-12 text-center text-[11px] uppercase tracking-[0.16em] text-[#A39C90]">
                    Made for people who love creating
                </p>
            </div>
        </section>
    );
}
