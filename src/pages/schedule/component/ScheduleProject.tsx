import React, { useEffect, useState } from "react";
import ls from "localstorage-slim";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog } from "primereact/dialog";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { GoArrowUpRight } from "react-icons/go";
import { DateClickArg } from "@fullcalendar/interaction";
import {
  CreateEvent,
  deleteEvents,
  getBusiness,
  getProjectsEvents,
  RescheduleEvent,
} from "@/services/api";
import { ContentItem, EventsItem } from "@/types/contents";
import { PiCalendarPlus } from "react-icons/pi";
import { IoFilter } from "react-icons/io5";
import { useRouter } from "next/router";
import AutocompleteInput from "./Autocomplete";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/pages/drops";
import { createEvent, EventAttributes } from "ics";
import { cn, hasAccessNoVendor } from "@/lib/utils";

interface FormErrors {
  title?: string;
  vendor_id?: string;
  subvendor_id?: string;
  location?: string;
  start_dte?: string;
  end_dte?: string;
  code?: string;
  project?: string;
}

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
  const [content, setContent] = useState<ContentItem[]>([]);
  const [eventItem, setEventItem] = useState<EventsItem[]>([]);
  const [vendorOptions, setVendorOptions] = useState<any>([]);
  const [subvendorOptions, setSubvendorOptions] = useState<any>([]);

  const [userLoggedInProfile, setUserLoggedInProfile] = useState<any>({});
  useEffect(() => {
    const content: any = ls.get("Profile", { decrypt: true });
    setUserLoggedInProfile(content?.user?.user_profile);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let fetchedContent;
        if (isProjectPage === true && !!id) {
          console.log("Fetching events for project", id);
          fetchedContent = await getProjectsEvents(Number(id));
        }
        console.log("Events Fetched", fetchedContent);
        setEventItem(fetchedContent || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [isProjectPage, id]);

  useEffect(() => {
    getBusiness()
      .then((fetchedContent: any) => {
        // Filter and map data for vendors
        const vendors = fetchedContent
          .filter((business: any) => business.type === "Vendor")
          .map((business: any) => ({
            value: business.id,
            label: business.organization_name,
          }));

        // Filter and map data for subvendors
        const subvendors = fetchedContent
          .filter((business: any) => business.type === "SubVendor")
          .map((business: any) => ({
            value: business.id,
            label: business.organization_name,
          }));

        setVendorOptions(vendors);
        setSubvendorOptions(subvendors);
      })
      .catch((err) => {
        console.error("Error fetching business data:", err);
      });
  }, []);

  const events = eventItem.map((item, index) => ({
    id: `${item?.id}-${index}`, // Make unique by adding index
    title: item.title,
    start: item.start_dte,
    end: item.start_dte,
    end_date: item.end_dte,
    vendor: item.vendor,
    subvendor: item.subvendor,
    location: item.location,
    project: item.project,
    code: item.code,
  }));

  const downloadFormDataAsICS = (
    formData: any,
    vendorOptions: { value: number; label: string }[],
    subvendorOptions: { value: number; label: string }[],
    filename = "event.ics"
  ) => {
    const findLabelByValue = (
      options: { value: number; label: string }[],
      value: number
    ) => {
      const found = options.find((option) => option.value === value);
      return found ? found.label : value.toString();
    };

    const Vendor = formData.vendor_id
      ? findLabelByValue(vendorOptions, formData.vendor_id)
      : "";

    const Subvendor = formData.subvendor_id
      ? findLabelByValue(subvendorOptions, formData.subvendor_id)
      : "";

    const eventTitle = String(formData.title || "Untitled Event");
    const eventDescription = String(
      formData.description || `Vendor: ${Vendor}, Subvendor: ${Subvendor}`
    );
    const eventLocation = String(formData.location || "Online");
    const organizerEmail = String(formData.email || "hi@pinegingr.com");

    const startDateTime = formData.start
      ? new Date(formData.start)
      : new Date();

    const startArray: [number, number, number, number, number] = [
      startDateTime.getFullYear(),
      startDateTime.getMonth() + 1,
      startDateTime.getDate(),
      startDateTime.getHours(),
      startDateTime.getMinutes(),
    ];

    const event: EventAttributes = {
      start: startArray,
      startInputType: "local",
      startOutputType: "utc",
      duration: { hours: 1 },
      title: eventTitle,
      description: eventDescription,
      location: eventLocation,
      status: "CONFIRMED",
      uid: `event-${Date.now()}`,
      categories: ["Tech", "Virtual"],
      htmlContent: `<strong>${eventTitle}</strong><br/>Vendor: ${Vendor}<br/>Subvendor: ${Subvendor}`,
      organizer: {
        name: Vendor,
        email: organizerEmail,
      },
    };

    createEvent(event, (error, value) => {
      if (error) {
        console.error(error);
        toast.error("Failed to generate calendar file");
        return;
      }

      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Calendar invite downloaded");
    });
  };

  const rescheduleEvent = () => {
    const newErrors = {
      code: "",
    };

    if (!formData.code) {
      newErrors.code = "Product Code is required.";
    }

    setFormErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      const payload = {
        event_id: formData.id,
        start_dte: formData.start_dte,
        end_dte: formData.end_dte,
        code: formData.code,
      };

      RescheduleEvent(payload)
        .then((response) => {
          console.log(response);
          setIsModalVisible(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [filter, setisFilter] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: "",
    title: "",
    vendor_id: "",
    subvendor_id: "",
    location: "",
    start_dte: "",
    end_dte: "",
    code: "",
    project: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: "",
    start_dte: "",
    end_dte: "",
  });
  const [projectPin, setProjectPin] = useState("");
  const [pinEntered, setPinEntered] = useState("");
  const [pinError, setPinError] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [scheduleIdToBeDeleted, setScheduleIdToBeDeleted] = useState<any>("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const findLabelByValue = (
    options: { value: number; label: string }[],
    value: number
  ) => {
    const found = options.find((option) => option.value === value);
    return found ? found.label : value.toString();
  };

  const eventTitles: any = {
    "Interview with Artist": {
      type: "interview",
      location: "Studio A",
      link: "https://example.com/interview-call-sheet",
    },
    "Video Shoot": {
      type: "shoot",
      location: "Studio B",
      link: "https://example.com/video-shoot-call-sheet",
    },
    "Live Performance": {
      type: "performance",
      location: "Venue X",
      link: "https://example.com/live-performance-call-sheet",
    },
    "Rehearsal Session": {
      type: "rehearsal",
      location: "Studio C",
      link: "https://example.com/rehearsal-call-sheet",
    },
    "Other Event": {
      type: "other",
      location: "Location Y",
      link: "https://example.com/other-call-sheet",
    },
  };

  const getEventDetails = () => {
    const title = formData.title.trim();
    const start = formData.start_dte;
    const end = formData.end_dte;
    const location = formData.location.trim();
    const vendor = formData.vendor_id
      ? findLabelByValue(vendorOptions, formData.vendor_id)
      : "";
    const subvendor = formData.subvendor_id
      ? findLabelByValue(subvendorOptions, formData.subvendor_id)
      : "";

    if (!title || !start || !end || !location || !vendor || !subvendor) {
      toast.error("Please fill in all fields");
      return null;
    }

    const eventDetails = eventTitles[title] || { link: null };
    return {
      title,
      start,
      end,
      extendedProps: {
        location,
        vendor,
        subvendor,
        callSheetLink: eventDetails.link,
      },
    };
  };

  const formatDateForICS = (dateString: any) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  function formatDetails(eventDetails: any, includeICSLine: any) {
    const currentDate = new Date().toLocaleString();
    const startDate = new Date(eventDetails.start).toLocaleString(); // Only convert once

    return (
      `Hello,\n\n` +
      `Find the call sheet for this event here: ${eventDetails.extendedProps.callSheetLink || "N/A"}\n\n` +
      `Title: ${eventDetails.title}\n` +
      `Date: ${startDate}\n` +
      `Location: ${eventDetails.extendedProps.location}\n` +
      `Vendor: ${eventDetails.extendedProps.vendor}\n` +
      `Subvendor: ${eventDetails.extendedProps.subvendor}\n\n` +
      `*********\n\n` +
      `For more information on best practices for schedules visit pinegingr.com/faqs.\n` +
      `Please be punctual, rescheduling fees apply for certain event types and timelines. For further inquiries, contact hi@pinegingr.com.\n\n` +
      `*********\n\n` +
      `Auto-generated on arroweye.pro on ${currentDate}.\n` +
      (includeICSLine ? `(Kindly attach the .ICS calendar invite)` : "")
    ); // Conditionally add ICS line
  }

  const exportICS = () => {
    const eventDetails = getEventDetails();
    if (!eventDetails) return;

    const startDate = formatDateForICS(eventDetails.start);
    const endDate = formatDateForICS(eventDetails.end);
    const description = formatDetails(eventDetails, false).replace(
      /\n/g,
      "\\n"
    );

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${eventDetails.title}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `LOCATION:${eventDetails.extendedProps.location}`,
      `DESCRIPTION:${description}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([icsData], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "event.ics";
    toast.success("Calender invite is downloaded");
    link.click();
  };

  const handleDelete = (eventID: number) => {
    setDeleteLoading(true);
    deleteEvents(eventID)
      .then(() => {
        setDeleteLoading(false);
        getProjectsEvents(Number(id))
          .then((newEvents) => setEventItem(newEvents || []))
          .catch((err) => console.log(err));
        setDeleteDialog(false);
        setIsModalVisible(false);
      })
      .catch((err) => {
        setDeleteLoading(false);
        console.error("Error fetching business data:", err);
      });
  };
  const handleDateClick = (info: DateClickArg) => {
    if (!isDateClickEnabled) return;

    const selectedDate = info.dateStr;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedDate >= currentDate) {
      // setSelectedDate(selectedDate);
      setIsModalVisible(true);
    } else {
      alert(`You cannot set events in the past`);
    }
  };

  const handleCloseModal = () => {
    setViewOnly(false);
    setIsModalVisible(false);
    setFormData({
      id: "",
      title: "",
      vendor_id: "",
      subvendor_id: "",
      location: "",
      start_dte: "",
      end_dte: "",
      code: "",
      project: "",
    });
  };

  const formatDateToString = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString();
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => {
      const newData = { ...prevData, [name]: value };

      // Clear end_dte error if start_dte is changed
      if (name === "start_dte") {
        setFormErrors((prev) => ({
          ...prev,
          end_dte: newData.end_dte ? validateDates(value, newData.end_dte) : "",
        }));
      }

      // Validate end_dte when it's changed
      if (name === "end_dte") {
        setFormErrors((prev) => ({
          ...prev,
          end_dte: validateDates(newData.start_dte, value),
        }));
      }

      return newData;
    });
  };

  const validateDates = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return "End date cannot be before start date";
    }
    return "";
  };

  const handleSelectChange = ({ name, value }: any) => {
    console.log(`Updating select ${name} with value:`, value); // Debug log
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors = {
      title: "",
      vendor_id: "",
      subvendor_id: "",
      location: "",
      start_dte: "",
      end_dte: "",
      code: "",
      project: "",
    };

    // Validation
    if (!formData.title.trim()) {
      newErrors.title = "Event Title is required.";
    }

    if (!formData.vendor_id) {
      newErrors.vendor_id = "Vendor is required.";
    }

    if (!formData.subvendor_id) {
      newErrors.subvendor_id = "Sub Vendor is required.";
    }

    if (!formData.location) {
      newErrors.location = "Location is required.";
    }

    if (!formData.start_dte) {
      newErrors.start_dte = "Start Date is required.";
    }

    if (!formData.code) {
      newErrors.code = "Product Code is required.";
    }

    if (!formData.end_dte) {
      newErrors.end_dte = "End Date is required.";
    } else {
      const dateError = validateDates(formData.start_dte, formData.end_dte);
      if (dateError) {
        newErrors.end_dte = dateError;
      }
    }

    // if (formData.code) {
    //   if (formData.code.length > 6) {
    //     newErrors.code = "Code must be less than or equal to 6 characters.";
    //   }
    // }

    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        // Format dates to ISO strings
        const updatedFormData = {
          ...formData,
          vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : null,
          subvendor_id: formData.subvendor_id
            ? parseInt(formData.subvendor_id)
            : null,
          start_dte: formatDateToString(formData.start_dte),
          end_dte: formatDateToString(formData.end_dte),
        };

        console.log("Submitting form data:", updatedFormData);

        await CreateEvent(updatedFormData);

        const newEvent = {
          id: (content.length + 1).toString(),
          title: formData.title,
          start_dte: updatedFormData.start_dte,
          end_dte: updatedFormData.end_dte,
        };

        setContent((prevEvents) => [...prevEvents, newEvent]);

        // Reset form
        setFormData({
          id: "",
          title: "",
          vendor_id: "",
          subvendor_id: "",
          location: "",
          start_dte: "",
          end_dte: "",
          code: "",
          project: "",
        });
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

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
