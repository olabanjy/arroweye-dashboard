import React, { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/layout";
import { HiOutlineUserAdd } from "react-icons/hi";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Input } from "@/components/ui/input";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";
import { SelectInput } from "@/components/ui/selectinput";
import { FaUserMinus } from "react-icons/fa";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { AddStaff, getSingleProject } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";
import ProjectSingleInsight from "./component/ProjectSingleInsight";
import Schedule from "../schedule/component/Schedule";
import InsightChart from "./component/InsightChart";

const users = [
  { initials: "JJ", fullName: "John Jerome", email: "john@example.com" },
  { initials: "EO", fullName: "Emily O'Connor", email: "emily@example.com" },
  { initials: "MD", fullName: "Michael Douglas", email: "michael@example.com" },
  { initials: "SO", fullName: "Sarah O'Neil", email: "sarah@example.com" },
];

interface User {
  initials: string;
  fullName: string;
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

  const { query } = useRouter();
  const { id } = query;
  const [visible, setVisible] = useState(false);
  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [broadcast, setBroadcast] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
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

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleAdjustmentClick = () => {
    setAdjustmentModalVisible(true);
  };

  useEffect(() => {
    getSingleProject(Number(id)).then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, [id]);

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

  return (
    <DashboardLayout withBorder={false}>
      <div className="relative">
        <div className="space-y-[50px] ">
          <div className="text-[#919393] flex items-center gap-[10px] text-[0.875rem]">
            <p className="text-[#5e5e5e] tracking-[.1rem]">KHAID</p>
            <p className="p-[4px] border border-[#d5d9db] bg-[#f7fcff] rounded tracking-[.1rem]">
              NEVILLE RECORDS
            </p>
          </div>
          <div className=" grid gap-[20px] md:flex items-end md:justify-between">
            <div>
              <p className="font-extrabold text-5xl text-[#000000]">Jolie</p>
              <div className="mt-[20px] flex items-center gap-[5px] relative">
                {users.map((user, index) => (
                  <div key={index} className="relative group">
                    <p
                      className={`${predefinedColors[index % predefinedColors.length]} tracking-[.1rem] text-[12px] font-[700] font-Poppins text-white rounded-full p-4 w-[50px] h-[50px] flex items-center justify-center text-center cursor-pointer`}
                      onClick={() => handleUserClick(user)}
                    >
                      {user.initials}
                    </p>

                    <div className="font-IBM absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs  px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-nowrap">
                      {user.fullName}
                    </div>
                  </div>
                ))}

                <div className="relative group">
                  <p
                    className="bg-[#ffdead] text-[#000000] rounded-full p-4 w-[50px] h-[50px] flex items-center justify-center text-center cursor-pointer"
                    onClick={showDialog}
                  >
                    <HiOutlineUserAdd size={24} />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <p className=" font-IBM font-[400] text-[16px]">Edit mode</p>
              <InputSwitch
                id="phone"
                checked={toggleNotifications}
                onChange={(e) => setToggleNotifications(e.value)}
                className="custom-switch"
              />
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
              header="Add Members"
              visible={visible}
              onHide={hideDialog}
              breakpoints={{ "960px": "75vw", "640px": "100vw" }}
              style={{ width: "50vw" }}
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
                <div className="flex gap-[10px] items-center">
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
                  <div className=" w-full">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleAddUserSubmit}
                        disabled={isAddUserLoading}
                        className="bg-[#000] hover:bg-orange-500 w-full p-[12px] h-full rounded flex items-center justify-center space-x-2"
                      >
                        <IoIosAdd className="text-white" />
                        <span className="text-white">Add User</span>
                      </button>
                    </div>
                  </div>
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

        <InsightChart />

        <div className=" mt-[50px] ">
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
            header=" Member Information"
            visible={selectedUser !== null}
            onHide={() => setSelectedUser(null)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "50vw" }}
            className="custom-dialog-overlay"
          >
            {selectedUser && (
              <div className="space-y-4">
                <p className="text-3xl font-bold">{selectedUser.fullName}</p>
                <div className=" text-[14px]">
                  <p className="text-[14px]">Email: </p>
                  <p className=" font-bold"> {selectedUser.email}</p>
                </div>
                <div className=" text-[14px]">
                  <p className="text-[14px]">Role </p>
                  <p className=" font-bold">Agent</p>
                </div>
                <div className=" text-[14px]">
                  <p className="text-[14px]">Member since </p>
                  <p className=" font-bold">July 20, 2021</p>
                </div>
                <div className=" text-[14px]">
                  <p className="text-[14px]">Last addUser</p>
                  <p className=" font-bold">May 2, 2024</p>
                </div>

                <div
                  className=" px-[16px] py-[8px] rounded bg-black text-white inline-block cursor-pointer"
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
                <div className="flex justify-end space-x-2">
                  <Button
                    label="Close"
                    icon="pi pi-times"
                    onClick={() => setSelectedUser(null)}
                  />
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
            <div className="space-y-4">
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
            <div className="space-y-4">
              <p className="text-[16px] font-[400]">
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
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
