import { RootState, store } from "@/store/store";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_SERVER_DOMAIN as string,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state: RootState = store.getState();
    const token = state.auth?.response?.access;

    if (token) {
      config.headers = new AxiosHeaders(config.headers);
      config.headers.set("Authorization", `Bearer ${token}`);
    }
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
}

const apiRequest = async <T>({
  method,
  url,
  data = null,
  params = {},
  requireToken = true,
}: ApiRequestParams): Promise<T> => {
  try {
    if (!requireToken) {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }

    const response: AxiosResponse<T> = await axiosInstance({
      method,
      url,
      data,
      params,
    } as AxiosRequestConfig);
    return response.data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export default apiRequest;
