import React, { useState, useEffect } from "react";
import DashboardLayout from "@/pages/dashboard/layout";
import Head from "next/head";
import Image from "next/image";

const SpinsNotifications = () => {
  const [notification, setNotification] = useState({
    content:
      "Great news! Run This Town was just played by DJ Shemztex at Front Back Restaurant, Accra, Ghana",
    timeAgo: "1 min ago",
  });

  useEffect(() => {
    // Function to load notification from localStorage
    const loadNotification = () => {
      const storedData = localStorage.getItem("spinNotification");
      if (storedData) {
        try {
          const spinNotification = JSON.parse(storedData);
          setNotification({
            content: spinNotification.content || notification.content,
            timeAgo: spinNotification.timeAgo || notification.timeAgo,
          });
        } catch (error) {
          console.error("Error parsing spinNotification:", error);
        }
      }
    };

    // Load notification on mount
    loadNotification();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "spinNotification" && e.newValue) {
        try {
          const spinNotification = JSON.parse(e.newValue);
          setNotification({
            content: spinNotification.content || notification.content,
            timeAgo: spinNotification.timeAgo || notification.timeAgo,
          });
        } catch (error) {
          console.error("Error parsing spinNotification:", error);
        }
      }
    };

    // Listen for custom event (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadNotification();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "spinNotificationUpdate",
      handleCustomStorageChange
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "spinNotificationUpdate",
        handleCustomStorageChange
      );
    };
  }, []);

  return (
    <>
      <Head>
        <title>Campaigns - Arroweye</title>
      </Head>
      <DashboardLayout>
        <div
          className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
          style={{ backgroundImage: "url(/spinsbg.png)" }}
        >
          <div
            className="flex items-center justify-center w-[338px] h-[174px]"
            style={{ backgroundImage: "url(/Notificationheader.png)" }}
          >
            <Image
              src="/spinslogomodal.svg"
              alt="spinslogo"
              width={86}
              height={86}
            />
          </div>
          <div className="bg-[#252525] min-w-[338px] max-w-[338px] p-5">
            <div className="flex justify-between">
              <Image
                src="/albumicon.svg"
                alt="albumicon"
                width={24}
                height={24}
              />
              <p className="text-[#B0B0B0] text-xs">{notification.timeAgo}</p>
            </div>
            <div>
              <p className="text-white mt-3 pl-1">{notification.content}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SpinsNotifications;
