
import {
    CheckCircleIcon,
    ExternalLinkIcon,
    XIcon,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerModalProps {
    connectedIds: string[];
    connecting: string | null;
    onClose: () => void;
    onConnect: (platformId: string) => void;
}

const PlatformPickerModal = ({
    connectedIds,
    connecting,
    onClose,
    onConnect,
}: PlatformPickerModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#292720]/40 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="platform-picker-title"
                className="w-full max-w-md overflow-hidden rounded-3xl border border-[#DED7CA] bg-[#FDFCF9] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#DED7CA] px-6 py-5">
                    <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B97960]">
                            Social accounts
                        </p>

                        <h3
                            id="platform-picker-title"
                            className="font-serif text-xl text-[#292720]"
                        >
                            Choose a Platform
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close platform picker"
                        className="rounded-full border border-[#DED7CA] p-2 text-[#817B70] transition-colors hover:border-[#B97960] hover:bg-[#F8F7F3] hover:text-[#B97960]"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>

                {/* Platform List */}
                <div className="flex flex-col gap-2 p-5 sm:p-6">
                    {PLATFORMS.map((platform) => {
                        const isConnected = connectedIds.includes(platform.id);
                        const isConnecting = connecting === platform.id;

                        return (
                            <button
                                key={platform.id}
                                type="button"
                                disabled={isConnected || isConnecting}
                                onClick={() => onConnect(platform.id)}
                                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                                    isConnected
                                        ? "cursor-default border-emerald-200 bg-emerald-50/60"
                                        : "cursor-pointer border-[#DED7CA] bg-white hover:border-[#B97960] hover:bg-[#F8F7F3]"
                                } ${
                                    isConnecting
                                        ? "cursor-wait opacity-60"
                                        : ""
                                }`}
                            >
                                {/* Platform Icon */}
                                <div
                                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${
                                        isConnected
                                            ? "border-emerald-200 bg-white"
                                            : "border-[#DED7CA] bg-[#F8F7F3]"
                                    }`}
                                >
                                    <platform.icon
                                        className={`size-5 ${
                                            isConnected
                                                ? "text-emerald-600"
                                                : "text-[#817B70]"
                                        }`}
                                        strokeWidth={1.6}
                                    />
                                </div>

                                {/* Platform Details */}
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`text-sm font-medium ${
                                            isConnected
                                                ? "text-emerald-800"
                                                : "text-[#292720]"
                                        }`}
                                    >
                                        {platform.name}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-[#817B70]">
                                        {isConnected
                                            ? "Already connected"
                                            : platform.description}
                                    </p>
                                </div>

                                {/* Status */}
                                {isConnected && (
                                    <CheckCircleIcon className="size-4 shrink-0 text-emerald-600" />
                                )}

                                {isConnecting && (
                                    <div className="size-4 shrink-0 animate-spin rounded-full border-2 border-[#B97960] border-t-transparent" />
                                )}

                                {!isConnected && !isConnecting && (
                                    <ExternalLinkIcon className="size-4 shrink-0 text-[#B6AEA1]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlatformPickerModal;
