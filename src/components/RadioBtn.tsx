'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface RadioBtnProps {
  checked?: boolean;
  onChange?: () => void;
  className?: string;
}

export const RadioBtn = React.forwardRef<HTMLInputElement, RadioBtnProps>(
  ({ checked, onChange, className }, ref) => (
    <span
      className={cn(
        'relative inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[1.5px] border-gray-200 bg-white',
        className,
      )}
      onClick={onChange}
    >
      <input ref={ref} type="radio" checked={checked} onChange={onChange} className="sr-only" />
      {checked && <span className="bg-primary h-2.5 w-2.5 rounded-full" />}
    </span>
  ),
);
RadioBtn.displayName = 'RadioBtn';
