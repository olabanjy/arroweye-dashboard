"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-session";
import { createDropzone, getCampaignOptions } from "@/services";
import type { CampaignOption } from "@/app/(dashboard)/schedule/hooks/use-campaign-combobox";

export const dropTypes = [
  { value: "GoogleDrive", label: "Google Drive" },
  { value: "WeTransfer", label: "WeTransfer" },
  { value: "OneDrive", label: "OneDrive" },
  { value: "DropBox", label: "Dropbox" },
  { value: "PCloud", label: "pCloud" },
];

const emptyForm = {
  firstName: "",
  lastName: "",
  folderName: "",
  link: "",
  dropType: "",
  campaign: "",
};

export type DropzoneUploadForm = typeof emptyForm;

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

interface UseDropzoneUploadOptions {
  open: boolean;
  /** Fixed campaign; when omitted the user picks one. */
  projectId?: number | string;
  onUploaded: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useDropzoneUpload = ({
  open,
  projectId,
  onUploaded,
  onOpenChange,
}: UseDropzoneUploadOptions) => {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [isUploading, setIsUploading] = useState(false);
  const needsCampaign = !projectId;

  const { data: campaignOptionsData = [] } = useQuery({
    queryKey: ["campaigns", "options"],
    queryFn: getCampaignOptions,
    enabled: open && needsCampaign,
  });

  const campaignOptions = useMemo<CampaignOption[]>(
    () =>
      (Array.isArray(campaignOptionsData) ? campaignOptionsData : [])
        .filter((campaign) => Boolean(campaign?.pin || campaign?.code))
        .map((campaign) => ({
          value: (campaign.pin || campaign.code)!,
          label: campaign.title,
          id: campaign.id,
          pin: campaign.pin,
          code: campaign.code,
        })),
    [campaignOptionsData],
  );

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

  const setField = (name: keyof DropzoneUploadForm, value: string) =>
    setFormData((current) => ({ ...current, [name]: value }));

  const setLink = (link: string) =>
    setFormData((current) => ({
      ...current,
      link,
      dropType: detectDropType(link) || current.dropType,
    }));

  const resolveProjectId = () => {
    if (projectId) return String(projectId);
    const campaign = campaignOptions.find(
      (option) => option.value === formData.campaign,
    );
    return campaign?.id ? String(campaign.id) : "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploading) return;

    const targetProjectId = resolveProjectId();
    const payload = {
      folder_name: formData.folderName.trim(),
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      link: formData.link.trim(),
      drop_type: formData.dropType,
    };

    if (!targetProjectId || Object.values(payload).some((value) => !value)) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsUploading(true);

    try {
      const response = await createDropzone(targetProjectId, payload);

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

  return {
    formData,
    setField,
    setLink,
    isUploading,
    needsCampaign,
    campaignOptions,
    handleSubmit,
  };
};
