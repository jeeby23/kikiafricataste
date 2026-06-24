'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Tag,
  Package,
  Users,
  UserSquare2,
  ShoppingBag,
  ClipboardList,
  RotateCcw,
  MessageSquare,
  CalendarDays,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import Image from 'next/image'
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
} from '@/components/ui/sidebar'
import { Bokor } from "next/font/google";

const bokorFont = Bokor({
  subsets: ["latin"],
  weight: "400",
});


const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/sales', label: 'Sales', icon: Tag },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/customer-details', label: 'Customer Details', icon: UserSquare2 },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/order-details', label: 'Order Details', icon: ClipboardList },
  { path: '/admin/refunds', label: 'Refunds', icon: RotateCcw },
  { path: '/admin/chat', label: 'Chat', icon: MessageSquare },
  { path: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
]

const GENERAL_ITEMS = [
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/help', label: 'Help Center', icon: HelpCircle },
]

function NavItem({
  path,
  label,
  icon: Icon,
  exact = false,
}: {
  path: string
  label: string
  icon: React.ElementType
  exact?: boolean
}) {
  const pathname = usePathname()
  const active = exact
    ? pathname === path
    : pathname === path || (path !== '/admin' && pathname?.startsWith(path))

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        className={`
          w-full rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors duration-150 h-auto
          ${active
            ? 'bg-gray-200 text-gray-700'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
          }
        `}
      >
        <Link href={path} className="flex items-center gap-3">
          <Icon
            className={`w-[17px] h-[17px] shrink-0 ${active ? 'text-gray-600' : 'text-gray-400'}`}
            strokeWidth={1.75}
          />
          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default function AppSidebar() {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-gray-100 bg-white [&>[data-slot=sidebar-inner]]:bg-white"
     
    >
      <SidebarHeader className="px-5 pt-5 pb-4 flex items-center border-b border-gray-50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            <Image
              src="/kiki-rebrand.svg"
              alt="Kiki"
              width={22}
              height={22}
              className="rounded-md"
            />
          </div>
          <span className={`${bokorFont.className} text-black text-xl sm:text-xl md:text-xl lg:text-xl tracking-wide uppercase leading-tight mt-3`}>
            Kiki African Taste
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="p-0 mb-5">
          <SidebarGroupLabel className="px-3 mb-2 text-[10.5px] font-semibold uppercase text-gray-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.path} {...item} exact={item.path === '/admin'} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 mb-2 text-[10.5px] font-semibold uppercase text-gray-400">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {GENERAL_ITEMS.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 border-t border-gray-100">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13.5px] font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <LogOut className="w-[17px] h-[17px]" strokeWidth={1.75} />
          <span>Log Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}