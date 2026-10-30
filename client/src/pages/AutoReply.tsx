/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import {
    Loader2Icon,
    MessageSquareReplyIcon,
    PlusIcon,
    SaveIcon,
    Settings2Icon,
    TrashIcon,
    SparklesIcon,
    ZapIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    getAutoReplySettings,
    updateAutoReplySettings,
    type AutoReplyRule,
} from "../api/autoReply.js";
import api from "../api/axios.js";

interface ConnectedAccount {
    _id: string;
    handle?: string;
    platform: string;
    zernioAccountId?: string;
    status: string;
}

const DEFAULT_AI_PROMPT =
    "Respond warmly and helpfully. Keep responses under 25 words and include a link if asked for info.";

export const AutoReply = () => {
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [accountId, setAccountId] = useState("");
    const [isEnabled, setIsEnabled] = useState(false);
    const [mode, setMode] = useState<"keyword" | "ai">("keyword");
    const [aiPrompt, setAiPrompt] = useState(DEFAULT_AI_PROMPT);
    const [rules, setRules] = useState<AutoReplyRule[]>([]);
    const [newKeyword, setNewKeyword] = useState("");
    const [newReply, setNewReply] = useState("");
    const [newDmReply, setNewDmReply] = useState("");
    const [newReplyType, setNewReplyType] =
        useState<AutoReplyRule["replyType"]>("comment");
    const [enableDmFollowUp, setEnableDmFollowUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const accountsResponse =
                    await api.get<ConnectedAccount[]>("/api/accounts");

                const connectedAccounts = accountsResponse.data.filter(
                    (account) =>
                        account.status === "connected" &&
                        account.zernioAccountId
                );

                setAccounts(connectedAccounts);

                const selectedAccountId =
                    connectedAccounts[0]?.zernioAccountId;

                if (!selectedAccountId) {
                    return;
                }

                setAccountId(selectedAccountId);

                const data = await getAutoReplySettings(selectedAccountId);

                if (data) {
                    setIsEnabled(data.isEnabled);
                    setMode(data.mode || "keyword");
                    setAiPrompt(data.aiPrompt || DEFAULT_AI_PROMPT);
                    setEnableDmFollowUp(Boolean(data.enableDmFollowUp));

                    setRules(
                        (data.rules || []).map((rule) => ({
                            ...rule,
                            replyType: rule.replyType || "comment",
                            publicReplyText:
                                rule.publicReplyText || rule.replyText || "",
                        }))
                    );
                }
            } catch (err) {
                console.error("Failed to load auto-reply settings", err);
                toast.error("Failed to load auto-reply settings.");
            } finally {
                setFetching(false);
            }
        };

        fetchSettings();
    }, []);

    const handleAccountChange = async (selectedAccountId: string) => {
        setAccountId(selectedAccountId);
        setFetching(true);

        try {
            const data = await getAutoReplySettings(selectedAccountId);

            setIsEnabled(data.isEnabled);
            setMode(data.mode || "keyword");
            setAiPrompt(data.aiPrompt || DEFAULT_AI_PROMPT);
            setEnableDmFollowUp(Boolean(data.enableDmFollowUp));

            setRules(
                (data.rules || []).map((rule) => ({
                    ...rule,
                    replyType: rule.replyType || "comment",
                    publicReplyText:
                        rule.publicReplyText || rule.replyText || "",
                }))
            );
        } catch (err) {
            console.error("Failed to load account auto-reply settings", err);
            toast.error("Failed to load settings for this account.");
        } finally {
            setFetching(false);
        }
    };

    const handleAddRule = () => {
        if (
            !newKeyword.trim() ||
            (newReplyType !== "dm" && !newReply.trim()) ||
            (newReplyType !== "comment" && !newDmReply.trim())
        ) {
            toast.error("Please enter the required reply message(s).");
            return;
        }

        setRules([
            ...rules,
            {
                keyword: newKeyword.trim().toLowerCase(),
                replyType: newReplyType,
                publicReplyText: newReply.trim() || undefined,
                dmReplyText: newDmReply.trim() || undefined,
            },
        ]);

        setNewKeyword("");
        setNewReply("");
        setNewDmReply("");
        setNewReplyType("comment");
    };

    const handleDeleteRule = (index: number) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!accountId) {
            toast.error("Connect a social account before saving settings.");
            return;
        }

        setLoading(true);

        try {
            await updateAutoReplySettings({
                accountId,
                isEnabled,
                mode,
                aiPrompt: mode === "ai" ? aiPrompt : undefined,
                enableDmFollowUp,
                rules: mode === "keyword" ? rules : [],
            });

            toast.success("Auto Reply settings saved successfully!");
        } catch (err: any) {
            console.error("Failed to save settings", err);
            toast.error(
                err?.response?.data?.message ||
                    "Failed to save settings. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2Icon className="size-6 animate-spin text-[#B97960]" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-9 pb-20 text-[#292720]">

            {/* Header */}
            <div className="flex flex-col gap-6 border-b border-[#DED7CA] pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B97960]">
                        <span className="size-1.5 rounded-full bg-[#B97960]" />
                        Automation settings
                    </div>

                    <h1 className="font-serif text-3xl tracking-tight text-[#292720] sm:text-4xl">
                        Auto Comment Reply
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-[#817B70]">
                        Automatically respond to incoming comments on your
                        connected accounts.
                    </p>
                </div>

                {/* Account Selector */}
                <div className="w-full sm:w-56">
                    <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-[#887E6F]">
                        Select account
                    </label>

                    <select
                        value={accountId}
                        onChange={(event) =>
                            handleAccountChange(event.target.value)
                        }
                        disabled={accounts.length === 0}
                        className="w-full border border-[#DED7CA] bg-[#F8F7F3] px-4 py-3 text-sm text-[#292720] outline-none transition-colors focus:border-[#B97960] disabled:opacity-60"
                    >
                        {accounts.length === 0 ? (
                            <option value="">No connected accounts</option>
                        ) : (
                            accounts.map((account) => (
                                <option
                                    key={account.zernioAccountId}
                                    value={account.zernioAccountId}
                                >
                                    {account.handle || account.platform}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>

            {/* Main Status */}
            <section className="flex flex-col gap-5 border border-[#DED7CA] bg-[#F8F7F3] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                    <div
                        className={`flex size-11 shrink-0 items-center justify-center border ${
                            isEnabled
                                ? "border-[#B97960]/30 bg-[#B97960]/10 text-[#B97960]"
                                : "border-[#DED7CA] bg-[#F1EDE4] text-[#817B70]"
                        }`}
                    >
                        <MessageSquareReplyIcon
                            className="size-5"
                            strokeWidth={1.6}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[#292720]">
                            Auto Reply Status
                        </p>

                        <p className="mt-1 text-xs text-[#817B70]">
                            {isEnabled
                                ? "Automatic replies are enabled for this account."
                                : "Automatic replies are currently paused."}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsEnabled(!isEnabled)}
                    aria-pressed={isEnabled}
                    className="flex items-center justify-between gap-4 border border-[#DED7CA] bg-white px-4 py-3 transition-colors hover:border-[#B97960] sm:min-w-36"
                >
                    <span
                        className={`text-xs font-medium ${
                            isEnabled ? "text-[#B97960]" : "text-[#817B70]"
                        }`}
                    >
                        {isEnabled ? "Active" : "Paused"}
                    </span>

                    <span
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                            isEnabled ? "bg-[#B97960]" : "bg-[#D8D2C7]"
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                isEnabled ? "translate-x-4" : "translate-x-0.5"
                            }`}
                        />
                    </span>
                </button>
            </section>

            {/* Reply Strategy */}
            <section className="space-y-6 border border-[#DED7CA] bg-[#F8F7F3] p-5 sm:p-7">
                <div className="flex items-center gap-3 border-b border-[#DED7CA] pb-5">
                    <div className="flex size-9 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                        <Settings2Icon className="size-4" />
                    </div>

                    <div>
                        <h2 className="font-serif text-xl text-[#292720]">
                            Reply Strategy
                        </h2>

                        <p className="mt-1 text-xs text-[#A39C90]">
                            Choose how incoming comments should be handled
                        </p>
                    </div>
                </div>

                {/* Strategy Options */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => setMode("keyword")}
                        aria-pressed={mode === "keyword"}
                        className={`border p-5 text-left transition-all duration-200 ${
                            mode === "keyword"
                                ? "border-[#B97960] bg-[#F1EDE4]"
                                : "border-[#DED7CA] bg-white hover:border-[#B97960]"
                        }`}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex size-9 items-center justify-center border border-[#DED7CA] bg-[#F8F7F3] text-[#B97960]">
                                <ZapIcon className="size-4" />
                            </div>

                            <span
                                className={`size-2 rounded-full ${
                                    mode === "keyword"
                                        ? "bg-[#B97960]"
                                        : "bg-[#DED7CA]"
                                }`}
                            />
                        </div>

                        <h3 className="text-sm font-medium text-[#292720]">
                            Keyword Triggers
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-[#817B70]">
                            Match specific phrases (e.g., "price", "link") and
                            respond with pre-set templates.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("ai")}
                        aria-pressed={mode === "ai"}
                        className={`border p-5 text-left transition-all duration-200 ${
                            mode === "ai"
                                ? "border-[#B97960] bg-[#F1EDE4]"
                                : "border-[#DED7CA] bg-white hover:border-[#B97960]"
                        }`}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex size-9 items-center justify-center border border-[#DED7CA] bg-[#F8F7F3] text-[#B97960]">
                                <SparklesIcon className="size-4" />
                            </div>

                            <span
                                className={`size-2 rounded-full ${
                                    mode === "ai"
                                        ? "bg-[#B97960]"
                                        : "bg-[#DED7CA]"
                                }`}
                            />
                        </div>

                        <h3 className="text-sm font-medium text-[#292720]">
                            AI Context Responder
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-[#817B70]">
                            Let an AI model analyze the comment and draft a
                            contextual, natural reply.
                        </p>
                    </button>
                </div>

                {/* Keyword Mode */}
                {mode === "keyword" && (
                    <div className="space-y-6 border-t border-[#DED7CA] pt-6">
                        <div className="flex items-center gap-3">
                            <Settings2Icon className="size-4 text-[#B97960]" />

                            <h3 className="font-serif text-lg text-[#292720]">
                                Active Rules
                            </h3>

                            <span className="text-xs text-[#A39C90]">
                                {rules.length} rules
                            </span>
                        </div>

                        {/* Add Rule Form */}
                        <div className="space-y-3 border border-[#DED7CA] bg-white p-4 sm:p-5">
                            <p className="text-[10px] uppercase tracking-[0.15em] text-[#887E6F]">
                                Create a new rule
                            </p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <input
                                    type="text"
                                    placeholder="Keyword (e.g., pricing)"
                                    value={newKeyword}
                                    onChange={(e) =>
                                        setNewKeyword(e.target.value)
                                    }
                                    className="w-full border border-[#DED7CA] bg-[#F8F7F3] px-4 py-3 text-sm text-[#292720] outline-none placeholder:text-[#A39C90] focus:border-[#B97960]"
                                />

                                <select
                                    value={newReplyType}
                                    onChange={(event) =>
                                        setNewReplyType(
                                            event.target.value as AutoReplyRule["replyType"]
                                        )
                                    }
                                    className="w-full border border-[#DED7CA] bg-[#F8F7F3] px-4 py-3 text-sm text-[#292720] outline-none focus:border-[#B97960]"
                                >
                                    <option value="comment">Comment only</option>
                                    <option value="dm">DM only</option>
                                    <option value="both">Comment + DM</option>
                                </select>
                            </div>

                            {newReplyType !== "dm" && (
                                <input
                                    type="text"
                                    placeholder="Public reply message..."
                                    value={newReply}
                                    onChange={(e) =>
                                        setNewReply(e.target.value)
                                    }
                                    className="w-full border border-[#DED7CA] bg-[#F8F7F3] px-4 py-3 text-sm text-[#292720] outline-none placeholder:text-[#A39C90] focus:border-[#B97960]"
                                />
                            )}

                            {newReplyType !== "comment" && (
                                <input
                                    type="text"
                                    placeholder="Private DM message..."
                                    value={newDmReply}
                                    onChange={(e) =>
                                        setNewDmReply(e.target.value)
                                    }
                                    className="w-full border border-[#DED7CA] bg-[#F8F7F3] px-4 py-3 text-sm text-[#292720] outline-none placeholder:text-[#A39C90] focus:border-[#B97960]"
                                />
                            )}

                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={handleAddRule}
                                    className="flex items-center justify-center gap-2 bg-[#292720] px-5 py-3 text-xs font-medium text-white transition-colors duration-300 hover:bg-[#B97960]"
                                >
                                    <PlusIcon className="size-4" />
                                    Add Rule
                                </button>
                            </div>
                        </div>

                        {/* Rules List */}
                        <div className="space-y-3">
                            {rules.map((rule, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col gap-4 border border-[#DED7CA] bg-white p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"
                                >
                                    <div className="min-w-0 flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="border border-[#DED7CA] bg-[#F1EDE4] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#B97960]">
                                                Keyword: "{rule.keyword}"
                                            </span>

                                            <span className="border border-[#DED7CA] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#817B70]">
                                                {rule.replyType || "comment"}
                                            </span>
                                        </div>

                                        {rule.publicReplyText && (
                                            <div>
                                                <p className="mb-1 text-[10px] uppercase tracking-wider text-[#A39C90]">
                                                    Public reply
                                                </p>

                                                <p className="break-words text-sm leading-6 text-[#686257]">
                                                    {rule.publicReplyText}
                                                </p>
                                            </div>
                                        )}

                                        {rule.dmReplyText && (
                                            <div>
                                                <p className="mb-1 text-[10px] uppercase tracking-wider text-[#A39C90]">
                                                    Private DM
                                                </p>

                                                <p className="break-words text-sm leading-6 text-[#686257]">
                                                    {rule.dmReplyText}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteRule(idx)}
                                        aria-label={`Delete rule for ${rule.keyword}`}
                                        className="flex size-9 shrink-0 items-center justify-center border border-[#DED7CA] text-[#A39C90] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <TrashIcon className="size-4" />
                                    </button>
                                </div>
                            ))}

                            {rules.length === 0 && (
                                <div className="border border-dashed border-[#DED7CA] px-6 py-12 text-center">
                                    <div className="mx-auto mb-4 flex size-11 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                                        <MessageSquareReplyIcon className="size-5" />
                                    </div>

                                    <p className="text-sm text-[#686257]">
                                        No keyword rules yet
                                    </p>

                                    <p className="mt-2 text-xs text-[#A39C90]">
                                        Add your first rule using the form above.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* AI Mode */}
                {mode === "ai" && (
                    <div className="space-y-5 border-t border-[#DED7CA] pt-6">
                        <div className="flex items-center gap-3">
                            <Settings2Icon className="size-4 text-[#B97960]" />

                            <h3 className="font-serif text-lg text-[#292720]">
                                System Instructions & Tone
                            </h3>
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-[#887E6F]">
                                AI response instructions
                            </label>

                            <textarea
                                rows={5}
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Instruct the AI on tone, guidelines, and what information to provide..."
                                className="w-full resize-none border border-[#DED7CA] bg-white px-4 py-4 text-sm leading-7 text-[#292720] outline-none placeholder:text-[#A39C90] focus:border-[#B97960]"
                            />
                        </div>

                        <label className="flex cursor-pointer items-start gap-3 border border-[#DED7CA] bg-white p-4 text-sm text-[#686257]">
                            <input
                                type="checkbox"
                                checked={enableDmFollowUp}
                                onChange={(event) =>
                                    setEnableDmFollowUp(event.target.checked)
                                }
                                className="mt-0.5 size-4 accent-[#B97960]"
                            />

                            <span>
                                <span className="block text-sm text-[#292720]">
                                    Enable private DM follow-up
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-[#817B70]">
                                    Send a private Instagram message after
                                    replying publicly.
                                </span>
                            </span>
                        </label>
                    </div>
                )}
            </section>

            {/* Save Action */}
            <div className="flex flex-col items-start justify-between gap-4 border-t border-[#DED7CA] pt-6 sm:flex-row sm:items-center">
                <p className="text-xs leading-5 text-[#A39C90]">
                    Remember to save your changes to apply your configuration.
                </p>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading || !accountId}
                    className="flex w-full items-center justify-center gap-2 bg-[#292720] px-7 py-3.5 text-xs font-medium tracking-wide text-white transition-colors duration-300 hover:bg-[#B97960] disabled:cursor-not-allowed disabled:opacity-100 sm:w-auto"
                >
                    {loading ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <SaveIcon className="size-4" />
                            Save Configuration
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AutoReply;
