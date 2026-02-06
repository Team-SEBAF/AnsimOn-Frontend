import Link from 'next/link';
import BrandLogo from '@/assets/logos/brand.svg';

export function AuthLogo() {
  return (
    <h1>
      <Link href="/">
        <BrandLogo className="h-11 w-25" aria-hidden />
        <span className="sr-only">안심온</span>
      </Link>
    </h1>
  );
}
