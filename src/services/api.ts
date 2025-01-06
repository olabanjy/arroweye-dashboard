import ls from "localstorage-slim";
import axios from "axios";
import { toast } from "react-toastify";
import apiRequest from "@/Server/Api";
import { ContentItem } from "@/types/contents";

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

export const getGenreContents = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/`,
      data: null,
      requireToken: false,
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
      requireToken: false,
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
      requireToken: false,
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
      requireToken: false,
    });

    console.log(response);
    toast.success("Service Created Successful!");
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

export const CreateInvoice = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/payments/invoice/create/`,
      data: payload,
      requireToken: false,
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
export const AddStaff = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/org/staff/add-user/`,
      data: payload,
      requireToken: false,
    });

    console.log(response);
    toast.success("Adding Staff successful! Redirecting...");
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
    toast.success(response.message);

    return { status: Number(response.status), message: response.message };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response;

      console.log("Error response:", errorResponse);

      if (errorResponse?.status === 400) {
        toast.error(errorResponse?.data?.message || errorResponse?.data[0]);
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
      requireToken: false,
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
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/verify-login/`,
      data: payload,
      requireToken: false,
    });

    console.log(response);
    ls.set("Profile", response, { encrypt: true });
    toast.success("Verification successful! Redirecting...");
    window.location.href = "/projects";
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

export const getBusiness = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/org/business/`,
      data: null,
      requireToken: false,
    });

    ls.set("Business", response, { encrypt: true });

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

export const getStoredBusiness = (): ContentItem[] | null => {
  const content = ls.get("Business", { decrypt: true });

  return content as ContentItem[];
};

export const getProjects = async (): Promise<ContentItem[] | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/`,
      data: null,
      requireToken: false,
    });

    ls.set("Projects", response, { encrypt: true });

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

export const getStoredProjects = (): ContentItem[] | null => {
  const content = ls.get("Projects", { decrypt: true });

  return content as ContentItem[];
};

export const getSingleProject = async (
  id: number
): Promise<ContentItem | null> => {
  try {
    const response = await apiRequest<ContentItem>({
      method: "GET",
      url: `/api/v1/projects/${id}/`,
      data: null,
      requireToken: false,
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
      requireToken: false,
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
      requireToken: false,
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
