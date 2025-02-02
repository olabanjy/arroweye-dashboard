import React, { useEffect, useState } from "react";
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
import { AddStaff, getBusinessStaff, getSingleProject } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";
import ProjectSingleInsight from "./component/ProjectSingleInsight";
import Schedule from "../schedule/component/Schedule";
import InsightChart from "./component/InsightChart";
import { Tooltip } from "../drops";
import DropsList from "../dropss/component/DropsList";
import { GiCancel } from "react-icons/gi";

interface User {
  initials: string;
  fullname: string;
  email: string;
}

// interface AddUserFormData = {
//   email: string;
//   business_id: string;
//   role: string | number;
//   fullname: string;
// };

const ProjectDetails = () => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [subvendorStaff, setSubVendorStaff] = useState<ContentItem[] | null>(
    null
  );

  console.log(content);

  const { query } = useRouter();
  const { id } = query;
  const [visible, setVisible] = useState(false);
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
  }>({
    email: "",
    business_id: "",
    role: "",
    fullname: "",
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
      console.log("Updated form data:", updatedData);
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
      console.log("Updated form data:", updatedData);
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
      console.log("Validation errors:", newAddUserErrors);
      setAddUserErrors(newAddUserErrors);
      setIsAddUserLoading(false);
      return;
    }

    const payload = {
      ...addUserFormData,
      business_id: 1,
      role: content?.subvendor,
    };

    console.log("Form data with business_id added:", payload);

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
        });

        getSingleProject(Number(id)).then((fetchedContent) => {
          setContent(fetchedContent);
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
        console.log(
          "Form submission completed. Final form data:",
          addUserFormData
        );
      });
  };

  const handleAddContactClick = () => {
    setNameDialogVisible(true);
  };

  const handleUserClick = (user: ContentItem) => {
    const mappedUser: User = {
      initials: user.fullname?.slice(0, 2).toUpperCase() || "",
      fullname: user.fullname || "",
      email: user.email || "",
    };
    setSelectedUser(mappedUser);
  };

  const handleAdjustmentClick = () => {
    setAdjustmentModalVisible(true);
  };

  useEffect(() => {
    getSingleProject(Number(id)).then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, [id]);

  console.log(content?.subvendor?.id);

  useEffect(() => {
    if (content?.subvendor?.id) {
      getBusinessStaff(content.subvendor.id).then(
        (fetchedContent: ContentItem[] | null) => {
          setSubVendorStaff(fetchedContent);
        }
      );
    }
  }, [content?.subvendor?.id]);

  console.log(subvendorStaff);

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

  return (
    <DashboardLayout withBorder={false}>
      <div className="relative">
        <div className="space-y-[5px] ">
          <div className="text-[#919393] flex items-center gap-[5px] text-[0.875rem]">
            <p className=" uppercase text-[#5e5e5e] tracking-[.1rem]">
              {content?.vendor?.organization_name}
            </p>
            <p className="uppercase p-[4px] border border-[#d5d9db] bg-[#f7fcff] rounded tracking-[.1rem]">
              {content?.subvendor?.organization_name}
            </p>
          </div>

          <div className="  pr-[40px]">
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
                {subvendorStaff?.map((user, index) => (
                  <div key={index} className="relative group">
                    <p
                      className={`${predefinedColors[index % predefinedColors.length]}  tracking-[.2rem]  text-[12px] font-[700] font-Poppins rounded-full h-[50px] w-[50px] flex items-center justify-center text-white text-center cursor-pointer`}
                      onClick={() => handleUserClick(user as ContentItem)}
                    >
                      {user.fullname?.slice(0, 2).toUpperCase()}
                    </p>

                    <div className="font-IBM absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs  px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-nowrap">
                      {user?.fullname}
                    </div>
                  </div>
                ))}

                <div className="relative group">
                  <p
                    className="bg-[#ffdead] text-[#000000] rounded-full w-[50px] h-[50px] flex items-center justify-center  text-center cursor-pointer"
                    onClick={showDialog}
                  >
                    <HiOutlineUserAdd size={14} />
                  </p>
                </div>
              </div>

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
            </div>
          </div>

          <div className=" ">
            <ProjectSingleInsight />
          </div>
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
                  <Input
                    type="email"
                    placeholder="Add email"
                    name="email"
                    required
                    value={addUserFormData.email}
                    onChange={handleAddUserInputChange}
                    error={addUserErrors.email}
                  />
                </div>
                <div
                  className="flex items-center gap-[5px] cursor-pointer"
                  onClick={handleAddContactClick}
                >
                  <IoMdAddCircleOutline size={20} />
                  <p>Add Contact</p>
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
                        { value: "LeadAdmin", label: "LeadAdmin" },
                        { value: "Supervisor", label: "Supervisor" },
                        { value: "Agent", label: "Agent" },
                        { value: "Vendor", label: "Vendor" },
                        { value: "Subvendor", label: "Subvendor" },
                      ]}
                    />
                  </div>
                  <button
                    onClick={handleAddUserSubmit}
                    disabled={isAddUserLoading}
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

        <InsightChart editMode={toggleNotifications} />

        <div className="  ">
          <Schedule filterIcon={false} />
        </div>

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
                <Tooltip info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted." />

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
                    {selectedUser.email}
                  </p>
                </div>
                <div className=" text-[16px] font-[400] ">
                  <p className="text-[#212529]">Role </p>
                  <p className=" text-[#01a733] font-[600]">Agent</p>
                </div>
                <div className=" text-[16px] font-[400] text-[#212529]">
                  <p className=" text-[#212529]">Member since </p>
                  <p className=" font-[600]">July 20, 2021</p>
                </div>
                <div className=" text-[16px] font-[400] text-[#212529]">
                  <p className="text-[#212529]">Last Login</p>
                  <p className=" font-[600]">May 2, 2024</p>
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
                    { value: "LeadAdmin", label: "LeadAdmin" },
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
                  onClick={() => setAdjustmentModalVisible(false)}
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
                  onClick={() => setDeleteModal(false)}
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
