"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    if (!user?.token) return;

    const payload = JSON.parse(atob(user.token.split(".")[1]));

    const expiresAt = payload.exp * 1000;
    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      logout();
      router.replace("/admin/login");
      return;
    }

    const timer = setTimeout(() => {
      logout();
      router.replace("/admin/login");
    }, remaining);

    return () => clearTimeout(timer);
  }, [user, logout, router]);

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}