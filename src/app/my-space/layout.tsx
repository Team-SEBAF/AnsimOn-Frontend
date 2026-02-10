import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MySpaceSidebar } from '@/components/MySpaceSidebar';

export default function MySpaceLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full px-6 pt-4">
        <MySpaceSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
