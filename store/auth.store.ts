import { create } from "zustand";

interface AuthStore {
  user: { email: string } | null;
  isAuthenticated: boolean;
  setUser: (user: { email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
    

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));