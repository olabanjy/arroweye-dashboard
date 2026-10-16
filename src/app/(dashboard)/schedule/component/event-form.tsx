"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EVENT_DESCRIPTION_MAX_LENGTH,
  type FormErrors,
} from "@/hooks/use-schedule";
import type { EventDialogState } from "../hooks/use-event-dialog";
import { EVENT_STATUS_OPTIONS } from "../utils/event-status";
import AutocompleteInput from "./Autocomplete";
import {
  ClearButton,
  CountedTextarea,
  EventDateTimeFields,
  FieldLabel,
  eventFieldClassName,
  iconClassName,
  inputSlotClassName,
  triggerClassName,
} from "./event-fields";
import { FieldSelect, type SelectOption } from "./field-select";
import CampaignCombobox from "./campaign-combobox";
import {
  AddAttachmentButton,
  AttachmentList,
  formatFileSize,
} from "./event-attachments";
import type { CampaignOption } from "../hooks/use-campaign-combobox";

type FormChangeEvent = { target: { name: string; value: string } };

export interface EventFormProps {
  dialog: EventDialogState;
  formData: Record<string, any>;
  formErrors: FormErrors;
  vendorOptions: SelectOption[];
  subvendorOptions: SelectOption[];
  campaignOptions: CampaignOption[];
  onCancel: () => void;
  onFormChange: (e: FormChangeEvent) => void;
  onSelectChange: (change: { name: string; value: string }) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  pendingAttachments?: File[];
  onPendingAttachmentsChange?: (files: File[]) => void;
}

const fileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

const EventForm = ({
  dialog,
  formData,
  formErrors,
  vendorOptions,
  subvendorOptions,
  campaignOptions,
  onCancel,
  onFormChange,
  onSelectChange,
  onSubmit,
  isSubmitting,
  mode = "create",
  pendingAttachments = [],
  onPendingAttachmentsChange,
}: EventFormProps) => {
  const isEdit = mode === "edit";
  const clearField = (name: string) =>
    onFormChange({ target: { name, value: "" } });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          className="h-8 justify-self-start rounded-lg bg-zinc-100 px-3.5 text-[14px] text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <DialogTitle className="text-[16px] font-semibold">
          {isEdit ? "Edit Event" : "New Event"}
        </DialogTitle>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-8 justify-self-end rounded-lg bg-[#5300d7] px-4 text-[14px] text-white hover:bg-[#4700b8]"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>

      <div>
        <FieldLabel htmlFor="event-title">Event name</FieldLabel>
        <div className="relative">
          <AutocompleteInput
            name="title"
            placeholder="Event name"
            value={formData.title}
            onChange={onFormChange}
            error={formErrors.title}
            className={cn(eventFieldClassName, "!pr-9")}
          />
          {formData.title && (
            <ClearButton
              label="event name"
              onClear={() => clearField("title")}
            />
          )}
        </div>
      </div>

      {!isEdit && (
        <EventDateTimeFields
          dateLabel={dialog.dateLabel}
          selectedDate={dialog.selectedDate}
          isDatePickerOpen={dialog.isDatePickerOpen}
          onDatePickerOpenChange={dialog.setIsDatePickerOpen}
          onDateSelect={dialog.handleDateSelect}
          startTime={dialog.startTime}
          endTime={dialog.endTime}
          startTimeOptions={dialog.startTimeOptions}
          endTimeOptions={dialog.endTimeOptions}
          onStartTimeChange={dialog.handleStartTimeChange}
          onEndTimeChange={dialog.handleEndTimeChange}
          dateError={formErrors.start_dte}
          endError={formErrors.end_dte}
        />
      )}

      <div>
        <FieldLabel htmlFor="event-location">Location</FieldLabel>
        <div className="relative">
          <span
            className={cn(
              inputSlotClassName,
              "pointer-events-none left-3 z-10",
            )}
          >
            <MapPin className={iconClassName} />
          </span>
          <Input
            id="event-location"
            name="location"
            value={formData.location}
            onChange={onFormChange}
            placeholder="Venue, or link for virtual meetings"
            error={formErrors.location}
            className={cn(eventFieldClassName, "!pl-9 !pr-9")}
          />
          {formData.location && (
            <ClearButton
              label="location"
              onClear={() => clearField("location")}
            />
          )}
        </div>
      </div>

      <CountedTextarea
        id="event-description"
        name="description"
        label="Description"
        value={formData.description}
        maxLength={EVENT_DESCRIPTION_MAX_LENGTH}
        placeholder="Add details for attendees"
        error={formErrors.description}
        onChange={onFormChange}
      />

      <div>
        <FieldLabel htmlFor="event-status">Status</FieldLabel>
        <Select
          value={formData.status}
          onValueChange={(value) => onSelectChange({ name: "status", value })}
        >
          <SelectTrigger
            id="event-status"
            className={cn(triggerClassName, "justify-between")}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-3">
                  <span
                    className={cn("size-3 rounded-full", option.dotClassName)}
                  />
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isEdit && (
        <div className="border-t border-zinc-200 pt-3.5 dark:border-zinc-700">
          <FieldLabel>Campaign &amp; vendor</FieldLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <CampaignCombobox
                options={campaignOptions}
                value={formData.code}
                onChange={(value) => onSelectChange({ name: "code", value })}
                error={formErrors.code}
              />
            </div>
            <FieldSelect
              value={formData.vendor_id}
              onChange={(value) => onSelectChange({ name: "vendor_id", value })}
              options={vendorOptions}
              placeholder="Select Vendor"
              error={formErrors.vendor_id}
            />
            <FieldSelect
              value={formData.subvendor_id}
              onChange={(value) =>
                onSelectChange({ name: "subvendor_id", value })
              }
              options={subvendorOptions}
              placeholder="Select Subvendor"
              error={formErrors.subvendor_id}
            />
          </div>
        </div>
      )}

      {!isEdit && onPendingAttachmentsChange && (
        <div className="border-t border-zinc-200 pt-3.5 dark:border-zinc-700">
          <FieldLabel>Attachments (optional)</FieldLabel>
          <div className="space-y-2">
            <AttachmentList
              items={pendingAttachments.map((file) => ({
                key: fileKey(file),
                name: file.name,
                meta: formatFileSize(file.size),
              }))}
              onRemove={(key) =>
                onPendingAttachmentsChange(
                  pendingAttachments.filter((file) => fileKey(file) !== key),
                )
              }
            />
            <AddAttachmentButton
              onFiles={(files) => {
                const existing = new Set(pendingAttachments.map(fileKey));
                onPendingAttachmentsChange([
                  ...pendingAttachments,
                  ...files.filter((file) => !existing.has(fileKey(file))),
                ]);
              }}
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default EventForm;
