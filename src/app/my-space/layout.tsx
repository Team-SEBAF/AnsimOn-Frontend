import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MySpaceSidebar } from '@/components/MySpaceSidebar';

export default function MySpaceLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-bg1 flex min-h-screen w-full px-6 py-4">
        <MySpaceSidebar />
        <main className="bg-bg-2 flex-1 rounded-3xl">{children}</main>
      </div>
    </SidebarProvider>
  );
}
