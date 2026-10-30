
import {
    AlertCircleIcon,
    CheckCircleIcon,
    PlusIcon,
    UnplugIcon,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface AccountListProps {
    accounts: ConnectedAccount[];
    onDisconnect: (accountId: string) => Promise<void>;
}

interface ConnectedAccount {
    _id: string;
    platform: string;
    handle?: string;
    status: "connected" | "disconnected";
}

const AccountList = ({ accounts, onDisconnect }: AccountListProps) => {
    const displayPlatformId = (platformId: string) =>
        platformId === "instagram_business" ? "instagram" : platformId;

    const handleDisconnect = async (accountId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to disconnect this account?"
        );

        if (!confirmed) return;

        await onDisconnect(accountId);
    };

    if (accounts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DED7CA] bg-[#F8F7F3] px-6 py-20 text-center">
                <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-[#DED7CA] bg-white">
                    <PlusIcon className="size-6 text-[#B97960]" strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-xl text-[#292720]">
                    No connected accounts
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#817B70]">
                    Connect your first social platform to start scheduling posts.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {accounts.map((account) => {
                const meta = PLATFORMS.find(
                    (platform) =>
                        platform.id === displayPlatformId(account.platform)
                );

                if (!meta) return null;

                return (
                    <div
                        key={account._id}
                        className="group flex items-center gap-4 rounded-2xl border border-[#DED7CA] bg-white p-5 transition-all duration-200 hover:border-[#B97960]/60 hover:shadow-sm"
                    >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#DED7CA]/70 bg-[#F8F7F3]">
                            <meta.icon
                                className="size-5 text-[#817B70]"
                                strokeWidth={1.6}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#292720]">
                                {account.handle}
                            </p>

                            <p className="mt-1 text-xs text-[#817B70]">
                                {meta.name}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                            {account.status === "connected" ? (
                                <>
                                    <CheckCircleIcon
                                        className="size-4 text-emerald-600"
                                        strokeWidth={1.7}
                                    />
                                    <span className="text-xs text-emerald-700">
                                        Connected
                                    </span>
                                </>
                            ) : (
                                <>
                                    <AlertCircleIcon
                                        className="size-4 text-amber-600"
                                        strokeWidth={1.7}
                                    />
                                    <span className="text-xs text-amber-700">
                                        Disconnected
                                    </span>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleDisconnect(account._id)}
                            title="Disconnect Account"
                            aria-label={`Disconnect ${account.handle || meta.name}`}
                            className="ml-1 rounded-lg p-2 text-[#B6AEA1] transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                            <UnplugIcon className="size-4" strokeWidth={1.6} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AccountList;
