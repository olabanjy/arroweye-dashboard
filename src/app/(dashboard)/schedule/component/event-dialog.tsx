"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import type { FormErrors } from "@/hooks/use-schedule";
import { useEventDialog } from "../hooks/use-event-dialog";
import EventDetailsCard, {
  type EventDetailsActions,
} from "./event-details-card";
import EventForm, { type EventFormProps } from "./event-form";
import EventRescheduleView from "./event-reschedule-view";

interface EventDialogProps
  extends Omit<EventFormProps, "dialog" | "onCancel">, EventDetailsActions {
  onReschedule: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewOnly: boolean;
  formErrors: FormErrors;
}

const EventDialog = ({
  open,
  onOpenChange,
  viewOnly,
  formData,
  formErrors,
  vendorOptions,
  subvendorOptions,
  campaignOptions,
  onFormChange,
  onSelectChange,
  onSubmit,
  onReschedule,
  ...detailsActions
}: EventDialogProps) => {
  const dialog = useEventDialog({
    open,
    startDateTime: formData.start_dte,
    endDateTime: formData.end_dte,
    formErrors,
    onFormChange,
  });

  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-lg"
      >
        <DialogDescription className="sr-only">
          {viewOnly
            ? "View, share, delete, or reschedule this event."
            : "Create a calendar event."}
        </DialogDescription>

        {viewOnly && dialog.isRescheduling ? (
          <EventRescheduleView
            dialog={dialog}
            formData={formData}
            formErrors={formErrors}
            onFormChange={onFormChange}
            onClose={close}
            onReschedule={onReschedule}
          />
        ) : viewOnly ? (
          <EventDetailsCard
            dialog={dialog}
            formData={formData}
            onClose={close}
            {...detailsActions}
          />
        ) : (
          <EventForm
            dialog={dialog}
            formData={formData}
            formErrors={formErrors}
            vendorOptions={vendorOptions}
            subvendorOptions={subvendorOptions}
            campaignOptions={campaignOptions}
            onCancel={close}
            onFormChange={onFormChange}
            onSelectChange={onSelectChange}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
