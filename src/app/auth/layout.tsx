import { AuthLogo } from '@/components/AuthLogo';
import Slider from '@/components/Slider';
import * as React from 'react';

/**
 * 인증 레이아웃 컴포넌트
 *
 * - 좌측: 메인 콘텐츠 영역 (헤더 + 페이지별 콘텐츠)
 * - 우측: 슬라이더 영역 (큰 화면에서만 표시)
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* 좌측: 메인 콘텐츠 영역 (스크롤 가능) */}
      <main className="no-scrollbar h-screen w-120 overflow-y-auto bg-gray-100 px-12 py-7.5">
        <header className="mb-12 flex items-center gap-2">
          <AuthLogo />
        </header>

        {/* 페이지별 콘텐츠 */}
        {children}
      </main>

      {/* 우측: 슬라이더 영역 (스크롤 없음) */}
      <aside className="hidden h-screen flex-1 items-center justify-center overflow-hidden bg-white px-15 py-20 lg:flex">
        <div className="w-full max-w-160">
          <Slider />
        </div>
      </aside>
    </div>
  );
}
