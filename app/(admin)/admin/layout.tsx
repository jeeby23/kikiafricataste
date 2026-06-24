'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/admin/Sidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center border-b bg-white">
            <div className="px-3">
              <SidebarTrigger className="text-black hover:text-black" />
            </div>
            <div className="flex-1">
              <AdminNavbar />
            </div>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
