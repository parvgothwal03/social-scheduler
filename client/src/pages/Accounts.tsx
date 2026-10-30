
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { PlusIcon, Share2Icon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModal from "../components/PlatformPickerModal";
import api from "../api/axios";
import toast from "react-hot-toast";
import { PLATFORMS } from "../assets/assets";

const Accounts = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [connecting, setConnecting] = useState<string | null>(null);
    const [showPlatformPicker, setShowPlatformPicker] = useState(false);

    const fetchAccounts = async (
        isSync = false,
        platform?: string | null,
        successMsg?: string
    ) => {
        try {
            if (isSync) {
                const label = platform
                    ? platform.charAt(0).toUpperCase() + platform.slice(1)
                    : "Social Media";

                toast.loading(`Syncing ${label} accounts...`, { id: "sync" });

                await api.get("/api/oauth/sync");

                toast.success(
                    successMsg || "Accounts synced successfully!",
                    { id: "sync" }
                );
            }

            const { data } = await api.get("/api/accounts");
            setAccounts(data);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load accounts"
            );
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const connectedPlatform = params.get("connected");
        const connectedUsername = params.get("username");
        const syncNeeded = params.get("sync") === "true";
        const errorMsg = params.get("error");

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        if (connectedPlatform) {
            const label =
                connectedPlatform.charAt(0).toUpperCase() +
                connectedPlatform.slice(1);

            const handle = connectedUsername
                ? `{@${connectedUsername}`
                : "";

            fetchAccounts(
                true,
                connectedPlatform,
                `${label}${handle} connected successfully!`
            );
        } else if (errorMsg) {
            toast.error(`Connection failed: ${decodeURIComponent(errorMsg)}`);
            fetchAccounts();
        } else if (syncNeeded) {
            fetchAccounts(true, null, "Accounts synced!");
        } else {
            fetchAccounts();
        }
    }, []);

    const handleConnect = async (platformId: string) => {
        setConnecting(platformId);

        try {
            const { data } = await api.get(
                `/api/oauth/${platformId}/url`
            );

            window.location.href = data.url;
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                `Failed to connect ${platformId}`
            );

            setConnecting(null);
        }
    };

    const handleDisconnect = async (accountId: string) => {
        try {
            await api.delete(`/api/accounts/${accountId}`);

            toast.success("Account disconnected successfully!");

            await fetchAccounts();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to disconnect account"
            );
        }
    };

    const connectedIds = accounts.map((a) =>
        a.platform === "instagram_business"
            ? "instagram"
            : a.platform
    );

    return (
        <div className="mx-auto max-w-5xl space-y-9 pb-16 text-[#292720]">

            {/* Header */}
            <div className="flex flex-col gap-5 border-b border-[#DED7CA] pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B97960]">
                        <span className="size-1.5 rounded-full bg-[#B97960]" />
                        Social connections
                    </div>

                    <h2 className="font-serif text-3xl tracking-tight text-[#292720] sm:text-4xl">
                        Connected Accounts
                    </h2>

                    <p className="mt-2 text-sm text-[#817B70]">
                        {accounts.length} of {PLATFORMS.length} platforms connected
                    </p>
                </div>

                <button
                    onClick={() => setShowPlatformPicker(true)}
                    className="inline-flex w-full items-center justify-center gap-2 border border-[#B97960] bg-[#B97960] px-5 py-3 text-xs font-medium tracking-wide text-white transition-colors duration-300 hover:border-[#A56750] hover:bg-[#A56750] sm:w-auto"
                >
                    <PlusIcon className="size-4" strokeWidth={1.8} />
                    Connect Account
                </button>
            </div>

            {/* Account overview */}
            <div className="flex items-center gap-4 border border-[#DED7CA] bg-[#F8F7F3] p-5 sm:p-6">
                <div className="flex size-11 shrink-0 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                    <Share2Icon className="size-5" strokeWidth={1.6} />
                </div>

                <div>
                    <p className="text-sm font-medium text-[#292720]">
                        Your social media connections
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#817B70]">
                        Manage your connected platforms and keep your accounts
                        ready for publishing.
                    </p>
                </div>
            </div>

            {/* Platform Picker Modal */}
            {showPlatformPicker && (
                <PlatformPickerModal
                    connectedIds={connectedIds}
                    connecting={connecting}
                    onClose={() => setShowPlatformPicker(false)}
                    onConnect={handleConnect}
                />
            )}

            {/* Connected Accounts List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#887E6F]">
                        Your platforms
                    </h3>

                    <span className="text-xs text-[#A39C90]">
                        {accounts.length} connected
                    </span>
                </div>

                <AccountList
                    accounts={accounts}
                    onDisconnect={handleDisconnect}
                />
            </section>
        </div>
    );
};

export default Accounts;
