"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Clock, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import {
  RESCHEDULE_REASON_MAX_LENGTH,
  type FormErrors,
} from "@/hooks/use-schedule";
import type { EventDialogState } from "../hooks/use-event-dialog";
import EventHeader from "./event-header";
import {
  CountedTextarea,
  EventDateTimeFields,
  FieldError,
} from "./event-fields";

type FormChangeEvent = { target: { name: string; value: string } };

interface EventRescheduleViewProps {
  dialog: EventDialogState;
  formData: Record<string, any>;
  formErrors: FormErrors;
  onFormChange: (e: FormChangeEvent) => void;
  onClose: () => void;
  onReschedule: () => void;
}

const CurrentDetail = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex min-w-0 items-start gap-3">
    <Icon className="mt-0.5 size-[18px] shrink-0 text-zinc-500 dark:text-zinc-400" />
    <div className="min-w-0">
      <p className="text-[12px] text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-0.5 break-words text-[14px] text-zinc-950 dark:text-zinc-100">
        {value || "—"}
      </p>
    </div>
  </div>
);

const EventRescheduleView = ({
  dialog,
  formData,
  formErrors,
  onFormChange,
  onClose,
  onReschedule,
}: EventRescheduleViewProps) => (
  <div className="space-y-3.5">
    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
      <span />
      <DialogTitle className="text-[16px] font-semibold">
        Reschedule
      </DialogTitle>
      <button
        type="button"
        onClick={onClose}
        className="flex size-8 items-center justify-center justify-self-end rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>

    <EventHeader
      title={formData.title}
      description={formData.description}
      calendarEventId={formData.calendarEventId}
    />

    <div className="space-y-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
      <div className="grid gap-4 sm:grid-cols-2 sm:divide-x sm:divide-zinc-200 dark:sm:divide-zinc-700">
        <CurrentDetail
          icon={CalendarDays}
          label="Current date"
          value={dialog.originalDateLabel}
        />
        <div className="sm:pl-4">
          <CurrentDetail
            icon={Clock}
            label="Current time"
            value={dialog.originalTimeLabel}
          />
        </div>
      </div>
      {formData.location && (
        <CurrentDetail
          icon={MapPin}
          label="Location"
          value={formData.location}
        />
      )}
    </div>

    <div className="border-t border-zinc-200 dark:border-zinc-700" />

    <EventDateTimeFields
      fullWidthDate
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

    <CountedTextarea
      id="event-reschedule-reason"
      name="reason"
      label="Reason (optional)"
      value={formData.reason}
      maxLength={RESCHEDULE_REASON_MAX_LENGTH}
      placeholder="Add a reason..."
      error={formErrors.reason}
      onChange={onFormChange}
    />

    <FieldError message={formErrors.code} />

    <div className="grid grid-cols-2 gap-3 pt-1">
      <Button
        type="button"
        variant="ghost"
        className="h-10 rounded-xl bg-zinc-100 text-[14px] text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
        onClick={dialog.cancelReschedule}
      >
        Cancel
      </Button>
      <Button
        type="button"
        className="h-10 rounded-xl bg-[#5300d7] text-[14px] text-white hover:bg-[#4700b8]"
        onClick={onReschedule}
      >
        Request Reschedule
      </Button>
    </div>
  </div>
);

export default EventRescheduleView;
