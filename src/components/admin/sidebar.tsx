"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, ChevronRight, LogOut, User2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/admin/schedule",
  },
  {
    label: "Edit Admin",
    icon: User2,
    href: "/admin/edit",
  }
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    // Hapus data user di localStorage
    localStorage.removeItem("currentUser");
    // Hapus cookie userRole dengan expired date di masa lalu
    document.cookie =
      "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Redirect ke halaman login
    router.push("/auth/signin");
  };

  return (
    <Sidebar className="border-r bg-white dark:bg-gray-900 h-screen">
      <SidebarHeader className="p-6 flex items-center justify-center border-b">
        <Link href={"/"} className="text-black dark:text-white text-xl font-bold">
          Admin Panel
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-600 dark:text-blue-400 font-medium px-3 mb-2">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-200 rounded-lg mx-1",
                        isActive
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}>
                      <Link href={item.href} className="flex items-center px-3 py-2 w-full">
                        <Icon
                          className={cn(
                            "h-5 w-5 mr-3",
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 ml-auto text-blue-600 dark:text-blue-400" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-lg mx-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Button
                onClick={handleLogout}
                variant={"ghost"}
                className="flex items-center px-3 py-2 w-full text-red-600 dark:text-red-400 justify-start">
                <LogOut className="h-5 w-5 mr-3" />
                <span className="font-medium">Keluar</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="bg-gray-50 dark:bg-gray-800" />
    </Sidebar>
  );
}
