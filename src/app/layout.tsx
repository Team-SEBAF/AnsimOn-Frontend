import type { Metadata } from 'next';
import '@/app/styles/index.css';

export const metadata: Metadata = {
  title: 'AnsimOn',
  description: 'AnsimOn Frontend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
