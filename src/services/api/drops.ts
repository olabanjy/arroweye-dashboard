import apiRequest from "@/Server/Api";
import type { AppDropZonePage, Business, DropZone } from "@/types/api";
import { DropzonePayload } from "@/types/dropzone";
import ls from "localstorage-slim";

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
}): Promise<AppDropZonePage> => {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (year) params.year = year;
  if (month) params.month = month;
  if (vendor) params.vendor = vendor;
  if (subvendor) params.subvendor = subvendor;
  if (platform) params.platform = platform;

  const response = await apiRequest<AppDropZonePage>({
    method: "GET",
    url: `/api/v1/projects/general/dropzone/`,
    params,
    requireToken: true,
  });

  return response;
};

const CAMPAIGN_DROPS_PAGE_SIZE = 100;
const CAMPAIGN_DROPS_MAX_PAGES = 20;

// The list endpoint has no campaign filter, so walk every page and match on `project`.
export const getCampaignDropZones = async (
  projectId: number | string,
): Promise<DropZone[]> => {
  const drops: DropZone[] = [];
  for (let page = 1; page <= CAMPAIGN_DROPS_MAX_PAGES; page++) {
    const response = await apiRequest<AppDropZonePage>({
      method: "GET",
      url: `/api/v1/projects/general/dropzone/`,
      params: { page, page_size: CAMPAIGN_DROPS_PAGE_SIZE },
      requireToken: true,
    });
    drops.push(
      ...response.results.filter(
        (drop) => String(drop.project) === String(projectId),
      ),
    );
    if (!response.next) break;
  }
  return drops;
};

export const getProjectDropZone = async (
  projectId: number | string,
): Promise<DropZone | null> => {
  try {
    return await apiRequest<DropZone>({
      method: "GET",
      url: `/api/v1/projects/${projectId}/dropzone/`,
      requireToken: true,
      silent: true,
    });
  } catch {
    return null;
  }
};

export const deleteDropZones = async (id: number): Promise<void> => {
  await apiRequest<void>({
    method: "DELETE",
    url: `/api/v1/projects/general/dropzone/${id}/`,
    requireToken: true,
    skipErrorHandling: true,
  });
};

export const getBusiness = async (): Promise<Business[]> => {
  const response = await apiRequest<Business[]>({
    method: "GET",
    url: `/api/v1/org/business/`,
    requireToken: true,
  });

  return response;
};

export const getStoredBusiness = (): Business[] | null => {
  const content = ls.get("Business", { decrypt: true });

  return content as Business[] | null;
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
