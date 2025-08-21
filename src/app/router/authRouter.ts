import api from "../axios/api";
import {
  LoginRequest,
  LoginResponse,
  UserResponse,
} from "../schema/userSchema";

let accessToken: string | null = null;

export const authRouter = {
  login: async (data: LoginRequest): Promise<UserResponse> => {
    try {
      const response = await api.post("/Auth/login", data);
      accessToken = response.data.accessToken;
      console.log("response login:", response);
      return response.data;
    } catch (error) {
      console.log("Error Login:", error);
      throw error;
    }
  },
  getAccessToken: () => accessToken,
  clearAccessToken: () => {
    accessToken = null;
  },
  logout: async (): Promise<void> => {
    await api.post("/logout");
    localStorage.removeItem("token");
  },
};
