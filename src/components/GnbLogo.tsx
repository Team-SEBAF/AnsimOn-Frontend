import Link from 'next/link';
import BrandLogo from '@/assets/logos/brand.svg';

//TODO: 경로 확인 후 수정
export function GnbLogo() {
  return (
    <h1>
      <Link href="/">
        <BrandLogo className="h-10.25 w-24" aria-hidden />
        <span className="sr-only">안심온</span>
      </Link>
    </h1>
  );
}
