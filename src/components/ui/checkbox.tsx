'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const checkboxVariants = {
  default:
    'border border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary hover:bg-gray-100',
  ghost: '',
};

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: keyof typeof checkboxVariants;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant = 'default', checked, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      className={cn(
        'peer focus-visible:ring-ring grid h-4 w-4 shrink-0 place-content-center rounded-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        checkboxVariants[variant],
        className,
      )}
      {...props}
    >
      {variant === 'ghost' ? (
        <Check className={cn('h-4 w-4', checked ? 'text-primary' : 'text-gray-300')} />
      ) : (
        <CheckboxPrimitive.Indicator className={cn('grid place-content-center text-current')}>
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
