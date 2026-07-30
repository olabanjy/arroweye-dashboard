"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { ArrowUpRight, CalendarPlus, Info } from "lucide-react";
import { toast } from "react-toastify";
import { useSchedule } from "@/hooks/use-schedule";
import { cn, hasAccessNoVendor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AutocompleteInput from "./Autocomplete";

type SelectOption = {
  label: string;
  value: string | number;
};

const fieldClassName =
  "!h-11 !rounded-lg !border-zinc-300 !bg-white !text-[14px] !text-zinc-950 !shadow-none placeholder:!text-zinc-400 focus-visible:!ring-2 focus-visible:!ring-violet-500/25 dark:!border-zinc-600 dark:!bg-zinc-800 dark:!text-zinc-100 dark:placeholder:!text-zinc-400";

interface ScheduleProps {
  filterIcon?: boolean;
  isDateClickEnabled?: boolean;
  isSchedulePage?: boolean;
}

const FieldSelect = ({
  options,
  value,
  onChange,
  placeholder,
  error,
}: {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) => (
  <div className="space-y-2 font-SansFlex">
    <Select
      value={value !== undefined && value !== null ? String(value) : ""}
      onValueChange={onChange}
    >
      <SelectTrigger
        className={cn(
          "h-11 rounded-lg border-zinc-300 bg-white px-4 text-[14px] text-zinc-950 shadow-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 [&>span]:line-clamp-1",
          error && "border-red-500 focus:ring-red-500",
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="overflow-hidden rounded-[8px] border-zinc-200 bg-white p-1 text-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 [&_[data-radix-select-viewport]]:rounded-[6px]">
        {options.map((option) => (
          <SelectItem
            key={`${placeholder}-${option.value}`}
            value={String(option.value)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const InfoTooltip = ({ info }: { info: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
      >
        <Info />
        <span className="sr-only">More information</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right" className="max-w-60">
      {info}
    </TooltipContent>
  </Tooltip>
);

const Schedule: React.FC<ScheduleProps> = ({
  filterIcon = true,
  isDateClickEnabled = false,
  isSchedulePage = false,
}) => {
  const {
    userLoggedInProfile,
    isModalVisible,
    setIsModalVisible,
    viewOnly,
    setViewOnly,
    filter,
    setisFilter,
    deleteDialog,
    setDeleteDialog,
    setScheduleIdToBeDeleted,
    deleteLoading,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    projectPin,
    setProjectPin,
    pinEntered,
    setPinEntered,
    pinError,
    setPinError,
    vendorOptions,
    subvendorOptions,
    events,
    exportICS,
    handleDelete,
    handleDateClick,
    handleCloseModal,
    handleFormChange,
    handleSelectChange,
    handleFormSubmit,
    rescheduleEvent,
  } = useSchedule({
    isSchedulePage,
    isDateClickEnabled,
  });

  const getOptionLabel = (options: SelectOption[], value?: string | number) => {
    if (value === undefined || value === null) return "";

    return (
      options.find((option) => String(option.value) === String(value))?.label ??
      ""
    );
  };

  const toDateInputValue = (date?: Date | string | null) => {
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
  };

  const handleEventClick = (info: any) => {
    const { event } = info;
    const extendedProps = event.extendedProps;

    setFormErrors({});
    setProjectPin(extendedProps?.code ?? "");
    setFormData({
      id: event.id?.split("-")[0],
      title: event.title,
      vendor_id: extendedProps?.vendor,
      subvendor_id: extendedProps?.subvendor,
      location: extendedProps?.location,
      start_dte: toDateInputValue(event.start),
      end_dte: toDateInputValue(extendedProps?.end_date),
      code: "",
      project: extendedProps?.project,
    });
    setViewOnly(true);
    setIsModalVisible(true);
  };

  return (
    <div>
      <div className="schedule-container mb-[100px] space-y-[20px]">
        {filterIcon && (
          <div className="mb-[30px] flex items-center justify-center gap-[5px]">
            {userLoggedInProfile?.role !== "Manager" && (
              <Button
                type="button"
                size="icon-lg"
                className="h-12 w-12 rounded-full bg-[#5d00e4] text-white hover:bg-[#4d00bc]"
                onClick={() => setIsModalVisible(true)}
              >
                <CalendarPlus />
                <span className="sr-only">Add event</span>
              </Button>
            )}
          </div>
        )}
        <div className="calendar-container">
          <style>
            {`
            .fc .fc-toolbar-title {
              text-transform: capitalize !important;
              font-size:16px;
              font-weight:bold;
            }
            .fc .fc-button {
              text-transform: capitalize !important;
            }
            .fc .fc-toolbar-chunk {
              text-transform: capitalize !important;
            }
            .fc .fc-today-button {
              text-transform: capitalize !important;
            }
          `}
          </style>
          <div className="sm:hidden">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              editable={true}
              droppable={true}
            />
          </div>
          <div className="hidden sm:block">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              editable={true}
              droppable={true}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={isModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseModal();
          } else {
            setIsModalVisible(true);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-[780px]">
          <DialogHeader>
            <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.16rem] text-zinc-500 dark:text-zinc-400">
              Event Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Create, view, share, delete, or reschedule a calendar event.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 text-foreground">
              <div className="grid items-start gap-4 md:grid-cols-2">
                <div className="w-full">
                  {viewOnly ? (
                    <Input
                      type="text"
                      name="title"
                      disabled
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Event Title"
                      className={fieldClassName}
                    />
                  ) : (
                    <AutocompleteInput
                      placeholder="Event Title"
                      name="title"
                      disabled={viewOnly}
                      value={formData.title}
                      onChange={handleFormChange}
                      error={formErrors.title}
                      className={fieldClassName}
                    />
                  )}
                </div>

                <div className="w-full">
                  {viewOnly ? (
                    <Input
                      type="text"
                      disabled
                      value={getOptionLabel(vendorOptions, formData.vendor_id)}
                      placeholder="Vendor"
                      className={fieldClassName}
                    />
                  ) : (
                    <FieldSelect
                      value={formData.vendor_id}
                      onChange={(value) =>
                        handleSelectChange({ name: "vendor_id", value })
                      }
                      options={vendorOptions}
                      placeholder="Select Vendor"
                      error={formErrors.vendor_id}
                    />
                  )}
                </div>

                <div className="w-full">
                  {viewOnly ? (
                    <Input
                      type="text"
                      disabled
                      value={getOptionLabel(
                        subvendorOptions,
                        formData.subvendor_id,
                      )}
                      placeholder="Subvendor"
                      className={fieldClassName}
                    />
                  ) : (
                    <FieldSelect
                      value={formData.subvendor_id}
                      onChange={(value) =>
                        handleSelectChange({ name: "subvendor_id", value })
                      }
                      options={subvendorOptions}
                      placeholder="Select Subvendor"
                      error={formErrors.subvendor_id}
                    />
                  )}
                </div>

                <div className="w-full">
                  <Input
                    type="text"
                    name="location"
                    disabled={viewOnly}
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="Location (or Link for virtual meetings)"
                    error={formErrors?.location}
                    className={fieldClassName}
                  />
                </div>

                <div className="w-full">
                  <Input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    placeholder="Enter Code"
                    error={formErrors.code}
                    className={fieldClassName}
                  />
                </div>

                <div className="w-full">
                  <Input
                    type="datetime-local"
                    name="start_dte"
                    value={formData.start_dte}
                    onChange={handleFormChange}
                    placeholder="Start Date & Time"
                    error={formErrors.start_dte}
                    className={fieldClassName}
                  />
                </div>

                <div className="w-full">
                  <Input
                    type="datetime-local"
                    name="end_dte"
                    value={formData.end_dte}
                    onChange={handleFormChange}
                    placeholder="End Date & Time"
                    error={formErrors.end_dte}
                    className={fieldClassName}
                  />
                </div>
              </div>

              <DialogFooter className="border-t border-zinc-200 pt-4 dark:border-zinc-700 sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {!viewOnly && (
                    <Button
                      className="h-9 rounded-full bg-[#5300d7] px-5 text-sm text-white hover:bg-[#4700b8]"
                      type="submit"
                    >
                      Schedule
                    </Button>
                  )}

                  {viewOnly &&
                    formData.start_dte &&
                    new Date(formData.start_dte) >=
                      new Date(new Date().setHours(0, 0, 0, 0)) && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="h-9 rounded-full bg-red-600 px-5 text-sm text-white hover:bg-red-700"
                        onClick={() => {
                          setScheduleIdToBeDeleted(formData);
                          setDeleteDialog(true);
                        }}
                      >
                        Delete
                      </Button>
                    )}

                  {viewOnly && (
                    <Button
                      type="button"
                      className="h-9 rounded-full bg-zinc-900 px-5 text-sm text-white hover:bg-orange-500 dark:bg-zinc-900 dark:text-white"
                      onClick={() => exportICS()}
                    >
                      Share
                    </Button>
                  )}

                  {viewOnly &&
                    hasAccessNoVendor(userLoggedInProfile, ["Manager"]) && (
                      <Button
                        type="button"
                        className="h-9 rounded-full bg-[#5300d7] px-5 text-sm text-white hover:bg-[#4700b8]"
                        onClick={() => rescheduleEvent()}
                      >
                        Reschedule
                      </Button>
                    )}
                </div>

                {viewOnly && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon-lg"
                        className="h-9 w-9 rounded-full bg-zinc-900 text-white hover:bg-orange-500 dark:bg-zinc-900 dark:text-white"
                        onClick={() => {
                          if (!formData.project) {
                            toast.info("No project code");
                          }
                          window.open(`/campaigns/${formData?.project}`);
                        }}
                      >
                        <ArrowUpRight />
                        <span className="sr-only">View project</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Project</TooltipContent>
                  </Tooltip>
                )}
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={filter} onOpenChange={(open) => setisFilter(open)}>
        <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.16rem] text-zinc-500 dark:text-zinc-400">
              Select Calendar
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose vendor and subvendor calendar filters.
            </DialogDescription>
          </DialogHeader>

          <form>
            <div className="space-y-4 text-foreground">
              <div className="grid items-center gap-[20px]">
                <div className="w-full">
                  <FieldSelect
                    value={formData.vendor_id}
                    onChange={(value) =>
                      handleSelectChange({ name: "vendor_id", value })
                    }
                    options={vendorOptions}
                    placeholder="Select Vendor"
                  />
                </div>

                <div className="w-full">
                  <FieldSelect
                    value={formData.subvendor_id}
                    onChange={(value) =>
                      handleSelectChange({ name: "subvendor_id", value })
                    }
                    options={subvendorOptions}
                    placeholder="Select Subvendor"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center text-center">
                <Button
                  className="h-9 w-full rounded-full bg-zinc-900 px-5 text-sm text-white hover:bg-orange-600 dark:bg-zinc-900 dark:text-white"
                  type="submit"
                >
                  Generate
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialog !== false}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog(false);
        }}
      >
        <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <InfoTooltip info="Delete the dropzone selected" />
              <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.16rem] text-zinc-500 dark:text-zinc-400">
                Delete Event
              </DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Confirm the project pin before deleting this event.
            </DialogDescription>
          </DialogHeader>

          <p>
            Please note that deleting the event "{formData.title}" is not
            refundable.
          </p>

          <Input
            type="password"
            name="projectPin"
            autoComplete="new-password"
            className={fieldClassName}
            placeholder="Enter Pin"
            value={pinEntered}
            error={pinError ? "Wrong password entered" : undefined}
            onChange={(e) => {
              const newPin = e.target.value;
              setPinEntered(newPin);
              if (newPin.length >= 6) {
                setPinError(newPin !== projectPin);
              } else {
                setPinError(false);
              }
            }}
          />

          <DialogFooter className="mt-5 flex-row justify-start">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-full"
              onClick={() => setDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pinEntered.length < 6 || pinError || deleteLoading}
              className="h-9 rounded-full bg-red-600 text-white hover:bg-red-700"
              onClick={() => handleDelete(Number(formData.id))}
            >
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
