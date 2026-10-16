"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  formatDateLabel,
  formatTimeRange,
  getTimeOptions,
  joinDateTime,
  parseDateKey,
  splitDateTime,
  toDateKey,
} from "../utils/event-date-time";

type FormChangeHandler = (e: {
  target: { name: string; value: string };
}) => void;

interface UseEventDialogOptions {
  open: boolean;
  startDateTime?: string;
  endDateTime?: string;
  onFormChange: FormChangeHandler;
}

export const useEventDialog = ({
  open,
  startDateTime,
  endDateTime,
  onFormChange,
}: UseEventDialogOptions) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [originalSchedule, setOriginalSchedule] = useState({
    start: "",
    end: "",
  });

  // The dialog can also be closed programmatically (e.g. after saving), so reset on any close.
  useEffect(() => {
    if (open) return;
    setIsDatePickerOpen(false);
    setIsRescheduling(false);
  }, [open]);

  const start = splitDateTime(startDateTime);
  const end = splitDateTime(endDateTime);
  const dateKey = start.date;

  const emit = (name: string, value: string) =>
    onFormChange({ target: { name, value } });

  // The design has a single date, so start and end always share it.
  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    const nextDateKey = toDateKey(date);
    emit(
      "start_dte",
      joinDateTime(nextDateKey, start.time || DEFAULT_START_TIME),
    );
    emit("end_dte", joinDateTime(nextDateKey, end.time || DEFAULT_END_TIME));
    setIsDatePickerOpen(false);
  };

  const resolveDateKey = () => dateKey || toDateKey(new Date());

  const handleStartTimeChange = (time: string) =>
    emit("start_dte", joinDateTime(resolveDateKey(), time));

  const handleEndTimeChange = (time: string) =>
    emit("end_dte", joinDateTime(resolveDateKey(), time));

  const startReschedule = () => {
    setOriginalSchedule({ start: startDateTime ?? "", end: endDateTime ?? "" });
    setIsRescheduling(true);
  };

  const cancelReschedule = () => {
    emit("start_dte", originalSchedule.start);
    emit("end_dte", originalSchedule.end);
    emit("reason", "");
    setIsRescheduling(false);
  };

  return {
    selectedDate: parseDateKey(dateKey),
    dateLabel: formatDateLabel(dateKey),
    startTime: start.time,
    endTime: end.time,
    startTimeOptions: getTimeOptions(start.time),
    endTimeOptions: getTimeOptions(end.time),
    isDatePickerOpen,
    setIsDatePickerOpen,
    isRescheduling,
    originalDateLabel: formatDateLabel(
      splitDateTime(originalSchedule.start).date,
    ),
    originalTimeLabel: formatTimeRange(
      originalSchedule.start,
      originalSchedule.end,
    ),
    startReschedule,
    cancelReschedule,
    handleDateSelect,
    handleStartTimeChange,
    handleEndTimeChange,
  };
};

export type EventDialogState = ReturnType<typeof useEventDialog>;
