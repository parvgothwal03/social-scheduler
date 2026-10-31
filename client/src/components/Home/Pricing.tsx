import { useState, type FormEvent } from "react";
import { ArrowUpRightIcon, CheckIcon, StarIcon } from "lucide-react";

const priceOptions = ["₹1000 / month", "₹1500 / month", "₹1800/ month", "₹2000 / month", "Not sure yet"];

type WishlistForm = {
  email: string;
  rating: number;
  willingness: "yes" | "maybe" | "no";
  budget: string;
  feedback: string;
};

const initialForm: WishlistForm = {
  email: "",
  rating: 0,
  willingness: "maybe",
  budget: " ₹1000 / month",
  feedback: "",
};

export default function Pricing() {
  const [form, setForm] = useState<WishlistForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const updateForm = <K extends keyof WishlistForm>(key: K, value: WishlistForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      // Create this endpoint in your backend to store the response and email it to you.
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });

      if (!response.ok) throw new Error("The submission could not be sent.");
      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error("Wishlist submission failed:", error);
      setStatus("error");
    }
  }

  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 overflow-hidden bg-[#F8F7F3] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <div className="mb-8 inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#B97960]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#887E6F]">
              Early access · Your voice matters
            </span>
          </div>

          <h2 className="font-serif text-[44px] leading-[1.08] tracking-[-0.045em] text-[#292720] sm:text-6xl md:text-7xl">
            Be part of what comes
            <br />
            <span className="italic text-[#B97960]">next.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-base font-light leading-8 text-[#817B70] sm:text-lg">
            We're shaping the future of social media automation. Tell us what you think,
            what you'd love to see, and whether you'd join us when we launch.
          </p>
        </div>

        {/* Wishlist form */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 border border-[#DED7CA] md:grid-cols-[0.85fr_1.15fr]">
          <aside className="relative flex flex-col justify-between bg-[#292720] p-8 text-[#F8F7F3] sm:p-10 lg:p-12">
            <div>
              <div className="mb-10 flex items-center justify-between">
                <span className="text-[11px] tracking-[0.18em] text-[#B9A99A]">THE NEXT CHAPTER</span>
                <span className="border border-[#817B70] px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-[#D2B39D]">
                  Early access
                </span>
              </div>

              <h3 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
                Built with you,
                <br />
                <span className="italic text-[#D2A58C]">not just for you.</span>
              </h3>

              <p className="mt-6 text-sm font-light leading-7 text-[#BDB6AA]">
                Your feedback helps us prioritize features, understand real needs, and
                choose a fair subscription price.
              </p>

              <div className="mt-10 space-y-5 border-t border-white/15 pt-8">
                {[
                  "No payment required today",
                  "Help shape upcoming features",
                  "Be among the first to hear about launch",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-[#D2A58C]" strokeWidth={1.8} />
                    <span className="text-sm leading-6 text-[#E2DDD3]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-14 text-[10px] uppercase tracking-[0.16em] text-[#A39C90]">
              A better product starts with a conversation.
            </p>
          </aside>

          <form onSubmit={handleSubmit} className="bg-[#F8F7F3] p-7 sm:p-10 lg:p-12">
            {/* Rating */}
            <div className="border-b border-[#DED7CA] pb-8">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-[0.16em] text-[#887E6F]">
                  01 / Your impression
                </label>
                <span className="text-xs text-[#A39C90]">{form.rating ? `${form.rating} of 5` : "Select a rating"}</span>
              </div>
              <h4 className="font-serif text-2xl text-[#292720]">How would you rate the product?</h4>
              <div className="mt-5 flex gap-2" role="radiogroup" aria-label="Product rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => updateForm("rating", rating)}
                    aria-label={`${rating} out of 5 stars`}
                    aria-pressed={form.rating === rating}
                    className={`flex size-11 items-center justify-center border transition-colors ${
                      form.rating >= rating
                        ? "border-[#B97960] bg-[#B97960] text-[#F8F7F3]"
                        : "border-[#DED7CA] text-[#A39C90] hover:border-[#B97960] hover:text-[#B97960]"
                    }`}
                  >
                    <StarIcon className="size-4" fill={form.rating >= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            {/* Willingness to pay */}
            <div className="border-b border-[#DED7CA] py-8">
              <label className="text-[11px] uppercase tracking-[0.16em] text-[#887E6F]">
                02 / Subscription interest
              </label>
              <h4 className="mt-4 font-serif text-2xl text-[#292720]">
                Would you be willing to pay for a subscription?
              </h4>
              <div className="mt-5 grid gap-3">
                {[
                  { value: "yes", title: "Yes, definitely", detail: "I'd happily pay for the right features." },
                  { value: "maybe", title: "Maybe, depending on the price", detail: "It depends on the value and plan." },
                  { value: "no", title: "I'd prefer a free plan", detail: "I'd rather use a free version." },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                      form.willingness === option.value
                        ? "border-[#B97960] bg-[#F1EDE4]"
                        : "border-[#DED7CA] hover:border-[#B97960]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="willingness"
                      value={option.value}
                      checked={form.willingness === option.value}
                      onChange={() => updateForm("willingness", option.value as WishlistForm["willingness"])}
                      className="mt-1 accent-[#B97960]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-[#292720]">{option.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#817B70]">{option.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-[#DED7CA] py-8">
              <label htmlFor="budget" className="text-[11px] uppercase tracking-[0.16em] text-[#887E6F]">
                03 / Your ideal price
              </label>
              <h4 className="mt-4 font-serif text-2xl text-[#292720]">
                What would feel fair per month?
              </h4>
              <select
                id="budget"
                value={form.budget}
                onChange={(event) => updateForm("budget", event.target.value)}
                className="mt-5 w-full appearance-none border border-[#DED7CA] bg-transparent px-4 py-4 text-sm text-[#292720] outline-none transition-colors focus:border-[#B97960]"
              >
                {priceOptions.map((price) => <option key={price} value={price}>{price}</option>)}
              </select>
            </div>

            {/* Contact and feedback */}
            <div className="py-8">
              <label htmlFor="email" className="text-[11px] uppercase tracking-[0.16em] text-[#887E6F]">
                04 / Stay in the loop
              </label>
              <h4 className="mt-4 font-serif text-2xl text-[#292720]">Where can we reach you?</h4>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                placeholder="Your email address"
                className="mt-5 w-full border border-[#DED7CA] bg-transparent px-4 py-4 text-sm text-[#292720] outline-none transition-colors placeholder:text-[#A39C90] focus:border-[#B97960]"
              />

              <label htmlFor="feedback" className="mt-7 block text-[11px] uppercase tracking-[0.16em] text-[#887E6F]">
                Anything else? <span className="normal-case tracking-normal text-[#A39C90]">(optional)</span>
              </label>
              <textarea
                id="feedback"
                rows={4}
                value={form.feedback}
                onChange={(event) => updateForm("feedback", event.target.value)}
                placeholder="Features you'd love, ideas, or anything we should know..."
                className="mt-4 w-full resize-y border border-[#DED7CA] bg-transparent px-4 py-4 text-sm leading-6 text-[#292720] outline-none transition-colors placeholder:text-[#A39C90] focus:border-[#B97960]"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex w-full items-center justify-center gap-2 bg-[#292720] px-5 py-4 text-sm font-medium text-[#F8F7F3] transition-colors duration-300 hover:bg-[#454137] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : "Join the Wishlist"}
              <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>

            {status === "success" && (
              <p role="status" className="mt-4 border border-[#B8C5AE] bg-[#EEF1E9] p-3 text-sm text-[#465640]">
                Thank you! Your response has been received.
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="mt-4 border border-[#D9B7A9] bg-[#F5EAE5] p-3 text-sm text-[#87533F]">
                We couldn't send your response. Please try again in a moment.
              </p>
            )}
            <p className="mt-4 text-center text-[11px] leading-5 text-[#A39C90]">
              No payment required. Your details will only be used for product updates.
            </p>
          </form>
        </div>

        {/* Bottom note */}
        <div className="mt-9 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#A39C90]">
            Your feedback. Our next step.
          </p>
          <p className="text-sm text-[#817B70]">
            Have a question?{" "}
            <a
              href="mailto:parvgothwal0310@gmail.com"
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
