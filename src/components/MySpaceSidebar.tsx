'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShieldAlert, FileText, User } from 'lucide-react';

import { AuthLogo } from '@/components/AuthLogo';
import { useAuthStore } from '@/stores/authStore';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const NAV_ITEMS = [
  {
    label: '스토킹 판단',
    href: '/my-space/stalking',
    icon: ShieldAlert,
  },
  {
    label: '증거 유효성',
    href: '/my-space/evidence',
    icon: Search,
  },
  {
    label: '고소장 작성',
    href: '/my-space/case/collect',
    icon: FileText,
  },
] as const;

export function MySpaceSidebar() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <Sidebar collapsible="icon" className="bg-bg-1 mt-4 ml-6 border-none">
      <SidebarHeader className="flex-row items-center justify-between">
        <div className="group-data-[collapsible=icon]:hidden">
          <AuthLogo />
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>작업 공간</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/my-space/case/collect'
                    ? pathname.startsWith('/my-space/case')
                    : pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={isLoggedIn ? '마이페이지' : '로그인'}>
              <Link href={isLoggedIn ? '/my-page' : '/auth/login'}>
                <User />
                <span>{isLoggedIn ? '마이페이지' : '로그인'}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
