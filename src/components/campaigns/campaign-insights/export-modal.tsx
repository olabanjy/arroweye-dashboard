import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileSpreadsheet, FileText } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

export function ExportModal({
  open,
  onOpenChange,
  onExportCSV,
  onExportPDF,
}: ExportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.1rem] text-zinc-500 dark:text-zinc-400">
            Export Report
          </DialogTitle>
          <DialogDescription className="sr-only">
            Select your preferred export format for the campaign insights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Select your preferred format
          </p>

          <div className="grid grid-cols-1 gap-4 pb-2">
            {/* 
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 p-6 transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25 cursor-pointer"
              onClick={() => {
                if (onExportPDF) onExportPDF();
                onOpenChange(false);
              }}
            >
              <FileText className="size-8 text-rose-600 dark:text-rose-400" />
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Download PDF
              </span>
            </button>
            */}

            <button
              type="button"
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 p-8 transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25 cursor-pointer"
              onClick={() => {
                if (onExportCSV) onExportCSV();
                onOpenChange(false);
              }}
            >
              <FileSpreadsheet className="size-10 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Download CSV
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
