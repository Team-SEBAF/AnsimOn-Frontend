import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';

// ─── 스타일 오버라이드 ────────────────────────────────────

const AppDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, style, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    className={cn(
      'flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-none',
      className,
    )}
    style={{
      boxShadow: '0 1px 4px rgba(12,12,13,0.05), 0 1px 4px rgba(12,12,13,0.10)',
      ...style,
    }}
    {...props}
  />
));
AppDropdownMenuContent.displayName = 'AppDropdownMenuContent';

const AppDropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <DropdownMenuSeparator ref={ref} className={cn('bg-gray-100', className)} {...props} />
));
AppDropdownMenuSeparator.displayName = 'AppDropdownMenuSeparator';

// ─── Re-export ────────────────────────────────────────────

export {
  DropdownMenu,
  DropdownMenuTrigger,
  AppDropdownMenuContent,
  AppDropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
};
