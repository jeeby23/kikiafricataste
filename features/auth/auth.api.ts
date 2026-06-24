import axios from "@/lib/axios";
import { LoginInput, LoginResponse } from "@/types/auth.types";

export const loginAdmin = async (payload: LoginInput): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>("/admin/login", payload); 
  return res.data;
};