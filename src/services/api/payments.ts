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

interface FundWalletPayload {
  amount_naira: number;
  callback_url?: string;
}

interface PaystackInitialization {
  authorization_url: string;
  access_code?: string;
  reference?: string;
}

interface FundWalletResponse {
  paystack?: PaystackInitialization;
}

export const CreateBusiness = async (payload: unknown): Promise<any> => {
  const result = await apiRequest<any>({
    method: "POST",
    url: `/api/v1/org/business/`,
    data: payload,
    requireToken: true,
  });

  return result;
};

export const CreateMedia = async (
  id: number,
  payload: unknown,
  contentType?: string,
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
        "Content-Type": contentType || "multipart/form-data",
      },
    });

    console.log(`create media response: ${response}`);
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

export const getPaymentInvoice = async (
  id: number,
): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/projects/${id}/invoices/`,
      data: null,
      requireToken: true,
    });

    ls.set("PaymentInvoice", response, { encrypt: true });

    return response as any;
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

    ls.set("Metric", response, { encrypt: true });

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

    ls.set("Dsp", response, { encrypt: true });

    return response as ContentItem[];
  } catch (error: unknown) {
    return null;
  }
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

export const getCampaignWallet = async (): Promise<any | null> => {
  try {
    let url = `/api/v1/wallet/`;

    const response = await apiRequest({
      method: "GET",
      url: url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const fundCampaignWallet = async (
  payload: FundWalletPayload,
): Promise<FundWalletResponse | null> => {
  const createToast = toast.loading("Initiating Payment...");
  try {
    const result = await apiRequest<FundWalletResponse>({
      method: "POST",
      url: `/api/v1/wallet/fund/`,
      data: payload,
      requireToken: true,
    });

    toast.update(createToast, {
      render: "Payment Initiated Successfully",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
    console.log("PAYMENT RESPONSE", result);
    return result;
  } catch (error: unknown) {
    return null;
  }
};

export const verifyWalletPayment = async (
  reference: string,
): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/wallet/verify/`,
      params: { reference },
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    throw error;
  }
};

export const getPromoterPlans = async (params?: {
  search?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/aggregators/`;

    const query = new URLSearchParams();

    if (params?.search) {
      query.append("search", params.search);
    }

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};
