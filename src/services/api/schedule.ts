import apiRequest from "@/Server/Api";
import { ContentItem, EventsItem } from "@/types/contents";
import ls from "localstorage-slim";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

export const CreateEvent = async (payload: unknown): Promise<any> => {
  const response = await apiRequest({
    method: "POST",
    url: `/api/v1/projects/schedule/events/create/`,
    data: payload,
    requireToken: true,
  });

  return response;
};

export const RescheduleEvent = async (payload: unknown): Promise<any> => {
  const response = await apiRequest({
    method: "POST",
    url: `/api/v1/projects/schedule/events/reschedule/`,
    data: payload,
    requireToken: true,
  });

  return response;
};

export const getEvents = async (): Promise<EventsItem[]> => {
  const response = await apiRequest<EventsItem[]>({
    method: "GET",
    url: `/api/v1/projects/schedule/events/`,
    requireToken: true,
  });

  return response;
};

const isNetworkError = (error: any) =>
  !error?.response ||
  error?.code === "ERR_NETWORK" ||
  error?.code === "ECONNABORTED" ||
  error?.message?.includes("timeout") ||
  error?.message?.includes("Network Error");

export const deleteEvents = async (id: number): Promise<any> => {
  const response = await apiRequest({
    method: "DELETE",
    url: `/api/v1/projects/schedule/events/${id}`,
    requireToken: true,
    skipErrorHandling: true,
  });

  return response;
};

export const getStoredProjectEvents = (id: number): EventsItem[] => {
  const content =
    ls.get(`ProjectsEvents:${id}`, { decrypt: true }) ||
    ls.get("ProjectsEvents", { decrypt: true });

  return Array.isArray(content) ? (content as EventsItem[]) : [];
};

export const getProjectsEvents = async (id: number): Promise<EventsItem[]> => {
  try {
    const response = await apiRequest<EventsItem[]>({
      method: "GET",
      url: `/api/v1/projects/${id}/events/`,
      data: null,
      requireToken: true,
      skipErrorHandling: true,
      silent: true,
    });

    ls.set(`ProjectsEvents:${id}`, response, { encrypt: true });
    ls.set("ProjectsEvents", response, { encrypt: true });

    return Array.isArray(response) ? response : [];
  } catch (error: unknown) {
    if (isNetworkError(error)) {
      return getStoredProjectEvents(id);
    }

    throw error;
  }
};

export const getStoredEvent = (): ContentItem[] | null => {
  const content = ls.get("Events", { decrypt: true });

  return content as ContentItem[];
};
