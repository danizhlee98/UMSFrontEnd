import api from "../axios/api";
import { LoginRequest, LoginResponse, UserResponse } from "../schema/userSchema";


export const authRouter = {
    login: async (data: LoginRequest): Promise<UserResponse> => {
      try{
        const response = await api.post("/Auth/login", data);
        console.log("response login:",response);
        return response.data;
      }
      catch (error){
        console.log("Error Login:",error);
        throw error;
      }
    },
    logout: async (): Promise<void> => {
      await api.post("/logout");
      localStorage.removeItem("token");
    },
  };