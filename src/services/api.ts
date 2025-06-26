import ls from "localstorage-slim";
import axios from "axios";
import { toast } from "react-toastify";
import apiRequest from "@/Server/Api";
import { ContentItem, EventsItem, StaffItem } from "@/types/contents";
import { DropzonePayload } from "@/types/dropzone";
import { handleApiError } from "@/lib/utils";

if (typeof window !== "undefined" && window?.sessionStorage)
  ls.config.storage = sessionStorage;

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

export const getLoggedInUser = async (): Promise<any | null> => {
  try {
    const content: any = ls.get("Profile", { decrypt: true });
    const token = content?.access;

    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/ums/me/`,
      requireToken: true,
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};

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
  id: number
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

export const CreateBusiness = async (payload: unknown): Promise<any> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/org/create-business/create/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
    window.location.reload();
  } catch (error: unknown) {
    return null;
  }
};

export const CreateMedia = async (
  id: number,
  payload: unknown,
  contentType?: string
): Promise<any> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/${id}/media/`,
      data: payload,
      requireToken: true,
      headers: {
        "Content-Type": contentType || "multipart/form-data", // Use provided content type or default
      },
    });

    console.log(`create media response: ${response}`);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return null;
  }
};

export const CreateMetric = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/general/metric/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateChannel = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/general/airplay/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateSocialStats = async (
  id: number,
  payload: unknown
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `api/v1/projects/${id}/social-media/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateDspStats = async (
  id: number,
  payload: unknown
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `api/v1/projects/${id}/dsp/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateService = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/payments/service/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Service Created Successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateInvoice = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/payments/invoice/create/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Invoice Created Successful!");

    window.location.reload();
  } catch (error: unknown) {
    return;
  }
};

export const CreateEvent = async (payload: unknown): Promise<void> => {
  const createToast = toast.loading("creating event...");
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/schedule/events/create/`,
      data: payload,
      requireToken: true,
      skipErrorHandling: true,
      loadingToastId: createToast,
    });

    console.log(response);
    toast.update(createToast, {
      render: "Event Created Successfully",
      type: "info",
      isLoading: false,
      autoClose: 3000,
    });
  } catch (error: unknown) {
    return;
  }
};

export const RescheduleEvent = async (payload: unknown): Promise<void> => {
  const createToast = toast.loading("rescheduling event...");
  try {
    const response: any = await apiRequest<ApiRequestResponse<ApiResponse>>({
      method: "POST",
      url: `/api/v1/projects/schedule/events/reschedule/`,
      data: payload,
      requireToken: true,
      skipErrorHandling: true,
      loadingToastId: createToast,
    });

    console.log("RESCHEDULE RESCHEDULE", response);
    toast.update(createToast, {
      render: !!response?.invoice_created
        ? "Event Reschedule Request Successful, go to Invoice page to complete"
        : "Event Reschedule Request Successful",
      type: "success",
      isLoading: false,
      autoClose: 5000,
    });
  } catch (error: unknown) {
    return;
  }
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

export const AddStaff = async (payload: unknown): Promise<any> => {
  const addUserToast = toast.loading("adding user...");
  try {
    const response = await apiRequest<ApiRequestResponse<ApiResponse>>({
      method: "POST",
      url: `/api/v1/org/staff/add-user/`,
      data: payload,
      requireToken: true,
      skipErrorHandling: true,
      loadingToastId: addUserToast,
    });

    toast.update(addUserToast, {
      render: "Adding Staff successful! Redirecting...",
      type: "success",
      autoClose: 3000,
      isLoading: false,
    });
    return response;
  } catch (error: unknown) {
    return;
  }
};

export const LoginEP = async (
  payload: unknown
): Promise<{ status: number; message: string; errorResponse?: unknown }> => {
  try {
    const response = await apiRequest<ApiRequestResponse<ApiResponse>>({
      method: "POST",
      url: `/login/`,
      data: payload,
      requireToken: false,
    });

    console.log(response);
    // toast.success(response.message);
    return { status: Number(response.status), message: response.message };
  } catch (error: unknown) {
    return { status: 500, message: "Unexpected error occurred." };
  }
};

export const Verify = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/verify/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Verification successful! Redirecting...");
  } catch (error: unknown) {
    return;
  }
};

export const VerifyLogin = async (payload: unknown): Promise<void> => {
  try {
    const response = await apiRequest<ApiRequestResponse<ApiResponse>>({
      method: "POST",
      url: `/verify-login/`,
      data: payload,
      requireToken: false,
    });

    console.log("VERIFY", response);
    const contentItem = response;
    ls.set("Profile", contentItem, { encrypt: true });
    toast.success("Verification successful!");
    window.location.href = "/campaigns";
  } catch (error: unknown) {
    return;
  }
};

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
}): Promise<any | null> => {
  try {
    const content: any = ls.get("Profile", { decrypt: true });
    const token = content?.access;

    // Construct query parameters dynamically
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};

export const deleteDropZones = async (id: number): Promise<any | null> => {
  const loadingDelete = toast.loading("Deleting dropzone");
  try {
    const content: any = ls.get("Profile", { decrypt: true });
    const token = content?.access;

    const response = await apiRequest({
      method: "DELETE",
      url: `/api/v1/projects/general/dropzone/${id}`,
      requireToken: true,
      skipErrorHandling: true,
      loadingToastId: loadingDelete,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.update(loadingDelete, {
      render: "Deleted successfully",
      type: "info",
      isLoading: false,
      autoClose: 3000,
    });
    return response;
  } catch (error: unknown) {
    return null;
  }
};

export const getBusiness = async (): Promise<StaffItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/org/business/`,
      data: null,
      requireToken: true,
    });

    console.log("BUSINESS", response);

    ls.set("Business", response, { encrypt: true });

    return response as StaffItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredBusiness = (): StaffItem[] | null => {
  const content = ls.get("Business", { decrypt: true });

  return content as StaffItem[];
};

// export const getProjects = async (): Promise<ContentItem[] | null> => {
//   try {
//     const response = await apiRequest({
//       method: "GET",
//       url: `/api/v1/projects/`,
//       data: null,
//       requireToken: true,
//     });

//     ls.set("Projects", response, { encrypt: true });

//     return response as ContentItem[];
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       toast.error(
//         error.response?.data?.message ||
//           "Content Retrieval failed. Please try again."
//       );
//     } else {
//       toast.error("Content Retrieval failed. Please try again.");
//     }

//     return null;
//   }
// };

export const getProjects = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/`,
      data: null,
      requireToken: true,
    });

    ls.set("Projects", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredProjects = (): ContentItem[] | null => {
  const content = ls.get("Projects", { decrypt: true });

  return content as ContentItem[];
};
export const getProjectNotifications = async (
  id: number
): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/notifications/`,
      data: null,
      requireToken: true,
    });

    // Validate response structure before using
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

export const getAirPlayStats = async ({
  id,
  weeks = "",
  lifetime = "",
  channels = "",
  country = "",
}: {
  id: number;
  weeks?: string;
  lifetime?: string;
  channels?: string;
  country?: string;
}): Promise<any | null> => {
  try {
    // Construct query parameters dynamically
    const params: Record<string, string | number> = { id };
    if (weeks) params.weeks = weeks;
    if (lifetime) params.lifetime = lifetime;
    if (country) params.country = country;
    if (channels) params.channels = channels;

    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/get-airplay-stats/`,
      params,
      data: null,
      requireToken: true,
    });

    // Validate response structure before using
    if (response && typeof response === "object") {
      const airPlayStats: any = response;

      // Store in localStorage securely
      ls.set(`AirPlayStats_${id}`, airPlayStats, { encrypt: true });

      return airPlayStats;
    } else {
      console.error("Invalid DSP stats response structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getSocialMediaStats = async ({
  id,
  weeks = "",
  lifetime = "",
  channels = "",
  country = "",
}: {
  id: number;
  weeks?: string;
  lifetime?: string;
  channels?: string;
  country?: string;
}): Promise<any | null> => {
  try {
    const params: Record<string, string | number> = { id };
    if (weeks) params.weeks = weeks;
    if (lifetime) params.lifetime = lifetime;
    if (country) params.country = country;
    if (channels) params.channels = channels;

    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/get-social-media-stats/`,
      params,
      data: null,
      requireToken: true,
    });

    // Validate response structure before using
    if (response && typeof response === "object") {
      const airPlayStats: any = response;

      // Store in localStorage securely
      ls.set(`AirPlayStats_${id}`, airPlayStats, { encrypt: true });

      return airPlayStats;
    } else {
      console.error("Invalid DSP stats response structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getDSPStats = async ({
  id,
  weeks = "",
  lifetime = "",
  channels = "",
  country = "",
}: {
  id: number;
  weeks?: string;
  lifetime?: string;
  channels?: string;
  country?: string;
}): Promise<any | null> => {
  try {
    const params: Record<string, string | number> = { id };
    if (weeks) params.weeks = weeks;
    if (lifetime) params.lifetime = lifetime;
    if (country) params.country = country;
    if (channels) params.channels = channels;

    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/get-dsp-stats/`,
      params,
      data: null,
      requireToken: true,
    });

    // Validate response structure before using
    if (response && typeof response === "object") {
      const airPlayStats: any = response;

      // Store in localStorage securely
      ls.set(`AirPlayStats_${id}`, airPlayStats, { encrypt: true });

      return airPlayStats;
    } else {
      console.error("Invalid DSP stats response structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getAudienceStats = async ({
  id,
  weeks = "",
  lifetime = "",
  channels = "",
  country = "",
}: {
  id: number;
  weeks?: string;
  lifetime?: string;
  channels?: string;
  country?: string;
}): Promise<any | null> => {
  try {
    const params: Record<string, string | number> = { id };
    if (weeks) params.weeks = weeks;
    if (lifetime) params.lifetime = lifetime;
    if (country) params.country = country;
    if (channels) params.channels = channels;

    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/audience-stats/`,
      params,
      data: null,
      requireToken: true,
    });

    // Validate response structure before using
    if (response && typeof response === "object") {
      const airPlayStats: any = response;

      // Store in localStorage securely
      ls.set(`AirPlayStats_${id}`, airPlayStats, { encrypt: true });

      return airPlayStats;
    } else {
      console.error("Invalid DSP stats response structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const geteSMActionStats = async ({
  id,
  weeks = "",
  lifetime = "",
  channels = "",
  country = "",
}: {
  id: number;
  weeks?: string;
  lifetime?: string;
  channels?: string;
  country?: string;
}): Promise<any | null> => {
  try {
    const params: Record<string, string | number> = { id };
    if (weeks) params.weeks = weeks;
    if (lifetime) params.lifetime = lifetime;
    if (country) params.country = country;
    if (channels) params.channels = channels;

    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/sm-actions-stats/`,
      params,
      data: null,
      requireToken: true,
    });

    // Validate response structure before using
    if (response && typeof response === "object") {
      const airPlayStats: any = response;

      // Store in localStorage securely
      ls.set(`AirPlayStats_${id}`, airPlayStats, { encrypt: true });

      return airPlayStats;
    } else {
      console.error("Invalid DSP stats response structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const geteDSPPerformanceStats = async ({
  id,
  weeks = "",
  lifetime = "",
  channels = "",
  country = "",
}: {
  id: number;
  weeks?: string;
  lifetime?: string;
  channels?: string;
  country?: string;
}): Promise<any | null> => {
  try {
    const params: Record<string, string | number> = { id };
    if (weeks) params.weeks = weeks;
    if (lifetime) params.lifetime = lifetime;
    if (country) params.country = country;
    if (channels) params.channels = channels;

    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/dsp-performance-stats/`,
      params,
      data: null,
      requireToken: true,
    });

    // Validate response structure before using
    if (response && typeof response === "object") {
      const airPlayStats: any = response;

      // Store in localStorage securely
      ls.set(`AirPlayStats_${id}`, airPlayStats, { encrypt: true });

      return airPlayStats;
    } else {
      console.error("Invalid DSP stats response structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getSingleProject = async (
  id: number
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

export const getInvoice = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/payments/invoice/`,
      data: null,
      requireToken: true,
    });

    ls.set("Invoice", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredInvoice = (): ContentItem[] | null => {
  const content = ls.get("Invoice", { decrypt: true });

  return content as ContentItem[];
};

export const getService = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/payments/service/`,
      data: null,
      requireToken: true,
    });

    ls.set("Service", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredService = (): ContentItem[] | null => {
  const content = ls.get("Service", { decrypt: true });

  return content as ContentItem[];
};

export const getEvents = async (): Promise<EventsItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/schedule/events/`,
      data: null,
      requireToken: true,
    });

    ls.set("Events", response, { encrypt: true });

    return response as EventsItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const deleteEvents = async (id: number): Promise<any | null> => {
  const deleteToast = toast.loading("deleteing event...");
  try {
    const response = await apiRequest({
      method: "DELETE",
      url: `/api/v1/projects/schedule/events/${id}`,
      data: null,
      requireToken: true,
      skipErrorHandling: true,
      loadingToastId: deleteToast,
    });

    toast.update(deleteToast, {
      render: "Event Deleted",
      type: "success",
      autoClose: 3000,
      isLoading: false,
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};

export const getProjectsEvents = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/${id}/events/`,
      data: null,
      requireToken: true,
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};

export const getStoredEvent = (): ContentItem[] | null => {
  const content = ls.get("Events", { decrypt: true });

  return content as ContentItem[];
};

export const getPaymentInvoice = async (
  id: number
): Promise<ContentItem | null> => {
  try {
    const response = await apiRequest<ContentItem>({
      method: "GET",
      url: `/api/v1/payments/invoice/${id}/`,
      data: null,
      requireToken: true,
    });

    if (response && response.total && response.currency) {
      const contentItem: ContentItem = response;

      ls.set("PaymentInvoice", contentItem, { encrypt: true });

      return contentItem;
    } else {
      console.error("Invalid Invoice item structure:", response);
      return null;
    }
  } catch (error: unknown) {
    return null;
  }
};

export const getChannel = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/general/airplay/`,
      data: null,
      requireToken: true,
    });

    ls.set("Channel", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getMetric = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/general/metric/`,
      data: null,
      requireToken: true,
    });

    ls.set("Channel", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getSocialMedia = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/general/social-media/`,
      data: null,
      requireToken: true,
    });

    ls.set("SocialMedia", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getDsp = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/general/dsp/`,
      data: null,
      requireToken: true,
    });

    ls.set("DspMedia", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
};

export const getBusinessStaff = async (
  id: number
): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest<ContentItem[]>({
      method: "GET",
      url: `/api/v1/org/business/${id}/staff/`,
      data: null,
      requireToken: true,
    });

    const contentItem: ContentItem[] = response;

    ls.set("BusinessStaff", contentItem, { encrypt: true });

    return contentItem;
  } catch (error: unknown) {
    return null;
  }
};

export const archiveProject = async (
  id: number,
  payload: unknown
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
  payload: unknown
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

export const initializePayment = async (payload: unknown): Promise<any> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/payments/initialize/`,
      data: payload,
      requireToken: true,
    });

    return response;
  } catch (error: unknown) {}
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

export const sendProjectEmail = async (
  id: number | string,
  payload: SendEmailPayload
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
  payload: any
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
    // handleApiError(error, "Failed to perform staff action. Please try again.");
    return null;
  }
};

export const markNotificationsAsRead = async (
  payload: any
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

export const createDropzone = async (
  projectId: string,
  data: DropzonePayload
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

export const AddAirplayData = async (
  payload: unknown,
  id: number
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/${id}/air-plays/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};
