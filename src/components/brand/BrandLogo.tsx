import type { ComponentPropsWithoutRef } from 'react';

import LogoSvg from '@/assets/logos/brand.svg';

type Props = {
  className?: string;
} & ComponentPropsWithoutRef<'svg'>;

export function BrandLogo({ className, ...props }: Props) {
  return <LogoSvg className={className} {...props} />;
}
