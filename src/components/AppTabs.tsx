'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

/** 라인(밑줄) 스타일 탭 트리거 */
const AppTabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'typo-heading-3 h-9.5 w-40 border-b-2 border-transparent px-4 pb-3 text-gray-400 transition-all duration-200 hover:border-gray-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900',
      className,
    )}
    {...props}
  />
));
AppTabsTrigger.displayName = 'AppTabsTrigger';

export { AppTabsTrigger };
export { Tabs as AppTabs, TabsContent as AppTabsContent } from '@/components/ui/tabs';
