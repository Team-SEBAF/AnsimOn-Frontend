import { AuthLogo } from '@/components/AuthLogo';
import * as React from 'react';

/**
 * 인증 레이아웃 컴포넌트
 *
 * - 좌측: 메인 콘텐츠 영역 (헤더 + 페이지별 콘텐츠)
 * - 우측: 보조 이미지 영역 (큰 화면에서만 표시)
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      {/* 좌측: 메인 콘텐츠 영역 */}
      <main className="w-120 bg-(--app-gray-100) px-12 py-7.5">
        <header className="mb-12 flex items-center gap-2">
          <AuthLogo />
        </header>

        {/* 페이지별 콘텐츠 */}
        {children}
      </main>

      {/* 우측: 보조 이미지 영역 */}
      <aside className="hidden flex-1 items-center justify-center bg-white px-15 py-20 lg:flex">
        <div className="w-full max-w-150 rounded-2xl bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="aspect-video w-full rounded-xl bg-[#D9D9D9]" />
          <div className="mx-auto mt-8 h-6 w-2/3 rounded bg-gray-200" />
          <div className="mt-8 flex justify-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          </div>
        </div>
      </aside>
    </div>
  );
}
