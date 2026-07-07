import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog } from "primereact/dialog";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { GoArrowUpRight } from "react-icons/go";
import { PiCalendarPlus } from "react-icons/pi";
import { IoFilter } from "react-icons/io5";
import { useRouter } from "next/router";
import AutocompleteInput from "./Autocomplete";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/pages/drops";
import { cn, hasAccessNoVendor } from "@/lib/utils";
import { Toast } from "primereact/toast";
import { toast } from "react-toastify";
import { useSchedule } from "../hooks/use-schedule";

interface ScheduleProps {
  filterIcon?: boolean;
  isDateClickEnabled?: boolean;
  isProjectPage?: boolean;
}

const ScheduleProject: React.FC<ScheduleProps> = ({
  filterIcon = true,
  isDateClickEnabled = false,
  isProjectPage = true,
}) => {
  const { query } = useRouter();
  const { id } = query;
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
    scheduleIdToBeDeleted,
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
    isLoading,
    exportICS,
    handleDelete,
    handleDateClick,
    handleCloseModal,
    handleFormChange,
    handleSelectChange,
    handleFormSubmit,
    rescheduleEvent,
  } = useSchedule({
    isProjectPage,
    projectId: Number(id),
    isDateClickEnabled,
  });

  return (
    <div>
      <div className="schedule-container space-y-[20px] mb-[100px]">
        {filterIcon && (
          <div className=" flex items-center justify-center gap-[5px] mb-[30px]">
            <div
              className="w-12 h-12 rounded-full bg-[#5d00e4] inline-flex text-[#ffffff]  items-center justify-center cursor-pointer"
              onClick={() => setIsModalVisible(true)}
            >
              <PiCalendarPlus />
            </div>{" "}
            <div
              className="w-12 h-12 cursor-pointer rounded-full bg-[#000000] inline-flex text-[#ffffff]  items-center justify-center"
              onClick={() => setisFilter(true)}
            >
              <IoFilter />
            </div>
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
          <div className=" sm:hidden ">
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
              eventClick={(info) => {
                setProjectPin(info?.event?._def?.extendedProps?.code);
                setFormData({
                  id: info?.event?.id?.split("-")[0],
                  title: info.event.title,
                  vendor_id: info?.event?._def?.extendedProps?.vendor,
                  subvendor_id: info?.event?._def?.extendedProps?.subvendor,
                  location: info?.event?._def?.extendedProps?.location,
                  start_dte: info?.event?.start,
                  end_dte: info?.event?._def?.extendedProps?.end_date,
                  code: "",
                  project: info?.event?._def?.extendedProps?.project,
                });
                setViewOnly(true);
                setIsModalVisible(true);
              }}
              dateClick={handleDateClick}
              editable={true}
              droppable={true}
            />
          </div>
          <div className="hidden sm:block ">
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
              eventClick={(info: any) => {
                // alert(`Event: ${info.event.title}`);
                setFormErrors({});
                setProjectPin(info?.event?._def?.extendedProps?.code);
                setFormData({
                  id: info?.event?.id?.split("-")[0],
                  title: info.event.title,
                  vendor_id: info?.event?._def?.extendedProps?.vendor,
                  subvendor_id: info?.event?._def?.extendedProps?.subvendor,
                  location: info?.event?._def?.extendedProps?.location,
                  start_dte: info?.event?.start,
                  end_dte: info?.event?._def?.extendedProps?.end_date,
                  code: "",
                  project: info?.event?._def?.extendedProps?.project,
                });
                setViewOnly(true);
                setIsModalVisible(true);
              }}
              dateClick={handleDateClick}
              editable={true}
              droppable={true}
            />
          </div>
        </div>
      </div>

      <div
        className={`custom-dialog-overlay ${
          isModalVisible
            ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
            : "hidden"
        }`}
      >
        <Dialog
          header="EVENT DETAILS"
          visible={isModalVisible}
          onHide={handleCloseModal}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "50vw" }}
          className="custom-dialog-overlay"
        >
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 text-[#000]">
              <div className="grid md:grid-cols-2 gap-[20px] items-center">
                <div className="max-w-[400px] w-full">
                  {viewOnly === true ? (
                    <Input
                      type="text"
                      name="title"
                      disabled={viewOnly === true}
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Event Title"
                      // error={formErrors.title}
                    />
                  ) : (
                    <AutocompleteInput
                      name="title"
                      disabled={viewOnly}
                      value={formData.title}
                      onChange={handleFormChange}
                      error={formErrors.title}
                    />
                  )}
                </div>
                <div className="max-w-[400px] w-full">
                  {viewOnly === true ? (
                    <div className="bg-white border border-black text-sm rounded-[8px] p-4">
                      {
                        vendorOptions.find(
                          (option: any) => option.value === formData.vendor_id
                        )?.label
                      }
                    </div>
                  ) : (
                    <SelectInput
                      name="vendor_id"
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

                <div className="max-w-[400px] w-full">
                  {viewOnly === true ? (
                    <div className="bg-white border border-black text-sm rounded-[8px] p-4">
                      {
                        subvendorOptions.find(
                          (option: any) =>
                            option.value === formData.subvendor_id
                        )?.label
                      }
                    </div>
                  ) : (
                    <SelectInput
                      name="subvendor_id"
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

                <div className="max-w-[400px] w-full">
                  <Input
                    type="text"
                    name="location"
                    disabled={viewOnly}
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="Location (or Link for virtual meetings)"
                  />
                </div>

                {/* <div className="max-w-[400px] w-full">
                  -{" "}
                  <SelectInput
                    name="eventType"
                    value={formData.eventType}
                    onChange={(value) =>
                      handleSelectChange({ name: "eventType", value })
                    }
                    options={[{ value: "Virtual", label: "Virtual" }]}
                    placeholder="Select Event Type"
                  />
                </div> */}
                <div className="max-w-[400px] w-full">
                  <Input
                    type="text"
                    name="code"
                    disabled={viewOnly}
                    value={formData.code}
                    onChange={handleFormChange}
                    placeholder="Enter Code"
                    error={formErrors.code}
                  />
                </div>
                <div className="max-w-[400px] w-full">
                  <Input
                    type="datetime-local"
                    name="start_dte"
                    // disabled={viewOnly === true}
                    value={formData.start_dte}
                    onChange={handleFormChange}
                    placeholder="Start Date & Time"
                    error={formErrors.start_dte}
                  />
                </div>
                <div className="max-w-[400px] w-full">
                  <Input
                    type="datetime-local"
                    name="end_dte"
                    // disabled={viewOnly === true}
                    value={formData.end_dte}
                    onChange={handleFormChange}
                    placeholder="End Date & Time"
                    error={formErrors.end_dte}
                  />
                </div>
              </div>

              <div className="flex items-center gap-[5px]  lg:justify-between">
                <div className="flex items-center gap-[5px] lg:gap-[5px]">
                  {!viewOnly && (
                    <button
                      className=" text-[14px] cursor-pointer px-[20px] py-[8px] bg-[#5300d7] rounded-full text-[#fff] inline-flex"
                      type="submit"
                    >
                      Schedule
                    </button>
                  )}
                  {viewOnly &&
                    formData.start_dte &&
                    new Date(formData.start_dte) >=
                      new Date(new Date().setHours(0, 0, 0, 0)) && (
                      <p
                        className="text-[14px] px-[20px] py-[8px] bg-red-600 rounded-full text-[#fff] inline-flex cursor-pointer"
                        onClick={() => {
                          setScheduleIdToBeDeleted(formData);
                          setDeleteDialog(true);
                        }}
                      >
                        Delete
                      </p>
                    )}
                  <p
                    className="text-[14px] px-[20px] py-[8px] bg-[#000] rounded-full text-[#fff] inline-flex cursor-pointer"
                    // onClick={() =>
                    //   downloadFormDataAsICS(
                    //     formData,
                    //     vendorOptions,
                    //     subvendorOptions
                    //   )
                    // }
                    onClick={() => exportICS()}
                  >
                    Share
                  </p>
                  {viewOnly &&
                    hasAccessNoVendor(userLoggedInProfile, ["Manager"]) && (
                      <p
                        className=" text-[14px] cursor-pointer px-[20px] py-[8px] bg-[#5300d7] rounded-full text-[#fff] inline-flex"
                        onClick={() => rescheduleEvent()}
                      >
                        Reschedule
                      </p>
                    )}
                </div>

                {!isProjectPage && (
                  <button
                    className="relative group rounded-full"
                    disabled={isProjectPage}
                    type="button"
                    onClick={() => {
                      if (!formData.project) {
                        toast.info("No project code");
                      }
                      window.open(`/campaigns/${formData?.project}`);
                    }}
                  >
                    <p className="bg-[#000] hover:bg-orange-500 text-[#fff] rounded-full h-[40px] w-[40px] flex items-center justify-center cursor-pointer font-IBM">
                      <GoArrowUpRight size={24} />
                    </p>

                    <p className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max px-3 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                      View Project
                    </p>
                  </button>
                )}
              </div>
            </div>
          </form>
        </Dialog>
      </div>

      <div
        className={`custom-dialog-overlay ${
          filter ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50" : "hidden"
        }`}
      >
        <Dialog
          header="SELECT CALENDAR"
          visible={filter}
          onHide={() => setisFilter(false)}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          className="custom-dialog-overlay"
        >
          <form>
            <div className="space-y-4 text-[#000]">
              <div className="grid gap-[20px] items-center">
                <div className="max-w-[400px] w-full">
                  <SelectInput
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={(value) =>
                      handleSelectChange({ name: "vendor_id", value })
                    }
                    // onChange={handleFormChange2}
                    options={vendorOptions}
                  />
                </div>

                <div className="max-w-[400px] w-full">
                  <SelectInput
                    name="subvendor_id"
                    value={formData.subvendor_id}
                    // labelText="subvendor_id"
                    onChange={(value) =>
                      handleSelectChange({ name: "subvendor_id", value })
                    }
                    options={subvendorOptions}
                  />
                </div>
              </div>

              <div className="text-center flex items-center justify-center">
                <button
                  className="cursor-pointer w-full text-center px-[20px] py-[8px] bg-[#000000] hover:bg-orange-600 rounded-full text-[#fff] flex items-center justify-center"
                  type="submit"
                >
                  Generate
                </button>
              </div>
            </div>
          </form>
        </Dialog>
      </div>

      <Dialog
        header={
          <div className="flex items-center gap-2 tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400] relative">
            <Tooltip info="Delete the dropzone selected" />
            <span>DELETE EVENT</span>
          </div>
        }
        visible={deleteDialog !== false}
        onHide={() => setDeleteDialog(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "25vw" }}
        className="custom-dialog-overlay"
        headerClassName=" tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400]"
      >
        <p>
          Please note that deleting the event "{formData.title}" is not
          refundable.
        </p>

        <input
          type="password"
          name="projectPin"
          autoComplete="new-password"
          className={cn(
            "mt-2 block w-full border font-IBM border-black bg-white px-4 py-[8px] h-[50px] text-[14px] placeholder:text-[14px] font-[400] text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-[8px]",
            pinError && "border-red-500 focus:ring-red-500"
          )}
          placeholder={"Enter Pin"}
          value={pinEntered}
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
        {pinError && (
          <span className="text-red-500 text-sm mt-1">
            Wrong password entered
          </span>
        )}

        <div className="flex gap-5 items-center mt-5">
          <Button
            label="Cancel"
            className="rounded-full"
            onClick={() => setDeleteDialog(false)}
          />
          <Button
            disabled={pinEntered.length < 6 || pinError || deleteLoading}
            label="Delete Event"
            className={`bg-red-600 ${deleteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleDelete(Number(formData.id))}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ScheduleProject;
