import ls from "localstorage-slim";
import axios from "axios";
import { toast } from "react-toastify";
import apiRequest from "@/Server/Api";
import { ContentItem, EventsItem, StaffItem } from "@/types/contents";
import { DropzonePayload } from "@/types/dropzone";

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        const redirectUrl = error.response?.data?.redirect_url;

        console.error("403 Forbidden:", error.response?.data);

        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    } else {
      console.error("Unexpected Error:", error);
    }

    return null;
  }
};

export const getStoredSingleContent = (): ContentItem | null => {
  const content = ls.get("SingleContent", { decrypt: true });

  return content as ContentItem;
};

export const CreateBusiness = async (payload: unknown): Promise<void> => {
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(error.response);

        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
  }
};

export const CreateMedia = async (
  id: number,
  payload: unknown
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/${id}/media/`,
      data: payload,
      requireToken: true,
      headers: {
        "Content-Type": "multipart/form-data", // Set the Content-Type to multipart/form-data
      },
    });

    console.log(`create media response: ${response}`);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(error.response);

        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(error.response);

        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(error.response);

        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(error.response);

        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(error.response);

        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data[0] ||
            error.response?.data.name[0]
        );
        console.log(error.response);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
  }
};

export const CreateEvent = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/schedule/events/create/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Event Created Successful!");
    window.location.reload();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
  }
};
export const AddStaff = async (payload: unknown): Promise<any> => {
  try {
    const response = await apiRequest<ApiRequestResponse<ApiResponse>>({
      method: "POST",
      url: `/api/v1/org/staff/add-user/`,
      data: payload,
      requireToken: true,
    });

    toast.success("Adding Staff successful! Redirecting...");
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response;

      console.log("Error response:", errorResponse);

      if (errorResponse?.status === 400) {
        // toast.error(errorResponse?.data?.message || errorResponse?.data[0]);
      } else if (errorResponse?.status === 403) {
        toast.error(errorResponse?.data?.message || "Access denied.");
      } else {
        toast.error(
          errorResponse?.data?.message || "Request failed. Please try again."
        );
      }

      return {
        status: errorResponse?.status || 500,
        message:
          errorResponse?.data?.message || "Request failed. Please try again.",
        errorResponse,
      };
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);

      return { status: 500, message: "Unexpected error occurred." };
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    toast.success("Verification successful! Redirecting...");
    window.location.href = "/campaigns";
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        toast.error(
          "Projects not found. Please check the URL or try again later."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Content Retrieval failed. Please try again."
        );
      }
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 403) {
          const redirectUrl = error.response.data?.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      } else if (error.request) {
        console.error("No response received from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }

    return null;
  }
};
export const getAirPlayStats = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/get-airplay-stats/`,
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
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 403) {
          const redirectUrl = error.response.data?.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      } else if (error.request) {
        console.error("No response received from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }

    return null;
  }
};

export const getSocialMediaStats = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/get-social-media-stats/`,
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
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 403) {
          const redirectUrl = error.response.data?.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      } else if (error.request) {
        console.error("No response received from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }

    return null;
  }
};

export const getDSPStats = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/get-dsp-stats/`,
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
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 403) {
          const redirectUrl = error.response.data?.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      } else if (error.request) {
        console.error("No response received from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }

    return null;
  }
};

export const getAudienceStats = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/audience-stats/`,
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
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 403) {
          const redirectUrl = error.response.data?.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      } else if (error.request) {
        console.error("No response received from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }

    return null;
  }
};

export const geteSMActionStats = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/sm-actions-stats/`,
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
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 403) {
          const redirectUrl = error.response.data?.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      } else if (error.request) {
        console.error("No response received from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }

    return null;
  }
};

export const geteDSPPerformanceStats = async (
  id: number
): Promise<any | null> => {
  try {
    const response = await apiRequest<any>({
      method: "GET",
      url: `/api/v1/projects/${id}/dsp-performance-stats/`,
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
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 403) {
          const redirectUrl = error.response.data?.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      } else if (error.request) {
        console.error("No response received from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        const redirectUrl = error.response?.data?.redirect_url;

        console.error("403 Forbidden:", error.response?.data);

        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    } else {
      console.error("Unexpected Error:", error);
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        const redirectUrl = error.response?.data?.redirect_url;

        console.error("403 Forbidden:", error.response?.data);

        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    } else {
      console.error("Unexpected Error:", error);
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        const redirectUrl = error.response?.data?.redirect_url;

        console.error("403 Forbidden:", error.response?.data);

        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    } else {
      console.error("Unexpected Error:", error);
    }

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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
  }
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Content Retrieval failed. Please try again."
      );
    } else {
      toast.error("Content Retrieval failed. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send email. Please try again."
      );
    } else {
      toast.error("Failed to send email. Please try again.");
    }

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
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create dropzone. Please try again."
      );
    } else {
      toast.error("Failed to create dropzone. Please try again.");
    }
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(error.response);

        toast.error(error.response?.data?.message || error.response?.data[0]);
      } else if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "Access denied.");
      } else {
        toast.error(
          error.response?.data?.message || "Request failed. Please try again."
        );
      }
    } else {
      toast.error("Request failed. Please try again.");
      console.error("Unexpected Error:", error);
    }
  }
};
