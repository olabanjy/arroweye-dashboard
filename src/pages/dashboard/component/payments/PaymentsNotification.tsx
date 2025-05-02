import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { markNotificationsAsRead } from "@/services/api";
import PaymentMomentNotificationCard from "./PaymentMomentNotificationCard";

const PaymentsNotification: React.FC<any> = ({
  notification,
  notificationScrolled,
  setNotificationScrolled,
}) => {
  // Track which notifications have been viewed in this session
  const [viewedNotifications, setViewedNotifications] = useState<Set<number>>(
    new Set()
  );

  // Store references to each notification element
  const notificationRefs = useRef<Map<number, HTMLDivElement | null>>(
    new Map()
  );

  // Store the notification data for lookup
  const notificationData = useRef<Map<number, any>>(new Map());

  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Function to mark a notification as read
  const markAsRead = (itemId: number) => {
    // Get the notification data
    const item = notificationData.current.get(itemId);

    // Skip if already marked as viewed in this session or if read is already true
    if (viewedNotifications.has(itemId) || (item && item.read === true)) {
      console.log(
        `Skipping notification ${itemId} - already read: ${item?.read}`
      );
      return;
    }

    console.log(`Marking notification ${itemId} as read`);

    // Create payload with the format the endpoint expects
    const payload = { notification_ids: [itemId] };

    // Call the API endpoint
    markNotificationsAsRead(payload)
      .then(() => {
        // Update local state to prevent duplicate API calls
        setViewedNotifications((prev) => {
          const newSet = new Set(prev);
          newSet.add(itemId);
          return newSet;
        });
        setNotificationScrolled(!notificationScrolled);

        // Also update the notification data in our ref map
        if (item) {
          notificationData.current.set(itemId, { ...item, read: true });
        }

        console.log(`Successfully marked notification ${itemId} as read`);
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  // Update notification data map when props change
  useEffect(() => {
    if (notification && notification.length > 0) {
      notification.forEach((item: any) => {
        notificationData.current.set(item.id, item);
      });
    }

    // Clear items no longer in the notification list
    const currentIds = notification
      ? notification.map((item: any) => item.id)
      : [];
    const storedIds = Array.from(notificationData.current.keys());

    storedIds.forEach((id) => {
      if (!currentIds.includes(id)) {
        notificationData.current.delete(id);
      }
    });
  }, [notification]);

  // Set up the intersection observer once on component mount
  useEffect(() => {
    // Create a single observer that will be reused for all notifications
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the notification ID from the data attribute
            const itemId = Number(
              entry.target.getAttribute("data-notification-id")
            );
            if (!itemId) return;

            // Get the notification data
            const item = notificationData.current.get(itemId);

            // Only proceed if the notification exists and isn't already read
            if (item && item.read === false) {
              console.log(`Notification ${itemId} is now visible and unread`);

              // Item is visible and unread, mark as read
              markAsRead(itemId);
            } else {
              console.log(
                `Notification ${itemId} is visible but already read: ${item?.read}`
              );
            }

            // Unobserve after processing
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 50% of the item is visible
    );

    // Observe all notification elements that need tracking
    if (notification && notification.length > 0) {
      notification.forEach((item: any) => {
        // Skip already viewed notifications or ones already marked as read
        if (viewedNotifications.has(item.id) || item.read === true) return;

        // Get the element reference
        const element = notificationRefs.current.get(item.id);
        if (element) {
          console.log(
            `Setting up observer for notification ${item.id} (read: ${item.read})`
          );
          observer.observe(element);
        }
      });
    }

    // Clean up on component unmount
    return () => {
      observer.disconnect();
    };
  }, [notification, viewedNotifications]);

  // Update refs when notifications change
  useEffect(() => {
    // For each ref that exists but is no longer in the notification list, remove it
    const currentIds = notification
      ? notification.map((item: any) => item.id)
      : [];
    const storedIds = Array.from(notificationRefs.current.keys());

    storedIds.forEach((id) => {
      if (!currentIds.includes(id)) {
        notificationRefs.current.delete(id);
      }
    });
  }, [notification]);

  // Function to store refs for each notification element
  const setNotificationRef = (
    element: HTMLDivElement | null,
    itemId: number
  ) => {
    if (element) {
      notificationRefs.current.set(itemId, element);
    }
  };

  return (
    <div>
      <div className="space-y-[20px]">
        {!!notification && notification.length > 0 ? (
          notification?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                ref={(element) => setNotificationRef(element, item.id)}
                data-notification-id={item.id}
              >
                <PaymentMomentNotificationCard
                  timeAgo={formatRelativeDate(item.created)}
                  message={item.content}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  actions={item.actions}
                  iconClass={item.icon}
                />
              </div>
            );
          })
        ) : (
          <div className="flex flex-col gap-10">
            <p className="lg:text-lg">
              You do not have payments notifications currently
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsNotification;
