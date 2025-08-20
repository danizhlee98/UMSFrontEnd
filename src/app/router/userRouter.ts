import api from "../axios/api";
import { LoginRequest, LoginResponse, UserRequest, UserResponse } from "../schema/userSchema";

export const userRouter = {
  
  get: async (email: string): Promise<UserRequest> => {
    // Get a user by their email
    try {
      const response = await api.get<UserRequest>(
        "/User/Edit?email=" + email
      );
      console.log("response login:", response);
      return response.data;
    } catch (error) {
      console.log("Error Login:", error);
      throw error;
    }
  },
  // update user
  updateUser: async (user : UserRequest): Promise<UserResponse> => {
    try {
      const response = await api.put<UserResponse>(
        "/User/Edit",user
      );
      console.log("response edit:", response);
      return response.data;
    } catch (error) {
      console.log("Error edit:", error);
      throw error;
    }
  },
  //for Creating a User
  createUser: async (user : UserRequest): Promise<UserResponse> => {
    try {
      const response = await api.post<UserResponse>(
        "/User/Create",user
      );
      console.log("response create:", response);
      return response.data;
    } catch (error) {
      console.log("Error create:", error);
      throw error;
    }
  },
  //For Upload image
  uploadImage: async (file: File, firstName: string): Promise<UserRequest> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", firstName);
      console.log("upload form:", formData);
      const response = await api.post("/User/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("response upload:", response);
      return response.data;
    } catch (error) {
      console.log("Error upload:", error);
      throw error;
    }
  },
  //For Getting Image by PathUrl
  getImage: async (pathUrl: string): Promise<{url:string}> => {
    try {
      const formData = new FormData();
      console.log("upload form:", formData);
      const response = await api.get("/User/image/" + pathUrl, {
        withCredentials: true,
      });
      console.log("response upload:", response);
      return response.data;
    } catch (error) {
      console.log("Error upload:", error);
      throw error;
    }
  },
};
