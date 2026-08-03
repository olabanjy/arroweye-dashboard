import React from "react";
import { VscSend } from "react-icons/vsc";
import { Loader2 } from "lucide-react";

interface SendReportModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onEmailChange: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
}

export function SendReportModal({
  open,
  onClose,
  email,
  onEmailChange,
  onSend,
  loading = false,
}: SendReportModalProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-[90px] lg:left-32 right-0 flex justify-center z-30 w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-[8px] shadow-2xl p-6 max-w-[500px] w-full relative">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <span className="text-[12px] font-[500] uppercase tracking-[.1rem] text-zinc-500 dark:text-zinc-400">
            Send Report
          </span>
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 text-2xl leading-none"
            onClick={onClose}
            aria-label="Close panel"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        <div className="relative flex items-center w-full mt-4">
          <input
            type="email"
            placeholder="hello@arroweye.pro"
            className="h-11 w-full rounded-[6px] border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 pl-4 pr-12 text-[14px] text-zinc-950 dark:text-zinc-100 shadow-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25 outline-none font-SansFlex transition-all disabled:opacity-75"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-1 mx-1.5 flex h-8 w-8 items-center justify-center rounded-[4px] bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.95] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 disabled:opacity-75 disabled:pointer-events-none"
            onClick={onSend}
            disabled={loading}
            aria-label="Send email"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              <VscSend size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
