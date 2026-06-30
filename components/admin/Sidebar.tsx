'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/store/auth.store'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar'

import Image from 'next/image'
import { Bokor } from 'next/font/google'

const bokorFont = Bokor({ subsets: ['latin'], weight: '400' })

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/products', label: 'Products' },
  { path: '/admin/orders', label: 'Orders' },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const { setOpenMobile } = useSidebar()
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenMobile(false)

    await new Promise((resolve) => setTimeout(resolve, 250))
    const result = await Swal.fire({
      title: 'Log out?',
      text: 'You will need to sign in again to access the admin dashboard.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#000000',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      heightAuto: false, // Important for mobile
      customClass: {
        popup: 'swal-mobile-fix', // We'll target this in CSS if needed
      },
    })

    if (result.isConfirmed) {
      try {
        logout()
        localStorage.removeItem('ticketapp_session')
        localStorage.removeItem('admin_token')
        localStorage.removeItem('auth_token')

        await Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
          timer: 1500,
          showConfirmButton: false,
        })

        router.replace('/admin/login')
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Logout failed',
          text: 'Please try again.',
        })
      }
    }
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-gray-100 bg-white">
      <SidebarHeader className="px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image src="/kiki-rebrand.svg" alt="Kiki" width={22} height={22} />
          </div>
          <span className={`${bokorFont.className} text-black text-xl tracking-wide uppercase`}>
            Kiki African Taste
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-2 text-[10.5px] font-semibold uppercase text-gray-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (item.path !== '/admin' && pathname?.startsWith(item.path))

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.path} className="flex items-center gap-3">
                        {/* <item.icon className="w-5 h-5" /> */}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 border-t border-gray-100">
        <SidebarMenuButton
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SidebarFooter>

      <button
        onClick={() => setOpenMobile(false)}
        className=" block lg:hidden absolute top-4 right-4 z-[100] p-2 text-gray-500 hover:text-black bg-white rounded-full shadow-md"
      >
        <X size={22} />
      </button>
    </Sidebar>
  )
}
