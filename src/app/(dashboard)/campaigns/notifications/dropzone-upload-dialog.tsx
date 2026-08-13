"use client";

import { mdiCloudUploadOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { useAuth } from "@/context/auth-session";
import { createDropzone } from "@/services";

interface DropzoneUploadDialogProps {
  open: boolean;
  projectId: number | string;
  onOpenChange: (open: boolean) => void;
  onUploaded: () => void;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  folderName: "",
  link: "",
  dropType: "",
};

const dropTypes = [
  { value: "GoogleDrive", label: "Google Drive" },
  { value: "WeTransfer", label: "WeTransfer" },
  { value: "OneDrive", label: "OneDrive" },
  { value: "DropBox", label: "Dropbox" },
  { value: "PCloud", label: "pCloud" },
];

const detectDropType = (link: string) => {
  const normalizedLink = link.toLowerCase();

  if (normalizedLink.includes("drive.google.com")) return "GoogleDrive";
  if (normalizedLink.includes("wetransfer.com")) return "WeTransfer";
  if (
    normalizedLink.includes("onedrive.live.com") ||
    normalizedLink.includes("1drv.ms")
  ) {
    return "OneDrive";
  }
  if (normalizedLink.includes("dropbox.com")) return "DropBox";
  if (normalizedLink.includes("pcloud.com")) return "PCloud";

  return "";
};

export function DropzoneUploadDialog({
  open,
  projectId,
  onOpenChange,
  onUploaded,
}: DropzoneUploadDialogProps) {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const [firstName = "", ...lastNameParts] =
      userProfile?.fullname?.trim().split(/\s+/) ?? [];

    setFormData({
      ...emptyForm,
      firstName,
      lastName: lastNameParts.join(" "),
    });
  }, [open, userProfile?.fullname]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      folder_name: formData.folderName.trim(),
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      link: formData.link.trim(),
      drop_type: formData.dropType,
    };

    if (Object.values(payload).some((value) => !value)) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsUploading(true);

    try {
      const response = await createDropzone(String(projectId), payload);

      if (!response) {
        toast.error("The drop could not be uploaded.");
        return;
      }

      toast.success("Drop uploaded.");
      onUploaded();
      onOpenChange(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Upload drop
          </DialogTitle>
          <DialogDescription>
            Add a shared asset link to this campaign.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              disabled={isUploading}
            />
            <Input
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              disabled={isUploading}
            />
          </div>

          <Input
            name="folderName"
            placeholder="Folder name"
            value={formData.folderName}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                folderName: event.target.value,
              }))
            }
            disabled={isUploading}
          />

          <Input
            name="link"
            type="url"
            placeholder="Shared folder link"
            value={formData.link}
            onChange={(event) => {
              const link = event.target.value;
              const detectedDropType = detectDropType(link);

              setFormData((current) => ({
                ...current,
                link,
                dropType: detectedDropType || current.dropType,
              }));
            }}
            disabled={isUploading}
          />

          <Select
            value={formData.dropType || undefined}
            onValueChange={(dropType) =>
              setFormData((current) => ({ ...current, dropType }))
            }
            disabled={isUploading}
          >
            <SelectTrigger className="h-[50px] rounded-[8px] border-black bg-white dark:border-gray-700 dark:bg-gray-900">
              <SelectValue placeholder="Drop type" />
            </SelectTrigger>
            <SelectContent>
              {dropTypes.map((dropType) => (
                <SelectItem key={dropType.value} value={dropType.value}>
                  {dropType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="h-10 w-full gap-2 rounded-full bg-zinc-950 text-white hover:bg-orange-500 dark:bg-zinc-100 dark:text-zinc-950"
            disabled={isUploading}
          >
            {isUploading ? "Uploading…" : "Upload drop"}
            {!isUploading && <Icon path={mdiCloudUploadOutline} size={0.75} />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
