import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/styles/index.css';

export const metadata: Metadata = {
  title: 'AnsimOn',
  description: 'AnsimOn Frontend',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
