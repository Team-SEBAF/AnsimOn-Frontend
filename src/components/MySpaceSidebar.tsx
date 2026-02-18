'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileIcon from '@/assets/icons/profile-defalt.svg';

import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/Button';
import stalkingDefault from '@/assets/icons/stalking-default.png';
import stalkingActive from '@/assets/icons/stalking-active.png';
import evidenceDefault from '@/assets/icons/evidence-default.png';
import evidenceActive from '@/assets/icons/evidence-active.png';
import caseDefault from '@/assets/icons/case-default.png';
import caseActive from '@/assets/icons/case-active.png';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import SidebarIcon1 from '@/assets/icons/Sidebar-icon-1.svg';
import SidebarIcon2 from '@/assets/icons/Sidebar-icon-2.svg';
import SidebarIcon3 from '@/assets/icons/Sidebar-icon-3.svg';
import ExternalLinkIcon from '@/assets/icons/external-link.svg';
import { GnbLogo } from './GnbLogo';

const NAV_ITEMS = [
  {
    label: '고소장 작성',
    href: '/my-space/case',
    icon: caseDefault,
    activeIcon: caseActive,
  },
  {
    label: '스토킹 판단',
    href: '/my-space/stalking',
    icon: stalkingDefault,
    activeIcon: stalkingActive,
  },
  {
    label: '증거 유효성',
    href: '/my-space/evidence',
    icon: evidenceDefault,
    activeIcon: evidenceActive,
  },
];

export function MySpaceSidebar() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-bg-1 w-50 border-none px-3 py-6 **:data-[sidebar=sidebar]:justify-between md:sticky! md:inset-y-auto! md:top-0! md:h-[calc(100vh-2rem)]!"
    >
      <SidebarHeader className="flex-row items-center justify-between gap-0 p-0 pr-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pr-0">
        <div className="overflow-hidden opacity-100 transition-opacity delay-150 duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0">
          <GnbLogo />
        </div>
        <SidebarTrigger className="h-4 w-4 text-gray-400" />
      </SidebarHeader>

      <SidebarContent className="justify-center p-0">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="typo-heading-5 h-12 p-0 text-gray-300 group-data-[collapsible=icon]:size-12! data-[active=true]:font-semibold data-[active=true]:text-gray-800"
                    >
                      <Link href={item.href}>
                        <span className="relative size-12 shrink-0">
                          <Image
                            src={item.icon}
                            alt={item.label}
                            width={48}
                            height={48}
                            className={`absolute inset-0 size-12 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                          />
                          <Image
                            src={item.activeIcon}
                            alt={item.label}
                            width={48}
                            height={48}
                            className={`absolute inset-0 size-12 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                          />
                        </span>
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

      <SidebarFooter className="gap-3 p-0">
        <SidebarMenu className="max-h-40 gap-3 overflow-hidden opacity-100 transition-[opacity,max-height] delay-150 duration-300 group-data-[collapsible=icon]:max-h-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0">
          <SidebarMenuItem className="h-auto">
            <SidebarMenuButton asChild className="typo-heading-6 h-auto p-0 text-gray-400">
              <Link href="/support" className="flex items-center gap-2">
                <SidebarIcon1 className="size-4 shrink-0" />
                고객 센터
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* TODO: 도움말 센터 페이지 시안 확정 후 링크 연결 */}
          <SidebarMenuItem>
            <SidebarMenuButton className="typo-heading-6 h-auto p-0 text-gray-400">
              <SidebarIcon2 className="size-4 shrink-0" />
              <span className="inline-flex items-center gap-0.5">
                도움말 센터
                <ExternalLinkIcon className="size-4 shrink-0" />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* TODO: 이용약관 및 정책 페이지 시안 확정 후 링크 연결 */}
          <SidebarMenuItem>
            <SidebarMenuButton className="typo-heading-6 h-auto p-0 text-gray-400">
              <SidebarIcon3 className="size-4 shrink-0" />
              <span className="inline-flex items-center gap-0.5">
                이용약관 및 정책
                <ExternalLinkIcon className="size-4 shrink-0" />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="mx-0 transition-opacity delay-150 duration-300 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0" />

        {/* TODO: 유저 메뉴 추후 연결 */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={isLoggedIn ? (user?.name ?? '프로필') : 'Guest'}
              className="h-auto p-0"
            >
              <div className="flex items-center gap-2 px-1 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
                <ProfileIcon className="size-5 shrink-0" />
                <span className="typo-body-3 text-gray-600 transition-opacity delay-150 duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0">
                  {isLoggedIn ? `${user?.name ?? '...'}님` : 'Guest'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!isLoggedIn && (
            <li className="flex gap-2 overflow-hidden opacity-100 transition-opacity delay-150 duration-300 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0">
              <Button
                asChild
                size="md"
                color="primary"
                className="typo-btn-2 flex-1 whitespace-nowrap"
              >
                <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}>로그인</Link>
              </Button>
              <Button
                asChild
                size="md"
                color="secondary"
                className="typo-btn-2 flex-1 whitespace-nowrap"
              >
                <Link href={`/auth/signup?redirect=${encodeURIComponent(pathname)}`}>회원가입</Link>
              </Button>
            </li>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
