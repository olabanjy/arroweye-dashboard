import ls from "localstorage-slim";
import apiRequest from "@/Server/Api";
import { StaffItem } from "@/types/contents";
import { DropzonePayload } from "@/types/dropzone";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

export const getDropZones = async ({
  page = 1,
  search = "",
  year = "",
  month = "",
  vendor = "",
  subvendor = "",
  platform = "",
}: {
  page?: number;
  search?: string;
  year?: string;
  month?: string;
  vendor?: string;
  subvendor?: string;
  platform?: string;
}): Promise<any> => {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (year) params.year = year;
  if (month) params.month = month;
  if (vendor) params.vendor = vendor;
  if (subvendor) params.subvendor = subvendor;
  if (platform) params.platform = platform;

  const response = await apiRequest({
    method: "GET",
    url: `/api/v1/projects/general/dropzone/`,
    params,
    requireToken: true,
  });

  return response;
};

export const deleteDropZones = async (id: number): Promise<any> => {
  const response = await apiRequest({
    method: "DELETE",
    url: `/api/v1/projects/general/dropzone/${id}`,
    requireToken: true,
    skipErrorHandling: true,
  });
  return response;
};

export const getBusiness = async (): Promise<StaffItem[]> => {
  const response = await apiRequest<StaffItem[]>({
    method: "GET",
    url: `/api/v1/org/business/`,
    requireToken: true,
  });

  return response;
};

export const getStoredBusiness = (): StaffItem[] | null => {
  const content = ls.get("Business", { decrypt: true });

  return content as StaffItem[];
};

export const createDropzone = async (
  projectId: string,
  data: DropzonePayload,
): Promise<DropzonePayload | null> => {
  try {
    const response = await apiRequest({
      method: "POST",
      url: `/api/v1/projects/${projectId}/dropzone/`,
      data,
      requireToken: true,
    });

    return response as DropzonePayload;
  } catch (error: unknown) {
    return null;
  }
};
