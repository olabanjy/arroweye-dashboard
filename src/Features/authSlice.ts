import { AuthState, LoginResponse } from "@/types/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: AuthState = {
  role: null,
  token: null,
  response: null,
  organisationResponse: null,
  staffResponse: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<LoginResponse>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.response = action.payload;
    },
    setOrganizationInfo(state, action: PayloadAction<unknown>) {
      state.organisationResponse = action.payload;
    },
    setStaffDetails(state, action: PayloadAction<unknown>) {
      state.staffResponse = action.payload;
    },
    setRole(state, action: PayloadAction<"Enrollee" | "Admin">) {
      state.role = action.payload;
    },
    clearAuth() {
      return initialState;
    },
  },
});

export const {
  setAuthData,
  setOrganizationInfo,
  setStaffDetails,
  setRole,
  clearAuth,
} = authSlice.actions;
export default authSlice.reducer;
