import ls from "localstorage-slim";
import apiRequest from "@/Server/Api";
import { EventsItem, ContentItem } from "@/types/contents";

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

export const deleteEvents = async (id: number): Promise<any> => {
  const response = await apiRequest({
    method: "DELETE",
    url: `/api/v1/projects/schedule/events/${id}`,
    requireToken: true,
    skipErrorHandling: true,
  });

  return response;
};

export const getProjectsEvents = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/${id}/events/`,
      data: null,
      requireToken: true,
    });

    ls.set("ProjectsEvents", response, { encrypt: true });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredEvent = (): ContentItem[] | null => {
  const content = ls.get("Events", { decrypt: true });

  return content as ContentItem[];
};
