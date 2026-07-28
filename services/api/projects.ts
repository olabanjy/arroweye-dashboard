import ls from "localstorage-slim";
import apiRequest from "@/Server/Api";
import { toast } from "react-toastify";
import { ContentItem } from "@/types/contents";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

interface ApiResponse {
  action: string;
  url: string;
  status: number | string;
}

interface ApiRequestResponse<T> {
  data: T;
  message: string;
  status: number | string;
}

interface SendEmailResponse {
  message: string;
  status: string;
}

interface SendEmailPayload {
  email: string;
  url: string;
}

export const getGenreContents = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/`,
      data: null,
      requireToken: true,
    });

    ls.set("Genre", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredGenreContent = (): ContentItem[] | null => {
  const content = ls.get("Genre", { decrypt: true });
  return content as ContentItem[];
};

export const getSingleContent = async (
  id: number,
): Promise<ContentItem | null> => {
  try {
    const response = await apiRequest<ContentItem>({
      method: "GET",
      url: `/content/contents/${id}`,
      data: null,
      requireToken: true,
    });

    if (response && response.id && response.title) {
      const contentItem: ContentItem = response;

      ls.set("SingleContent", contentItem, { encrypt: true });

      return contentItem;
    } else {
      console.error("Invalid content item structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredSingleContent = (): ContentItem | null => {
  const content = ls.get("SingleContent", { decrypt: true });

  return content as ContentItem;
};

export const getProjects = async (): Promise<ContentItem[]> => {
  const response = await apiRequest<ContentItem[]>({
    method: "GET",
    url: `/api/v1/projects/`,
    requireToken: true,
  });

  return response;
};

export const getSingleProject = async (
  id: number,
): Promise<ContentItem | null> => {
  try {
    const response = await apiRequest<ContentItem>({
      method: "GET",
      url: `/api/v1/projects/${id}/`,
      data: null,
      requireToken: true,
    });

    if (response && response.id && response.title) {
      const contentItem: ContentItem = response;

      ls.set("SingleProject", contentItem, { encrypt: true });

      return contentItem;
    } else {
      console.error("Invalid Project item structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredSingleProject = (): ContentItem | null => {
  const content = ls.get("SingleProject", { decrypt: true });

  return content as ContentItem;
};

export const archiveProject = async (
  id: number,
  payload: unknown,
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "PATCH",
      url: `/api/v1/projects/${id}/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Action successful!");
  } catch (error: unknown) {}
};

export const shareProject = async (
  id: number,
  payload: unknown,
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/${id}/share-project/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Action successful!");
  } catch (error: unknown) {}
};

export const sendProjectEmail = async (
  id: number | string,
  payload: SendEmailPayload,
): Promise<SendEmailResponse | null> => {
  try {
    const response = await apiRequest({
      method: "POST",
      url: `/api/v1/projects/${id}/share-project/`,
      data: payload,
      requireToken: true,
    });

    toast.success("Email sent successfully!");
    return response as SendEmailResponse;
  } catch (error: unknown) {
    return null;
  }
};

export const campaignStaffAction = async (
  id: number | string,
  payload: any,
): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "POST",
      url: `/api/v1/projects/${id}/watchers/`,
      data: payload,
      requireToken: true,
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};

export const createCampaignDraft = async (payload: unknown): Promise<any> => {
  const result = await apiRequest<ApiRequestResponse<ApiResponse>>({
    method: "POST",
    url: `/api/v1/campaigns/draft/`,
    data: payload,
    requireToken: true,
  });

  console.log("DRAFT RESPONSE", result);
  ls.set("LastCampaignDraft", result, { encrypt: true });
  return result;
};

export const launchCampaignFully = async (
  id: number,
  payload: unknown,
): Promise<any> => {
  return await apiRequest<ApiRequestResponse<ApiResponse>>({
    method: "POST",
    url: `/api/v1/campaigns/${id}/launch/`,
    data: payload,
    requireToken: true,
  });
};

export const getCreatedCampaigns = async (
  page = 1,
  pageSize = 10,
): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/campaigns/?page=${page}&page_size=${pageSize}`,
      data: null,
      requireToken: true,
    });
    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getSingleCampaign = async (
  id: number,
): Promise<ContentItem | null> => {
  try {
    const response = await apiRequest<ContentItem>({
      method: "GET",
      url: `/api/v1/campaigns/${id}/dashboard/`,
      data: null,
      requireToken: true,
    });

    if (response) {
      const contentItem: ContentItem = response;
      ls.set(`SingleCampaign:${id}`, contentItem, { encrypt: true });
      return contentItem;
    } else {
      console.error("Invalid Project item structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredSingleCampaign = (id: number): ContentItem | null => {
  const content = ls.get(`SingleCampaign:${id}`, { decrypt: true });
  return content as ContentItem;
};

export const ClaimReward = async (payload: unknown): Promise<void> => {
  const claimRewardToast = toast.loading("claiming reward...");
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/ums/claim-reward/`,
      data: payload,
      requireToken: true,
      skipErrorHandling: true,
      loadingToastId: claimRewardToast,
    });

    console.log(response);
    toast.update(claimRewardToast, {
      render: "Claim Reward Successful",
      type: "info",
      isLoading: false,
      autoClose: 3000,
    });
    window.location.reload();
  } catch (error: unknown) {
    return;
  }
};
