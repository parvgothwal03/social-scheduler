
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="bg-[#F8F7F3] py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 sm:px-10">
                {/* CTA container */}
                <div className="relative overflow-hidden border border-[#DED7CA] bg-[#F1EDE4] px-6 py-20 text-center sm:px-12 sm:py-28">
                    <div className="relative mx-auto max-w-3xl">
                        {/* Label */}
                        <div className="mb-9 inline-flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[#B97960]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#887E6F]">
                                Your next chapter starts here
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="font-serif text-[43px] leading-[1.1] tracking-[-0.04em] text-[#292720] sm:text-6xl md:text-7xl">
                            Make time for
                            <br />
                            <span className="italic text-[#B97960]">
                                better ideas.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-7 max-w-xl text-base font-light leading-8 text-[#817B70] sm:text-lg">
                            Let the busywork take care of itself.
                            Create meaningful content, plan your posts
                            and grow your social presence — all in one place.
                        </p>

                        {/* Buttons */}
                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                to="/login"
                                className="group inline-flex w-full items-center justify-center gap-3 bg-[#292720] px-9 py-4 text-sm font-medium text-[#F8F7F3] transition-colors duration-300 hover:bg-[#454137] sm:w-auto"
                            >
                                Get started for free

                                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>

                            <a
                                href="#pricing"
                                className="inline-flex w-full items-center justify-center gap-2 border border-[#D8D1C5] px-9 py-4 text-sm text-[#555044] transition-colors duration-300 hover:bg-white/60 sm:w-auto"
                            >
                                Explore pricing
                            </a>
                        </div>

                        {/* Bottom note */}
                        <p className="mt-7 text-[10px] uppercase tracking-[0.16em] text-[#A39C90]">
                            Free forever plan · No credit card required
                        </p>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#B97960]/40 to-transparent" />
                </div>

                {/* Supporting notes */}
                <div className="mt-8 flex flex-col items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-[#A39C90] sm:flex-row">
                    <span>Make something worth sharing.</span>
                    <span>Less managing. More creating.</span>
                </div>
            </div>
        </section>
    );
}
