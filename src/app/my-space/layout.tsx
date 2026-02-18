import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MySpaceSidebar } from '@/components/MySpaceSidebar';

export default function MySpaceLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-bg1 flex min-h-screen w-full pt-4 pl-6">
        <MySpaceSidebar />
        <main className="bg-bg-2 flex-1 rounded-tl-3xl border border-(--app-gray-100)">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
