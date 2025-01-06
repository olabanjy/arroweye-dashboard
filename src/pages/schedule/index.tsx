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
  title?: string;
  start_dte?: string;
  end_dte?: string;
}

const Schedule = () => {
  // const [content, setContent] = useState<ContentItem[]>([]);

  // useEffect(() => {
  //   getEvents()
  //     .then((fetchedContent) => {
  //       setContent(fetchedContent || []);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching events:", err);
  //     });
  // }, []);
  const [content, setContent] = useState([
    {
      id: "1",
      title: "Sample Event",
      start_dte: "2025-01-10T10:00:00",
      end_dte: "2025-01-10T12:00:00",
    },
    {
      id: "2",
      title: "Another Event",
      start_dte: "2025-01-15T14:00:00",
      end_dte: "2025-01-15T16:00:00",
    },
  ]);

  // Map content to FullCalendar's expected format
  const events = content.map((item) => ({
    id: item.id,
    title: item.title,
    start: item.start_dte,
    end: item.end_dte,
  }));

  // const events = content.map((item) => ({
  //   id: item.id ? item.id.toString() : "",
  //   title: item.title,
  //   start: item.start_dte,
  //   end: item.end_dte,
  // }));

  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      console.log(updatedData);

      const newErrors: { [key: string]: string } = { ...formErrors };

      if (name === "title" && !value) {
        newErrors.title = "Event Title is required.";
      } else {
        newErrors.title = "";
      }

      if (name === "start_dte" && !value) {
        newErrors.start_dte = "Start Date is required.";
      } else {
        newErrors.start_dte = "";
      }

      if (name === "end_dte" && !value) {
        newErrors.end_dte = "End Date is required.";
      } else {
        newErrors.end_dte = "";
      }

      setFormErrors(newErrors);

      return updatedData;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted!");

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

    if (!formData.end_dte) {
      newErrors.end_dte = "End Date is required.";
    }

    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

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
          const newEvent = {
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
    </DashboardLayout>
  );
};

export default Schedule;
