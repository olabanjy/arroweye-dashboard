"use client";

import React, { useCallback } from "react";
import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { toast } from "react-toastify";
import { useSchedule } from "@/hooks/use-schedule";
import ScheduleEventBadge from "../component/schedule-event-badge";

interface UseScheduleCalendarOptions {
  isSchedulePage?: boolean;
  isDateClickEnabled?: boolean;
}

export const useScheduleCalendar = ({
  isSchedulePage = false,
  isDateClickEnabled = false,
}: UseScheduleCalendarOptions) => {
  const schedule = useSchedule({
    isSchedulePage,
    isDateClickEnabled,
  });

  const toDateInputValue = useCallback(
    (date?: Date | string | null): string => {
      if (!date) return "";

      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      return date;
    },
    [],
  );

  const handleCalendarEventClick = useCallback(
    (info: EventClickArg) => {
      const { event } = info;
      const extendedProps = event.extendedProps;

      schedule.setFormErrors({});
      schedule.setProjectPin(extendedProps?.code ?? "");
      schedule.setFormData({
        id: event.id?.split("-")[0],
        calendarEventId: event.id,
        title: event.title,
        vendor_id: extendedProps?.vendor,
        subvendor_id: extendedProps?.subvendor,
        location: extendedProps?.location,
        start_dte: toDateInputValue(event.start),
        end_dte: toDateInputValue(extendedProps?.end_date),
        code: extendedProps?.code ?? "",
        project: extendedProps?.project,
        description: extendedProps?.description ?? "",
        status: extendedProps?.status ?? "confirmed",
      });
      schedule.setViewOnly(true);
      schedule.setIsModalVisible(true);
    },
    [schedule, toDateInputValue],
  );

  const renderEventContent = useCallback(
    (eventInfo: EventContentArg) => (
      <ScheduleEventBadge
        title={eventInfo.event.title}
        start={eventInfo.event.start}
        eventId={eventInfo.event.id}
        isAllDay={eventInfo.event.allDay}
        viewType={eventInfo.view.type}
      />
    ),
    [],
  );

  const { formData } = schedule;

  const canDeleteEvent = Boolean(
    formData.start_dte &&
    new Date(formData.start_dte) >= new Date(new Date().setHours(0, 0, 0, 0)),
  );

  const eventCampaign = schedule.campaignOptions.find(
    (option) =>
      (formData.project && String(option.id) === String(formData.project)) ||
      (formData.code &&
        (option.pin === formData.code || option.code === formData.code)),
  );

  const requestDeleteEvent = () => {
    schedule.setScheduleIdToBeDeleted(formData);
    schedule.setDeleteDialog(true);
  };

  const openEventProject = () => {
    if (!formData.project) {
      toast.info("No project code");
      return;
    }
    window.open(`/campaigns/${formData.project}`);
  };

  return {
    ...schedule,
    canDeleteEvent,
    eventCampaignTitle: eventCampaign?.label,
    requestDeleteEvent,
    openEventProject,
    handleCalendarEventClick,
    renderEventContent,
  };
};

export default useScheduleCalendar;
