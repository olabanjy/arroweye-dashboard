import ls from "localstorage-slim";
import apiRequest from "@/Server/Api";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

export const getLoggedInUser = async (): Promise<any | null> => {
  try {
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

export const LoginEP = async (payload: { email: string }): Promise<any> => {
  const result = await apiRequest<any>({
    method: "POST",
    url: `/login/`,
    data: payload,
    requireToken: false,
  });

  return result;
};

export const Verify = async (payload: unknown): Promise<void> => {
  try {
    const response = await apiRequest<any>({
      method: "POST",
      url: `/verify-otp/`,
      data: payload,
      requireToken: false,
    });

    console.log("VERIFY OTP", response);
  } catch (error: unknown) {
    return;
  }
};

export const VerifyLogin = async (payload: unknown): Promise<any> => {
  const response = await apiRequest<any>({
    method: "POST",
    url: `/verify-login/`,
    data: payload,
    requireToken: false,
  });

  return response;
};

export const AddStaff = async (payload: unknown): Promise<any> => {
  const response = await apiRequest({
    method: "POST",
    url: `/api/v1/ums/staff/`,
    data: payload,
    requireToken: true,
  });

  return response;
};

export const getBusinessStaff = async (id: number): Promise<any | null> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: `/api/v1/org/business/${id}/staff/`,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};
