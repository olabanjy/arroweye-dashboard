import React, { useState } from "react";
import DashboardLayout from "../dashboard/layout";
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
import { CreateEvent } from "@/services/api";

interface FormErrors {
  eventTitle?: string;
  startDate?: string;
  endDate?: string;
}

const Schedule = () => {
  const [events, setEvents] = useState([
    {
      title: "Sample Event",
      start: "2024-12-16T10:00:00",
      end: "2024-12-16T12:00:00",
    },
    {
      title: "Another Event",
      start: "2024-12-17T14:00:00",
      end: "2024-12-17T16:00:00",
    },
  ]);

  // const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    eventTitle: "",
    vendor: "",
    subvendor: "",
    location: "",
    eventType: "",
    startDate: "",
    endDate: "",
    code: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    eventTitle: "",
    startDate: "",
    endDate: "",
  });

  // const handleAddEvent = () => {
  //   setFormErrors({
  //     eventTitle: "",
  //     startDate: "",
  //     endDate: "",
  //   });

  //   const errors: FormErrors = {};

  //   if (!formData.eventTitle) errors.eventTitle = "Event Title is required";
  //   if (!formData.startDate) errors.startDate = "Start Date is required";
  //   if (!formData.endDate) errors.endDate = "End Date is required";

  //   if (Object.keys(errors).length > 0) {
  //     setFormErrors(errors);
  //     return;
  //   }

  //   const newEvent = {
  //     title: formData.eventTitle,
  //     start: formData.startDate,
  //     end: formData.endDate,
  //   };

  //   setEvents((prevEvents) => [...prevEvents, newEvent]);

  //   setIsModalVisible(false);
  //   setSelectedDate(null);
  //   setFormData({
  //     eventTitle: "",
  //     vendor: "",
  //     subvendor: "",
  //     location: "",
  //     eventType: "",
  //     startDate: "",
  //     endDate: "",
  //     code: "",
  //   });
  // };

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
    // setSelectedDate(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      console.log(updatedData);

      const newErrors: { [key: string]: string } = { ...formErrors };

      if (name === "eventTitle" && !value) {
        newErrors.eventTitle = "Event Title is required.";
      } else {
        newErrors.eventTitle = "";
      }

      if (name === "startDate" && !value) {
        newErrors.startDate = "Start Date is required.";
      } else {
        newErrors.startDate = "";
      }

      if (name === "endDate" && !value) {
        newErrors.endDate = "End Date is required.";
      } else {
        newErrors.endDate = "";
      }

      setFormErrors(newErrors);

      return updatedData;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted!");

    const newErrors: FormErrors = {
      eventTitle: "",
      startDate: "",
      endDate: "",
    };

    if (!formData.eventTitle) {
      newErrors.eventTitle = "Event Title is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End Date is required.";
    }

    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      const updatedFormData = {
        ...formData,
        vendor: formData.vendor ? parseInt(formData.vendor) : null,
        subvendor: formData.subvendor ? parseInt(formData.subvendor) : null,
      };

      console.log("Form data is valid:", updatedFormData);

      CreateEvent(updatedFormData)
        .then(() => {
          console.log("Form submitted successfully!");
          const newEvent = {
            title: formData.eventTitle,
            start: formData.startDate,
            end: formData.endDate,
          };
          setEvents((prevEvents) => [...prevEvents, newEvent]);

          setFormData({
            eventTitle: "",
            vendor: "",
            subvendor: "",
            location: "",
            eventType: "",
            startDate: "",
            endDate: "",
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
    <DashboardLayout>
      <div className="schedule-container">
        <div className="calendar-container">
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

      <Dialog
        header="EVENT DETAILS"
        visible={isModalVisible}
        onHide={handleCloseModal}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4 text-[#000]">
            <div className="grid grid-cols-2 gap-[20px] items-center">
              <div className="max-w-[400px] w-full">
                <Input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleFormChange}
                  placeholder="Event Title"
                  error={formErrors.eventTitle}
                />
              </div>
              <div className="max-w-[400px] w-full">
                <SelectInput
                  name="vendor"
                  value={formData.vendor}
                  labelText="Vendor"
                  onChange={handleFormChange}
                  options={vendorOptions}
                />
              </div>
              <div className="max-w-[400px] w-full">
                <SelectInput
                  name="subvendor"
                  value={formData.subvendor}
                  labelText="SubVendor"
                  onChange={handleFormChange}
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
                  value={formData.eventType}
                  onChange={handleFormChange}
                  labelText="Select Event Type"
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
                />
              </div>
              <div className="max-w-[400px] w-full">
                <Input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  placeholder="Start Date & Time"
                  error={formErrors.startDate}
                />
              </div>
              <div className="max-w-[400px] w-full">
                <Input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  placeholder="End Date & Time"
                  error={formErrors.endDate}
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
    </DashboardLayout>
  );
};

export default Schedule;
