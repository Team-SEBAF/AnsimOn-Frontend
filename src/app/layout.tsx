import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer, Slide } from 'react-toastify';
import '@/app/styles/index.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { QueryProvider } from '@/components/providers/QueryClientProvider';

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
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          closeButton={false}
          hideProgressBar
          stacked
          transition={Slide}
        />
      </body>
    </html>
  );
}
