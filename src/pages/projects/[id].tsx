import React, { useState } from "react";
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

const ProjectDetails = () => {
  const [visible, setVisible] = useState(false);
  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [emailError, setEmailError] = useState("");
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

  const handleAddUser = () => {
    console.log("Adding user:", newUserEmail, newUserName);
    setVisible(false);
    setNameDialogVisible(false);
  };

  const handleAddContactClick = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (newUserEmail && emailRegex.test(newUserEmail)) {
      setEmailError("");
      setNameDialogVisible(true);
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleAdjustmentClick = () => {
    setAdjustmentModalVisible(true);
  };
  return (
    <DashboardLayout>
      <div className="space-y-[20px]">
        <div className="text-[#919393] flex items-center gap-[20px]">
          <p className="text-[#5e5e5e]">Khaid</p>
          <p className="p-[4px] border border-[#d5d9db] bg-[#f7fcff] rounded">
            Neville Records
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-extrabold text-5xl text-[#000000]">Jolie</p>
            <div className="mt-[20px] flex items-center gap-[10px]">
              {users.map((user, index) => (
                <div key={index} className="relative group">
                  <p
                    className="bg-red-500 text-white rounded-full p-4 w-[50px] h-[50px] flex items-center justify-center text-center cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.initials}
                  </p>
                  <div className="absolute bottom-[-30px] left-0 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {user.fullName}
                  </div>
                </div>
              ))}
              <div className="relative group">
                <p
                  className="bg-[#ffdead] text-[#000000] rounded-full p-4 w-[50px] h-[50px] flex items-center justify-center text-center cursor-pointer"
                  onClick={showDialog}
                >
                  <HiOutlineUserAdd size={30} />
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <p>Edit Mode</p>
            <InputSwitch
              id="phone"
              checked={toggleNotifications}
              onChange={(e) => setToggleNotifications(e.value)}
            />
          </div>
        </div>
      </div>

      <Dialog
        header=" Member Information"
        visible={selectedUser !== null}
        onHide={() => setSelectedUser(null)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
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
              <p className="text-[14px]">Last login</p>
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
      <Dialog
        visible={adjustmentModalVisible}
        onHide={() => setAdjustmentModalVisible(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "30vw" }}
      >
        <div className="space-y-4">
          <p className="text-[16px] font-[400]">MANAGE ACCESS</p>
          <div className=" w-full">
            <SelectInput
              options={[
                { value: "", label: "Choose Role" },
                { value: "manager", label: "Manager" },
                { value: "supervisor", label: "Supervisor" },
                { value: "agent", label: "Agent" },
              ]}
              className="h-full"
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
      <Dialog
        visible={deleteModal}
        onHide={() => setDeleteModal(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "30vw" }}
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

      <Dialog
        header="Add Members"
        visible={visible}
        onHide={hideDialog}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <div className="space-y-4">
          <p className="text-4xl font-bold text-[#000]">Collaborate</p>
          <div>
            <Input
              type="email"
              placeholder="Add email"
              required
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
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
                options={[
                  { value: "", label: "Choose Role" },
                  { value: "manager", label: "Manager" },
                  { value: "supervisor", label: "Supervisor" },
                  { value: "agent", label: "Agent" },
                ]}
                className="h-full"
              />
            </div>
            <div className=" w-full">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleAddUser}
                  disabled={!newUserEmail || !newUserName}
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

      <Dialog
        header="Enter Full Name"
        visible={nameDialogVisible}
        onHide={hideNameDialog}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              required
              label="Enter Full Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
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
              onClick={handleAddUser}
              disabled={!newUserName}
            />
          </div>
          <div className="flex items-center space-x-4">
            <InputSwitch
              id="phone"
              checked={broadcast}
              onChange={(e) => setBroadcast(e.value)}
            />
            <p>Broadcast</p>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProjectDetails;
