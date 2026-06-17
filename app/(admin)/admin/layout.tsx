"use client";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">

        {/* Sidebar */}
        <AppSidebar />

        {/* Main area */}
        <div className="flex flex-1 flex-col">

          {/* Top bar */}
          <div className=" items-center gap-3 border-b bg-white px-4 py-3">
            <SidebarTrigger />
            <AdminNavbar />
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
}