
import { CheckIcon, ArrowUpRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        description:
            "Perfect for creators just getting started with social media automation.",
        features: [
            "2 social accounts",
            "10 scheduled posts/month",
            "AI content (5 credits/mo)",
            "Basic dashboard",
        ],
        cta: "Get Started Free",
        highlight: false,
        number: "01",
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description:
            "Everything you need to grow and automate your social presence.",
        features: [
            "Unlimited accounts",
            "Unlimited scheduling",
            "AI content (200 credits/mo)",
            "Priority support",
        ],
        cta: "Start 14-day Free Trial",
        highlight: true,
        number: "02",
    },
    {
        name: "Agency",
        price: "$79",
        period: "/month",
        description:
            "For teams and agencies managing multiple brands at scale.",
        features: [
            "Everything in Pro",
            "5 team members",
            "Unlimited AI credits",
            "Custom AI personas",
            "Dedicated support",
        ],
        cta: "Contact Sales",
        highlight: false,
        number: "03",
    },
];

export default function Pricing() {
    return (
        <section
            id="pricing"
            className="relative scroll-mt-20 overflow-hidden bg-[#F8F7F3] py-24 sm:py-32"
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-10">
                {/* Heading */}
                <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
                    <div className="mb-8 inline-flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B97960]" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#887E6F]">
                            Simple, honest pricing
                        </span>
                    </div>

                    <h2 className="font-serif text-[44px] leading-[1.08] tracking-[-0.045em] text-[#292720] sm:text-6xl md:text-7xl">
                        Plans for every stage
                        <br />
                        <span className="italic text-[#B97960]">
                            of your growth.
                        </span>
                    </h2>

                    <p className="mx-auto mt-7 max-w-lg text-base font-light leading-8 text-[#817B70] sm:text-lg">
                        Start with what you need. Grow when you're ready.
                        Straightforward pricing, without the surprises.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 border-l border-t border-[#DED7CA] md:grid-cols-3">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`
                                relative flex flex-col border-b border-r border-[#DED7CA]
                                p-7 transition-colors duration-300 sm:p-9
                                ${
                                    plan.highlight
                                        ? "bg-[#292720] text-[#F8F7F3]"
                                        : "bg-[#F8F7F3] text-[#292720] hover:bg-[#F1EDE4]"
                                }
                            `}
                        >
                            {/* Plan header */}
                            <div className="mb-9 flex items-center justify-between">
                                <span
                                    className={`text-[11px] tracking-[0.18em] ${
                                        plan.highlight
                                            ? "text-[#B9A99A]"
                                            : "text-[#A39C90]"
                                    }`}
                                >
                                    PLAN {plan.number}
                                </span>

                                {plan.highlight && (
                                    <span className="border border-[#817B70] px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-[#D2B39D]">
                                        Most popular
                                    </span>
                                )}
                            </div>

                            {/* Plan name and description */}
                            <div>
                                <h3
                                    className={`font-serif text-3xl ${
                                        plan.highlight
                                            ? "text-[#F8F7F3]"
                                            : "text-[#292720]"
                                    }`}
                                >
                                    {plan.name}
                                </h3>

                                <p
                                    className={`mt-3 min-h-[72px] text-sm leading-7 ${
                                        plan.highlight
                                            ? "text-[#BDB6AA]"
                                            : "text-[#817B70]"
                                    }`}
                                >
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div
                                className={`mt-8 border-b pb-8 ${
                                    plan.highlight
                                        ? "border-white/15"
                                        : "border-[#DED7CA]"
                                }`}
                            >
                                <div className="flex items-baseline gap-1">
                                    <span className="font-serif text-5xl tracking-tight">
                                        {plan.price}
                                    </span>

                                    <span
                                        className={`text-sm ${
                                            plan.highlight
                                                ? "text-[#BDB6AA]"
                                                : "text-[#A39C90]"
                                        }`}
                                    >
                                        {plan.period}
                                    </span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex-1 py-8">
                                <p
                                    className={`mb-6 text-[10px] uppercase tracking-[0.18em] ${
                                        plan.highlight
                                            ? "text-[#B9A99A]"
                                            : "text-[#A39C90]"
                                    }`}
                                >
                                    What's included
                                </p>

                                <ul className="space-y-5">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckIcon
                                                className={`mt-0.5 size-4 shrink-0 ${
                                                    plan.highlight
                                                        ? "text-[#D2A58C]"
                                                        : "text-[#B97960]"
                                                }`}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />

                                            <span
                                                className={`text-sm leading-6 ${
                                                    plan.highlight
                                                        ? "text-[#E2DDD3]"
                                                        : "text-[#686257]"
                                                }`}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <Link
                                to={
                                    plan.name === "Agency"
                                        ? "/#"
                                        : "/login"
                                }
                                className={`
                                    group flex w-full items-center justify-center gap-2
                                    px-5 py-4 text-sm font-medium
                                    transition-colors duration-300
                                    ${
                                        plan.highlight
                                            ? "bg-[#F8F7F3] text-[#292720] hover:bg-[#E8E2D7]"
                                            : "bg-[#292720] text-[#F8F7F3] hover:bg-[#454137]"
                                    }
                                `}
                            >
                                {plan.cta}

                                <ArrowUpRightIcon
                                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                    aria-hidden="true"
                                />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom note */}
                <div className="mt-9 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#A39C90]">
                        Simple plans. Room to grow.
                    </p>

                    <p className="text-sm text-[#817B70]">
                        Questions about pricing?{" "}
                        <a
                            href="mailto:support@yourdomain.com"
                            className="text-[#B97960] underline underline-offset-4 transition-colors hover:text-[#292720]"
                        >
                            Get in touch.
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
