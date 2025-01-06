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

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  console.log(selectedDate);

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

  const handleAddEvent = () => {
    console.log(formData);

    const errors: FormErrors = {};

    if (!formData.eventTitle) errors.eventTitle = "Event Title is required";
    if (!formData.startDate) errors.startDate = "Start Date is required";
    if (!formData.endDate) errors.endDate = "End Date is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newEvent = {
      title: formData.eventTitle,
      start: formData.startDate,
      end: formData.endDate,
    };

    setEvents([...events, newEvent]);

    setIsModalVisible(false);
    setSelectedDate(null);
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
  };

  const handleDateClick = (info: DateClickArg) => {
    const selectedDate = info.dateStr;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedDate >= currentDate) {
      setSelectedDate(selectedDate);
      setIsModalVisible(true);
    } else {
      alert(`You cannot select a past date: ${selectedDate}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      console.log(updatedData);
      return updatedData;
    });
  };

  return (
    <DashboardLayout>
      <form>
        <div className="schedule-container ">
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
                  options={[{ value: "Ade", label: "Ade" }]}
                />
              </div>
              <div className="max-w-[400px] w-full">
                <Input
                  type="text"
                  name="subvendor"
                  value={formData.subvendor}
                  onChange={handleFormChange}
                  placeholder="Subvendor"
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
                <p
                  className=" cursor-pointer px-[20px] py-[8px] bg-[#5300d7] rounded-full text-[#fff] inline-flex"
                  onClick={handleAddEvent}
                >
                  Schedule
                </p>
                <p className="px-[20px] py-[8px] bg-[#000] rounded-full text-[#fff] inline-flex">
                  Share
                </p>
              </div>

              <div className="bg-[#000] text-[#fff] rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer">
                <GoArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </Dialog>
      </form>
    </DashboardLayout>
  );
};

export default Schedule;
