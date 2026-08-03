import React, { useState } from "react";
import { ExportModal } from "./export-modal";
import { SendReportModal } from "./send-report-modal";
import { sendProjectEmail } from "@/services";

interface BottomDockProps {
  contentId?: number | string;
  handleDownloadData?: () => void;
  handleDownloadPage?: () => void;
}

export function BottomDock({
  contentId,
  handleDownloadData,
  handleDownloadPage,
}: BottomDockProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [shareButtonText, setShareButtonText] = useState("Share");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (contentId && email) {
      setIsSending(true);
      const currentUrl =
        typeof window !== "undefined" ? window.location.href : "";
      try {
        const res = await sendProjectEmail(contentId, { email, url: currentUrl });
        if (res) {
          setEmail(""); // clear input only
        }
      } catch (error) {
        console.error("Error sending email:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareButtonText("Copied");
      setTimeout(() => {
        setShareButtonText("Share");
      }, 3000);
    }
  };

  return (
    <>
      <div className="fixed bottom-7.5 lg:left-32 right-0 flex justify-center z-30 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-background/95 backdrop-blur border border-border rounded-[8px] p-2 flex items-center gap-2.5 shadow-lg">
          <button
            type="button"
            className="rounded-[6px] px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 w-[75px] text-center text-sm font-medium transition-all active:scale-[0.97] cursor-pointer"
            onClick={() => setExportModalOpen(true)}
          >
            Export
          </button>
          <button
            type="button"
            className="rounded-[6px] px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white w-[75px] text-center text-sm font-medium transition-all active:scale-[0.97] cursor-pointer"
            onClick={() => setSendModalOpen(!sendModalOpen)}
          >
            Send
          </button>
          <button
            type="button"
            className="rounded-[6px] border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-zinc-950 bg-white hover:bg-zinc-50 dark:text-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 w-[75px] text-center text-sm font-medium transition-all active:scale-[0.97] cursor-pointer"
            onClick={handleShareClick}
          >
            {shareButtonText}
          </button>
        </div>
      </div>

      <SendReportModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        email={email}
        onEmailChange={setEmail}
        onSend={handleSendEmail}
        loading={isSending}
      />

      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExportCSV={handleDownloadData}
        onExportPDF={handleDownloadPage}
      />
    </>
  );
}
