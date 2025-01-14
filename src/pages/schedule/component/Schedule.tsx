import React, { useEffect, useState } from "react";
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
import { CreateEvent, getEvents } from "@/services/api";
import { ContentItem, EventsItem } from "@/types/contents";
import { PiCalendarPlus } from "react-icons/pi";
import { IoFilter } from "react-icons/io5";
interface FormErrors {
  title?: string;
  start_dte?: string;
  end_dte?: string;
  code?: string;
}

const Schedule = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [eventItem, setEventItem] = useState<EventsItem[]>([]);

  useEffect(() => {
    getEvents()
      .then((fetchedContent) => {
        setEventItem(fetchedContent || []);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
      });
  }, []);

  const events = eventItem.map((item) => ({
    id: item?.code?.toString(),
    title: item.title,
    start: item.start_dte,
    end: item.end_dte,
  }));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filter, setisFilter] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    vendor_id: "",
    subvendor: "",
    location: "",
    start_dte: "",
    end_dte: "",
    code: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: "",
    start_dte: "",
    end_dte: "",
  });

  const handleDateClick = (info: DateClickArg) => {
    const selectedDate = info.dateStr;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedDate >= currentDate) {
      // setSelectedDate(selectedDate);
      setIsModalVisible(true);
    } else {
      alert(`You cannot select a past date: ${selectedDate}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleFormChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    if ((value as React.ChangeEvent<HTMLInputElement>).target) {
      const { name, value: inputValue } = (
        value as React.ChangeEvent<HTMLInputElement>
      ).target;

      setFormData((prevData) => {
        const updatedData = { ...prevData, [name]: inputValue };
        console.log(updatedData);

        const newErrors: { [key: string]: string } = { ...formErrors };

        if (name === "title" && !inputValue) {
          newErrors.title = "Event Title is required.";
        } else {
          newErrors.title = "";
        }

        if (name === "start_dte" && !inputValue) {
          newErrors.start_dte = "Start Date is required.";
        } else {
          newErrors.start_dte = "";
        }

        if (name === "end_dte" && !inputValue) {
          newErrors.end_dte = "End Date is required.";
        } else {
          newErrors.end_dte = "";
        }

        if (
          name === "code" &&
          value &&
          (value as unknown as string).length > 6
        ) {
          newErrors.code = "Code must be less than or equal to 6 characters.";
        } else if (name === "code") {
          newErrors.code = "";
        }

        setFormErrors(newErrors);

        return updatedData;
      });
    } else {
      setFormData((prevData) => {
        const updatedData = { ...prevData, subvendor: value.toString() };
        console.log(updatedData);

        const newErrors: { [key: string]: string } = { ...formErrors };

        if (!formData.title) {
          newErrors.title = "Event Title is required.";
        } else {
          newErrors.title = "";
        }

        if (!formData.start_dte) {
          newErrors.start_dte = "Start Date is required.";
        } else {
          newErrors.start_dte = "";
        }

        if (!formData.end_dte) {
          newErrors.end_dte = "End Date is required.";
        } else {
          newErrors.end_dte = "";
        }

        setFormErrors(newErrors);

        return updatedData;
      });
    }
  };

  const handleFormChange2 = (value: {
    name: string;
    value: string | number;
  }) => {
    const { name, value: inputValue } = value;
    console.log("Updating field:", name, "with value:", inputValue);

    setFormData((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: inputValue,
      };

      console.log(updatedData);

      return updatedData;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      title: "",
      start_dte: "",
      end_dte: "",
    };

    if (!formData.title) {
      newErrors.title = "Event Title is required.";
    }

    if (!formData.start_dte) {
      newErrors.start_dte = "Start Date is required.";
    }
    if (!formData.code || formData.code.length > 6) {
      newErrors.code = "Code must be less than or equal to 6 characters.";
    } else {
      newErrors.code = "";
    }
    if (!formData.end_dte) {
      newErrors.end_dte = "End Date is required.";
    }

    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    console.log("Form submitted!", FormData);

    if (!hasErrors) {
      const updatedFormData = {
        ...formData,
        vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : null,
        subvendor: formData.subvendor ? parseInt(formData.subvendor) : null,
      };

      console.log("Form data is valid:", updatedFormData);

      CreateEvent(updatedFormData)
        .then(() => {
          console.log("Form submitted successfully!");
          const newEvent: ContentItem = {
            id: (content.length + 1).toString(),
            title: formData.title,
            start_dte: formData.start_dte,
            end_dte: formData.end_dte,
          };
          setContent((prevEvents) => [...prevEvents, newEvent]);

          setFormData({
            title: "",
            vendor_id: "",
            subvendor: "",
            location: "",
            start_dte: "",
            end_dte: "",
            code: "",
          });
          setIsModalVisible(false);
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    } else {
      console.log("Form contains errors. Not submitting.");
    }
  };

  const vendorOptions = [
    { value: 1, label: "Ade" },
    { value: 2, label: "VIVO" },
  ];

  const subVendorOptions = [
    { value: 3, label: "SubAde" },
    { value: 4, label: "tedXOAU" },
  ];

  return (
    <div>
      <div className="schedule-container space-y-[20px]">
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
        <div className="calendar-container">
          <style>
            {`
            .fc .fc-toolbar-title {
              text-transform: uppercase !important;
              font-size:18px;
              font-weight:bold;
            }
            .fc .fc-button {
              text-transform: uppercase !important;
            }
            .fc .fc-toolbar-chunk {
              text-transform: uppercase !important;
            }
            .fc .fc-today-button {
              text-transform: uppercase !important;
            }
          `}
          </style>
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
            eventClick={(info) => {
              alert(`Event: ${info.event.title}`);
            }}
            dateClick={handleDateClick}
            editable={true}
            droppable={true}
          />
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
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Event Title"
                    error={formErrors.title}
                  />
                </div>
                <div className="max-w-[400px] w-full">
                  <SelectInput
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={(value) =>
                      handleFormChange2({ name: "vendor_id", value })
                    }
                    // onChange={handleFormChange2}
                    options={vendorOptions}
                  />
                </div>

                <div className="max-w-[400px] w-full">
                  <SelectInput
                    name="subvendor"
                    value={formData.subvendor}
                    // labelText="Subvendor"
                    onChange={(value) =>
                      handleFormChange2({ name: "subvendor", value })
                    }
                    options={subVendorOptions}
                  />
                </div>

                <div className="max-w-[400px] w-full">
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="Location (or Link for virtual meetings)"
                  />
                </div>

                <div className="max-w-[400px] w-full">
                  <SelectInput
                    name="eventType"
                    onChange={(value) =>
                      handleFormChange2({ name: "eventType", value })
                    }
                    // labelText="Select Event Type"
                    options={[{ value: "Virtual", label: "Virtual" }]}
                  />
                </div>
                <div className="max-w-[400px] w-full">
                  <Input
                    type="text"
                    name="code"
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
                    value={formData.end_dte}
                    onChange={handleFormChange}
                    placeholder="End Date & Time"
                    error={formErrors.end_dte}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[20px]">
                  <button
                    className="cursor-pointer px-[20px] py-[8px] bg-[#5300d7] rounded-full text-[#fff] inline-flex"
                    type="submit"
                  >
                    Schedule
                  </button>
                  <p className="px-[20px] py-[8px] bg-[#000] rounded-full text-[#fff] inline-flex">
                    Share
                  </p>
                </div>

                <div className="bg-[#000] text-[#fff] rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer">
                  <GoArrowUpRight size={24} />
                </div>
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
                      handleFormChange2({ name: "vendor_id", value })
                    }
                    // onChange={handleFormChange2}
                    options={vendorOptions}
                  />
                </div>

                <div className="max-w-[400px] w-full">
                  <SelectInput
                    name="subvendor"
                    value={formData.subvendor}
                    // labelText="Subvendor"
                    onChange={(value) =>
                      handleFormChange2({ name: "subvendor", value })
                    }
                    options={subVendorOptions}
                  />
                </div>
              </div>

              <div className="text-center flex items-center justify-center">
                <button
                  className="cursor-pointer w-full text-center px-[20px] py-[8px] bg-[#000000] hover:bg-orange-600 rounded-[4px] text-[#fff] flex items-center justify-center"
                  type="submit"
                >
                  Generate
                </button>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default Schedule;
