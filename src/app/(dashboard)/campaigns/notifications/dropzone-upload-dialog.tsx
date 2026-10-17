"use client";

import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { dropTypes, useDropzoneUpload } from "@/hooks/use-dropzone-upload";
import CampaignCombobox from "@/app/(dashboard)/schedule/component/campaign-combobox";
import {
  FieldLabel,
  eventFieldClassName,
  iconClassName,
  inputSlotClassName,
  triggerClassName,
} from "@/app/(dashboard)/schedule/component/event-fields";

interface DropzoneUploadDialogProps {
  open: boolean;
  /** Omit to let the user choose the campaign. */
  projectId?: number | string;
  onOpenChange: (open: boolean) => void;
  onUploaded: () => void;
}

export function DropzoneUploadDialog({
  open,
  projectId,
  onOpenChange,
  onUploaded,
}: DropzoneUploadDialogProps) {
  const upload = useDropzoneUpload({
    open,
    projectId,
    onUploaded,
    onOpenChange,
  });
  const { formData, setField, isUploading } = upload;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-lg"
      >
        <DialogDescription className="sr-only">
          Add a shared asset link to a campaign.
        </DialogDescription>

        <form className="space-y-3.5" onSubmit={upload.handleSubmit}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-8 justify-self-start rounded-lg bg-zinc-100 px-3.5 text-[14px] text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <DialogTitle className="text-[16px] font-semibold">
              New Drop
            </DialogTitle>
            <Button
              type="submit"
              disabled={isUploading}
              className="h-8 justify-self-end rounded-lg bg-[#5300d7] px-4 text-[14px] text-white hover:bg-[#4700b8]"
            >
              {isUploading ? "Uploading…" : "Upload"}
            </Button>
          </div>

          {upload.needsCampaign && (
            <div>
              <FieldLabel>Campaign</FieldLabel>
              <CampaignCombobox
                options={upload.campaignOptions}
                value={formData.campaign}
                onChange={(value) => setField("campaign", value)}
              />
            </div>
          )}

          <div>
            <FieldLabel htmlFor="drop-folder-name">Folder name</FieldLabel>
            <Input
              id="drop-folder-name"
              placeholder="e.g. Single artwork & stems"
              value={formData.folderName}
              onChange={(event) => setField("folderName", event.target.value)}
              disabled={isUploading}
              className={eventFieldClassName}
            />
          </div>

          <div>
            <FieldLabel htmlFor="drop-link">Shared folder link</FieldLabel>
            <div className="relative">
              <span
                className={cn(
                  inputSlotClassName,
                  "pointer-events-none left-3 z-10",
                )}
              >
                <Link2 className={iconClassName} />
              </span>
              <Input
                id="drop-link"
                type="url"
                placeholder="Google Drive, WeTransfer, Dropbox…"
                value={formData.link}
                onChange={(event) => upload.setLink(event.target.value)}
                disabled={isUploading}
                className={cn(eventFieldClassName, "!pl-9")}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="drop-type">Drop type</FieldLabel>
            <Select
              value={formData.dropType || undefined}
              onValueChange={(dropType) => setField("dropType", dropType)}
              disabled={isUploading}
            >
              <SelectTrigger
                id="drop-type"
                className={cn(triggerClassName, "justify-between")}
              >
                <SelectValue placeholder="Select drop type" />
              </SelectTrigger>
              <SelectContent>
                {dropTypes.map((dropType) => (
                  <SelectItem key={dropType.value} value={dropType.value}>
                    {dropType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
