import { useMutation } from "@tanstack/react-query";
import { loginAdmin } from "./auth.api";
import { useAuthStore } from "@/store/auth.store";
import { LoginInput } from "@/types/auth.types";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      loginSchema.parse(data);
      return loginAdmin(data);
    },

    onSuccess: (res) => {
      if (res.data) {
        setUser(res.data);
      }
    },

    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};