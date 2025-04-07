import React, { useEffect, useState } from "react";
import ls from "localstorage-slim";
import DashboardLayout from "../dashboard/layout";
import { HiOutlineUserAdd } from "react-icons/hi";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Input } from "@/components/ui/input";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";
import { SelectInput } from "@/components/ui/selectinput";
import { FaCheckCircle, FaUserMinus } from "react-icons/fa";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import {
  AddStaff,
  campaignStaffAction,
  getBusinessStaff,
  getSingleProject,
} from "@/services/api";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";
import ProjectSingleInsight from "./component/ProjectSingleInsight";
import Schedule from "../schedule/component/Schedule";
import InsightChart from "./component/InsightChart";
import { Tooltip } from "../drops";
import DropsList from "../dropss/component/DropsList";
import { GiCancel } from "react-icons/gi";
import { format, parseISO } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import ScheduleProject from "../schedule/component/ScheduleProject";
import EmailInputWithSuggestions from "./component/EmailInputWithSuggestions";

interface User {
  id: string;
  initials: string;
  fullname: string;
  staff_email: string;
  role: string;
  last_login: any;
  member_since: any;
}

// interface AddUserFormData = {
//   email: string;
//   business_id: string;
//   role: string | number;
//   fullname: string;
// };

const ProjectDetails = () => {
  const [content, setContent] = useState<any | null>(null);
  const [subvendorStaff, setSubVendorStaff] = useState<ContentItem[] | null>(
    null
  );
  const [staffSuggestions, setStaffSuggestions] = useState<any[]>([]);

  const { query } = useRouter();
  const { id } = query;
  const [visible, setVisible] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [broadcast, setBroadcast] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editModeOff, setEditModeOff] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const hideNameDialog = () => {
    setNameDialogVisible(false);
  };

  const [isAddUserLoading, setIsAddUserLoading] = useState(false);

  const [addUserFormData, setAddUserFormData] = useState<{
    email: string;
    business_id: string;
    role: string | number;
    fullname: string;
    project_id: any;
  }>({
    email: "",
    business_id: "",
    role: "",
    fullname: "",
    project_id: id,
  });
  const [addUserErrors, setAddUserErrors] = useState({
    email: "",
    business_id: "",
    role: "",
    fullname: "",
  });

  const handleAddUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddUserFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      return updatedData;
    });
  };

  const handleAddUserInputChange2 = (value: string | number) => {
    const name = "role";

    setAddUserFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      return updatedData;
    });
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsAddUserLoading(true);

    const newAddUserErrors = {
      email: "",
      business_id: "",
      role: "",
      fullname: "",
    };

    if (
      !addUserFormData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addUserFormData.email)
    ) {
      newAddUserErrors.email = "Please enter a valid email address.";
    }
    if (!addUserFormData.role) {
      newAddUserErrors.role = "Role is required.";
    }
    if (!addUserFormData.fullname) {
      newAddUserErrors.fullname = "Full name is required.";
    }

    const hasErrors = Object.values(newAddUserErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) {
      setAddUserErrors(newAddUserErrors);
      setIsAddUserLoading(false);
      return;
    }

    const payload = {
      ...addUserFormData,
      business_id: content?.subvendor?.id,
      project_id: Number(id),
    };

    AddStaff(payload)
      .then((response) => {
        console.log("AddStaff response:", response);

        setVisible(false);
        setNameDialogVisible(false);

        setAddUserFormData({
          email: "",
          business_id: "",
          role: "",
          fullname: "",
          project_id: id,
        });

        getSingleProject(Number(id)).then((fetchedContent) => {
          setContent(fetchedContent);
          setSubVendorStaff(fetchedContent?.watchers);
        });
      })
      .catch((err) => {
        console.error("Error in AddStaff submission:");
        if (err.response) {
          console.error("Server Response Error:", {
            data: err.response.data,
            status: err.response.status,
            headers: err.response.headers,
          });
          const serverErrors = err.response.data;
          setAddUserErrors((prev) => ({
            ...prev,
            email: serverErrors?.email || prev.email,
            role: serverErrors?.role || prev.role,
            fullname: serverErrors?.fullname || prev.fullname,
          }));
        } else if (err.request) {
          console.error("Request Error:", err.request);
        } else {
          console.error("Error Details:", err.message);
        }
      })
      .finally(() => {
        setIsAddUserLoading(false);
      });
  };

  const handleCampaignActionRemove = () => {
    const payload = { action: "remove", user_id: selectedUser?.id };

    console.log(payload);

    campaignStaffAction(Number(id), payload)
      .then((response) => {
        console.log(response);
        getSingleProject(Number(id)).then((fetchedContent) => {
          setContent(fetchedContent);
          setSubVendorStaff(fetchedContent?.watchers);
        });
        setDeleteModal(false);
        setSelectedUser(null);
        toast.success("User removed successfully!");
      })
      .catch((error) => console.log(error));
  };

  const handleCampaignActionUpdate = () => {
    const payload = {
      action: "update",
      user_id: selectedUser?.id,
      role: addUserFormData.role,
    };

    console.log(payload);

    campaignStaffAction(Number(id), payload)
      .then((response) => {
        console.log(response);
        getSingleProject(Number(id)).then((fetchedContent) => {
          setContent(fetchedContent);
          setSubVendorStaff(fetchedContent?.watchers);
        });
        setAdjustmentModalVisible(false);
        setSelectedUser(null);
        toast.success("User role updated successfully!");
        setAddUserFormData({
          email: "",
          business_id: "",
          role: "",
          fullname: "",
          project_id: id,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleAddContactClick = () => {
    setNameDialogVisible(true);
  };

  const handleUserClick = (user: any) => {
    const mappedUser: User = {
      id: user.id,
      initials: user.user_profile.fullname?.slice(0, 2).toUpperCase() || "",
      fullname: user.user_profile.fullname || "",
      staff_email: user.user_profile.staff_email || "",
      role: user.user_profile.role || "",
      last_login: user.last_login
        ? format(parseISO(user.last_login), "dd MMMM yyyy")
        : "",
      member_since: user.created
        ? format(parseISO(user.created), "dd MMMM yyyy")
        : "",
    };
    setSelectedUser(mappedUser);
  };

  const handleAdjustmentClick = () => {
    setAdjustmentModalVisible(true);
  };

  useEffect(() => {
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent) => {
        setSubVendorStaff(fetchedContent?.watchers);
        setContent(fetchedContent);
      });
    }
  }, [id]);

  useEffect(() => {
    const content: any = ls.get("Profile", { decrypt: true });
    setUserRole(content?.user?.user_profile?.role);
  }, []);

  useEffect(() => {
    if (!!content?.subvendor?.id) {
      getBusinessStaff(Number(!!content?.subvendor?.id)).then(
        (fetchedStaffs: any) => {
          console.log("FETCHED STAFFS", fetchedStaffs);
          setStaffSuggestions(fetchedStaffs);
        }
      );
    }
  }, [content]);

  const handleStaffSelect = (staff: any) => {
    // Update form with selected staff member's details
    setAddUserFormData((prevData) => ({
      ...prevData,
      fullname: staff.fullname,
      role: staff.role,
    }));
  };

  const predefinedColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-gray-500",
  ];

  const [showIcons, setShowIcons] = useState(false);
  const originalTitle = content?.title || "";

  const handleDownloadPDF = () => {
    const downloadToast = toast.loading("Downloading PDF...");
    const input = document.getElementById("pdf-content");

    if (input) {
      // Temporarily set the body overflow to hidden to prevent scrolling during capture
      document.body.style.overflow = "hidden";

      // Get the full height of the content
      const fullHeight = input.scrollHeight;

      // Use html2canvas to capture the entire content
      html2canvas(input, {
        scale: 2, // Increase scale for better quality
        height: fullHeight, // Set the height to the full content height
        windowHeight: fullHeight, // Ensure the window height matches the content height
        scrollY: -window.scrollY, // Adjust for current scroll position
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("landscape");

          // PDF page dimensions in mm (A4 landscape: 297mm x 210mm)
          const pageWidth = 297;
          const pageHeight = 210;

          // Calculate the total height of the content in mm
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * pageWidth) / canvas.width;

          // Split the content into multiple pages if it exceeds the page height
          let position = 0; // Track the position of the content
          while (position < imgHeight) {
            if (position > 0) {
              pdf.addPage(); // Add a new page if not the first page
            }

            // Add the image to the current page
            pdf.addImage(
              imgData,
              "PNG",
              0, // X position
              -position, // Y position (negative to shift the content up)
              imgWidth,
              imgHeight
            );

            // Move the position down by the page height
            position += pageHeight;
          }

          // Save the PDF
          pdf.save("dashboard.pdf");

          // Update the toast notification
          toast.update(downloadToast, {
            render: "PDF Downloaded",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          toast.update(downloadToast, {
            render: "Failed to download PDF",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        })
        .finally(() => {
          // Restore the body overflow
          document.body.style.overflow = "";
        });
    }
  };

  const handleExportCSV = () => {
    if (!content || Object.keys(content).length === 0) {
      toast.error("No data available to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "Code",
      "Description",
      "Title",
      "Total Audience Growth",
      "Total Investment",
      "Total Revenue",
    ];

    // Extract required fields from content
    const row = [
      content.code ?? "",
      content.description ? content.description.replace(/,/g, ";") : "",
      content.title ? content.title.replace(/,/g, ";") : "",
      content.total_audience_growth ?? 0,
      content.total_investment ?? 0,
      content.total_revenue ?? 0,
    ].join(",");

    // Create CSV content (single row)
    const csvContent = [headers.join(","), row].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "project_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };

  return (
    <DashboardLayout withBorder={false}>
      <div
        id="pdf-content"
        className=" relative "
        style={{ marginBottom: "80px" }}
      >
        <div className="space-y-[5px] ">
          <div className="text-[#919393] flex items-center gap-[5px] text-[0.875rem]">
            <p className=" uppercase text-[#5e5e5e] tracking-[.1rem]">
              {content?.vendor?.organization_name}
            </p>
            <p className="uppercase p-[4px] border border-[#d5d9db] bg-[#f7fcff] rounded tracking-[.1rem]">
              {content?.subvendor?.organization_name}
            </p>
          </div>
          <div className="pr-[40px]">
            {toggleNotifications ? (
              <div className="flex items-center">
                <div className="">
                  <input
                    type="text"
                    className="font-[900] text-[45px] text-[#000000] focus:outline-none"
                    value={content?.title}
                    onChange={(e) => {
                      setContent({ ...content, title: e.target.value });
                      setShowIcons(true);
                    }}
                  />
                  {showIcons && (
                    <div className="flex items-center gap-[5px] my-[20px]">
                      <FaCheckCircle
                        size={24}
                        className="text-blue-500 cursor-pointer"
                        onClick={() => {
                          setShowIcons(false);
                        }}
                      />
                      <GiCancel
                        size={24}
                        className="text-red-500 cursor-pointer"
                        onClick={() => {
                          setContent({ ...content, title: originalTitle });
                          setShowIcons(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="font-[900] text-[45px] text-[#000000] flex-grow">
                {content?.title}
              </p>
            )}

            <div className="my-[20px] gap-[20px] flex-wrap flex items-center justify-between">
              <div className=" flex space-x-[5px] ">
                {subvendorStaff?.map((user: any, index: any) => (
                  <div key={index} className="relative group">
                    <p
                      className={`${predefinedColors[index % predefinedColors.length]}  tracking-[.2rem]  text-[12px] font-[700] font-Poppins rounded-full h-[50px] w-[50px] flex items-center justify-center text-white text-center cursor-pointer`}
                      onClick={() => handleUserClick(user)}
                    >
                      {user?.user_profile?.fullname?.slice(0, 2).toUpperCase()}
                    </p>

                    <div className="font-IBM absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs  px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-nowrap">
                      {user?.user_profile?.fullname}
                    </div>
                  </div>
                ))}

                {["Manager"].includes(userRole) && (
                  <div className="relative group">
                    <p
                      className="bg-[#ffdead] text-[#000000] rounded-full w-[50px] h-[50px] flex items-center justify-center  text-center cursor-pointer"
                      onClick={showDialog}
                    >
                      <HiOutlineUserAdd size={14} />
                    </p>
                  </div>
                )}
              </div>

              {["Supervisor", "Manager"].includes(userRole) && (
                <div className="relative">
                  {toggleNotifications && (
                    <div className="fixed top-0 left-0 w-full h-[50px] flex items-center justify-center bg-blue-500 text-white text-[15px] font-[500] font-IBM z-[9999999]">
                      Edit mode
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <p className="font-IBM font-[400] text-[16px]">Edit mode</p>
                    <InputSwitch
                      id="phone"
                      checked={toggleNotifications}
                      onChange={(e) => {
                        if (e.value) {
                          setEditMode(true);
                        } else {
                          setEditModeOff(true);
                        }
                      }}
                      className="custom-switch"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {["Manager"].includes(userRole) && (
            <div className=" ">
              <ProjectSingleInsight />
            </div>
          )}
        </div>

        <form onSubmit={handleAddUserSubmit}>
          <div
            className={`custom-dialog-overlay ${
              visible
                ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
                : "hidden"
            }`}
          >
            <Dialog
              header={
                <div className="flex items-center gap-2 tracking-[.1rem] text-[12px] text-[#212529] !font-[500] relative">
                  + <span>ADD MEMBERS</span>
                </div>
              }
              visible={visible}
              onHide={hideDialog}
              breakpoints={{ "960px": "75vw", "640px": "100vw" }}
              style={{ width: "40vw" }}
              className="custom-dialog-overlay"
            >
              <div className="space-y-4">
                <p className="text-4xl font-bold text-[#000]">Collaborate</p>
                <div>
                  <EmailInputWithSuggestions
                    staffDetails={staffSuggestions}
                    value={addUserFormData.email}
                    name="email"
                    onChange={handleAddUserInputChange}
                    onStaffSelect={handleStaffSelect}
                    error={addUserErrors.email}
                    placeholder="Add email"
                    required
                  />
                </div>
                <div
                  className="flex items-center gap-[5px] cursor-pointer"
                  onClick={handleAddContactClick}
                >
                  <IoMdAddCircleOutline size={20} />
                  <p>Add Contact</p>
                  {addUserErrors.fullname && (
                    <p className="font-IBM text-sm text-red-500">
                      {addUserErrors.fullname}
                    </p>
                  )}
                </div>
                <div className="flex gap-[10px] items-end">
                  <div className=" w-full">
                    <SelectInput
                      name="role"
                      value={addUserFormData.role}
                      onChange={handleAddUserInputChange2}
                      placeholder="Choose Role"
                      options={[
                        { value: "Manager", label: "Manager" },
                        { value: "Supervisor", label: "Supervisor" },
                        { value: "Agent", label: "Agent" },
                      ]}
                      error={addUserErrors.role}
                    />
                  </div>
                  <button
                    onClick={handleAddUserSubmit}
                    // disabled={isAddUserLoading}
                    className=" text-[14px] bg-[#000] hover:bg-orange-500 w-full py-[15px] px-[12px] h-full rounded-[8px] flex items-center justify-center space-x-2"
                  >
                    <IoIosAdd className="text-white" />
                    <span className="text-white">Add </span>
                  </button>
                </div>
              </div>
            </Dialog>
          </div>

          <div
            className={`custom-dialog-overlay ${
              nameDialogVisible
                ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
                : "hidden"
            }`}
          >
            <Dialog
              header="Enter Full Name"
              visible={nameDialogVisible}
              onHide={hideNameDialog}
              breakpoints={{ "960px": "75vw", "640px": "100vw" }}
              style={{ width: "50vw" }}
              className="custom-dialog-overlay"
            >
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    required
                    name="fullname"
                    label="Enter Full Name"
                    value={addUserFormData.fullname}
                    onChange={handleAddUserInputChange}
                    error={addUserErrors.fullname}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    label="Cancel"
                    icon="pi pi-times"
                    onClick={hideNameDialog}
                  />
                  <Button
                    label="Submit"
                    icon="pi pi-check"
                    onClick={hideNameDialog}
                    disabled={!addUserFormData.fullname}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <InputSwitch
                    id="phone"
                    checked={broadcast}
                    onChange={(e) => setBroadcast(e.value)}
                    className="custom-switch"
                  />
                  <p>Broadcast</p>
                </div>
              </div>
            </Dialog>
          </div>
        </form>
        {["Manager", "Supervisor"].includes(userRole) && (
          <>
            <InsightChart
              editMode={toggleNotifications}
              handleDownloadPage={handleDownloadPDF}
              handleDownloadData={handleExportCSV}
            />
            <div className="  ">
              <ScheduleProject
                filterIcon={false}
                isDateClickEnabled={false}
                isProjectPage={true}
              />
            </div>
          </>
        )}

        <div
          className={`custom-dialog-overlay ${
            selectedUser
              ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
              : "hidden"
          }`}
        >
          <Dialog
            header={
              <div className="flex items-center gap-2 tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400] relative">
                <Tooltip info="Staff user information" />

                <span>MEMBER INFORMATION</span>
              </div>
            }
            visible={selectedUser !== null}
            onHide={() => setSelectedUser(null)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "30vw" }}
            headerClassName=" text-[12px] text-[#212529] font-[500]"
            className="custom-dialog-overlay font-IBM"
          >
            {selectedUser && (
              <div className="space-y-4 font-IBM">
                <p className="text-[30px] text-[#212529] font-[600]">
                  {selectedUser.fullname}
                </p>
                <div className=" ">
                  <p className="text-[16px] font-[400] text-[#212529]">
                    Email{" "}
                  </p>
                  <p className=" font-[600] text-[16px] text-[#212529]">
                    {" "}
                    {selectedUser.staff_email}
                  </p>
                </div>
                <div className=" text-[16px] font-[400] ">
                  <p className="text-[#212529]">Role </p>
                  <p className=" text-[#01a733] font-[600]">
                    {selectedUser.role}
                  </p>
                </div>
                <div className=" text-[16px] font-[400] text-[#212529]">
                  <p className=" text-[#212529]">Member since </p>
                  <p className=" font-[600]">{selectedUser.member_since}</p>
                </div>
                <div className=" text-[16px] font-[400] text-[#212529]">
                  <p className="text-[#212529]">Last Login</p>
                  <p className=" font-[600]">{selectedUser.last_login}</p>
                </div>

                <div className=" ">
                  <div
                    className=" px-[16px] py-[8px] rounded bg-black text-white inline-block cursor-pointer mt-[10px]"
                    onClick={() => setDeleteModal(true)}
                  >
                    <FaUserMinus />
                  </div>
                  <div
                    className=" px-[16px] py-[8px] text-black inline-block cursor-pointer"
                    onClick={handleAdjustmentClick}
                  >
                    <HiAdjustmentsHorizontal />
                  </div>
                </div>
                <div className=" hidden">
                  <div className="flex justify-end space-x-2">
                    <Button
                      label="Close"
                      icon="pi pi-times"
                      onClick={() => setSelectedUser(null)}
                    />
                  </div>
                </div>
              </div>
            )}
          </Dialog>
        </div>
        <div
          className={`custom-dialog-overlay ${
            adjustmentModalVisible
              ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
              : "hidden"
          }`}
        >
          <Dialog
            visible={adjustmentModalVisible}
            onHide={() => setAdjustmentModalVisible(false)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "30vw" }}
            className="custom-dialog-overlay"
          >
            <div className="space-y-4 font-IBM">
              <p className="text-[16px] font-[400]">MANAGE ACCESS</p>
              <div className=" w-full">
                <SelectInput
                  name="role"
                  value={addUserFormData.role}
                  onChange={handleAddUserInputChange2}
                  // labelText="Choose Role"
                  options={[
                    { value: "Manager", label: "Manager" },
                    { value: "Supervisor", label: "Supervisor" },
                    { value: "Agent", label: "Agent" },
                    { value: "Vendor", label: "Vendor" },
                    { value: "Subvendor", label: "Subvendor" },
                  ]}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  label="Save"
                  onClick={() => handleCampaignActionUpdate()}
                  className=" px-[16px] py-[8px] text-white rounded-[8px] bg-blue-500"
                />
              </div>
            </div>
          </Dialog>
        </div>
        <div
          className={`custom-dialog-overlay ${
            deleteModal
              ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
              : "hidden"
          }`}
        >
          <Dialog
            visible={deleteModal}
            onHide={() => setDeleteModal(false)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "30vw" }}
            className="custom-dialog-overlay"
          >
            <div className="space-y-4 font-IBM">
              <p className="text-[16px] font-[400] font-IBM">
                Are you sure you want to remove this profile from this project?
              </p>

              <div className="flex justify-end space-x-2">
                <Button
                  label="OK"
                  onClick={() => handleCampaignActionRemove()}
                  className=" px-[16px] py-[8px] text-white rounded-[8px] bg-blue-500"
                />
                <Button
                  label="Cancel"
                  onClick={() => setDeleteModal(false)}
                  className=" px-[16px] py-[8px] text-white rounded-[8px] bg-slate-500"
                />
              </div>
            </div>
          </Dialog>
        </div>

        <div
          className={`custom-dialog-overlay ${
            editMode
              ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
              : "hidden"
          }`}
        >
          <Dialog
            visible={editMode}
            onHide={() => setEditMode(false)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "30vw" }}
            className="custom-dialog-overlay"
          >
            <div className="space-y-4 font-IBM">
              <p className="text-[16px] font-[400]">
                Do you want to switch to edit mode?
              </p>

              <div className="flex justify-end space-x-2">
                <Button
                  label="Yes"
                  onClick={() => {
                    setEditMode(false);
                    setToggleNotifications(true);
                  }}
                  className=" px-[16px] py-[8px] text-white rounded-[8px] bg-blue-500"
                />

                <Button
                  label="No"
                  onClick={() => {
                    setEditMode(false);
                    setToggleNotifications(false);
                  }}
                  className=" px-[16px] py-[8px] text-[#000000] rounded-[8px] bg-slate-100"
                />
              </div>
            </div>
          </Dialog>
        </div>

        <div
          className={`custom-dialog-overlay ${
            editModeOff
              ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
              : "hidden"
          }`}
        >
          <Dialog
            visible={editModeOff}
            onHide={() => setEditModeOff(false)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "30vw" }}
            className="custom-dialog-overlay"
          >
            <div className="space-y-4 font-IBM">
              <p className="text-[16px] font-[400]">
                Make sure all your changes are saved before you proceed. Please
                note that any unsaved changes will be lost permanently.
              </p>

              <div className="flex justify-end space-x-2">
                <Button
                  label="Yes"
                  onClick={() => {
                    setEditModeOff(false);
                    setToggleNotifications(false);
                  }}
                  className=" px-[16px] py-[8px] text-white rounded-[8px] bg-blue-500"
                />

                <Button
                  label="No"
                  onClick={() => {
                    setEditModeOff(false);
                    setToggleNotifications(true);
                  }}
                  className=" px-[16px] py-[8px] text-[#000000] rounded-[8px] bg-slate-100"
                />
              </div>
            </div>
          </Dialog>
        </div>

        <div className=" mb-[100px]">
          <DropsList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
