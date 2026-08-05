import apiRequest from "@/Server/Api";
import type {
  AddStaffInput,
  AuthenticatedUser,
  AuthSession,
  BusinessStaff,
  LoginRequest,
  LoginResponse,
  VerifyLoginRequest,
} from "@/types/api";
import ls from "localstorage-slim";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

export const getLoggedInUser = async (): Promise<AuthenticatedUser | null> => {
  try {
    const response = await apiRequest<AuthenticatedUser>({
      method: "GET",
      url: `/api/v1/ums/me/`,
      requireToken: true,
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};

export const LoginEP = async (payload: LoginRequest): Promise<LoginResponse> => {
  const result = await apiRequest<LoginResponse>({
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

export const VerifyLogin = async (
  payload: VerifyLoginRequest,
): Promise<AuthSession> => {
  const response = await apiRequest<AuthSession>({
    method: "POST",
    url: `/verify-login/`,
    data: payload,
    requireToken: false,
  });

  return response;
};

export const AddStaff = async (
  payload: AddStaffInput,
): Promise<AddStaffInput> => {
  const response = await apiRequest<AddStaffInput>({
    method: "POST",
    url: `/api/v1/org/staff/add-user/`,
    data: payload,
    requireToken: true,
  });

  return response;
};

export const getBusinessStaff = async (
  id: number,
): Promise<BusinessStaff[] | null> => {
  try {
    const response = await apiRequest<BusinessStaff[]>({
      method: "GET",
      url: `/api/v1/org/business/${id}/staff/`,
      requireToken: true,
    });

    return response;
  } catch (error: unknown) {
    return null;
  }
};
