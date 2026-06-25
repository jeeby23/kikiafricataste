"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10,      // 10 mins — data stays fresh
            gcTime: 1000 * 60 * 30,          // 30 mins — keep in memory
            refetchOnWindowFocus: false,      // don't refetch on tab focus
            refetchOnMount: false,            // don't refetch on component remount
            refetchOnReconnect: false,        // don't refetch on reconnect
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}