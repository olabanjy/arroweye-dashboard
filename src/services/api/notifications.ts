import ls from "localstorage-slim";
import apiRequest from "@/Server/Api";
import { ContentItem } from "@/types/contents";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

export const getProjectNotifications = async (
  id: number,
): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/notifications/`,
      data: null,
      requireToken: true,
    });

    if (response && typeof response === "object") {
      return response;
    } else {
      console.error("Invalid DSP stats response structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getNotification = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/notification/notification/`,
      data: null,
      requireToken: true,
    });

    ls.set("Notifications", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const markNotificationsAsRead = async (
  payload: any,
): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "POST",
      url: `/api/v1/notification/notification/update-notifications/`,
      data: payload,
      requireToken: true,
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};
