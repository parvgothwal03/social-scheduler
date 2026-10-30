
import { AlertCircleIcon } from "lucide-react";

export default function MissingConfiguration() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F8F7F3] px-5 py-12">
            <div className="w-full max-w-md rounded-3xl border border-[#DED7CA] bg-white p-8 text-center shadow-sm sm:p-10">
                <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-[#B97960]/20 bg-[#B97960]/10">
                    <AlertCircleIcon
                        className="size-6 text-[#B97960]"
                        strokeWidth={1.6}
                    />
                </div>

                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B97960]">
                    Configuration required
                </p>

                <h1 className="font-serif text-2xl leading-snug text-[#292720]">
                    Application configuration is incomplete
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-[#817B70]">
                    The Clerk publishable key is missing. Set
                    <code className="mx-1 rounded-md border border-[#DED7CA] bg-[#F8F7F3] px-2 py-1 font-mono text-xs text-[#292720]">
                        VITE_CLERK_PUBLISHABLE_KEY
                    </code>
                    in the deployment environment and rebuild the client.
                </p>
            </div>
        </main>
    );
}
