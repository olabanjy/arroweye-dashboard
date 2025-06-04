import { RootState, store } from "@/store/store";
import ls from "localstorage-slim";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { handleApiError } from "@/lib/utils";
import { Id as ToastId } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_SERVER_DOMAIN as string,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Base URL:", process.env.NEXT_PUBLIC_APP_SERVER_DOMAIN);

// REMOVE THE FIRST INTERCEPTOR - KEEP ONLY THIS ONE
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers["skipAuth"]) {
      const state: RootState = store.getState();
      const content: any = ls.get("Profile", { decrypt: true });
      const token = content?.access;

      if (token) {
        config.headers = new AxiosHeaders(config.headers);
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    delete config.headers["skipAuth"];

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log(error);
    }
    return Promise.reject(error);
  }
);

interface ApiRequestParams {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  requireToken?: boolean;
  headers?: Record<string, string>;
  skipErrorHandling?: boolean;
  loadingToastId?: ToastId | null;
}

const apiRequest = async <T>({
  method,
  url,
  data = null,
  params = {},
  requireToken = true,
  headers = {},
  skipErrorHandling = false,
  loadingToastId = null,
}: ApiRequestParams): Promise<T> => {
  try {
    const requestHeaders = { ...axiosInstance.defaults.headers, ...headers };

    if (!requireToken) {
      requestHeaders["skipAuth"] = "true";
    }

    const response: AxiosResponse<T> = await axiosInstance({
      method,
      url,
      data,
      params,
      headers: requestHeaders,
    } as AxiosRequestConfig);

    return response.data;
  } catch (error) {
    console.error("API request error:", error);

    if (skipErrorHandling === true) {
      if (loadingToastId) {
        handleApiError(error, `Request failed. Please try again.`, {
          toastId: loadingToastId,
          autoClose: 3000,
        });
      }
    } else {
      handleApiError(error, `Request failed. Please try again.`);
    }

    throw error;
  }
};

export default apiRequest;
