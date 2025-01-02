export type Role = "Enrollee" | "Admin";

export interface AuthState {
  role: Role | null;
  token: string | null;
  response: {
    access: string;
  } | null;
  organisationResponse: unknown;
  staffResponse: unknown;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    phone_verified?: boolean;
    user_type: string;
    user_profile?: {
      institution_onboarded: boolean;
    };
  };
  token: string;
  access: string;
  role: Role;
}
