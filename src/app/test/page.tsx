'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/Button';
import { logoutApi } from '@/api/auth/login';
import { axiosInstance } from '@/api/axiosInstance';

const items = [
  {
    href: '/test/design-system',
    badge: 'DESIGN SYSTEM',
    title: '디자인시스템 테스트',
    desc: '컬러 토큰(@theme) + 타이포(typo-*)를 한 페이지에서 확인',
  },
  {
    href: '/test/components',
    badge: 'COMPONENTS',
    title: '공용 컴포넌트 테스트',
    desc: '버튼/인풋/모달 등 공용 컴포넌트 데모 라우팅 허브',
  },
];

export default function TestHubPage() {
  const { isLoggedIn, logout } = useAuthStore();
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 액세스 토큰 만료시키기
  const expireAccessToken = () => {
    document.cookie = 'accessToken=expired_invalid_token; path=/';
    setTestResult('✅ 액세스 토큰을 만료시켰습니다. 이제 API를 호출해보세요.');
  };

  // users/me API 호출 테스트
  const testUsersMe = async () => {
    setIsLoading(true);
    setTestResult('API 호출 중...');
    try {
      const res = await axiosInstance.get('/api/v1/users/me');
      setTestResult(`✅ 성공: ${JSON.stringify(res.data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ 실패: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi(); // 서버에 로그아웃 요청
    } catch {
      // API 실패해도 로컬 로그아웃은 진행
    }
    logout(); // 쿠키 삭제 + 상태 초기화
    alert('로그아웃 되었습니다');
  };

  return (
    <main className="from-bg-1 bg-linear-to-b to-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-10 shadow-sm">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            TEST
            <span className="bg-primary h-1 w-1 rounded-full" aria-hidden />
            Hub
          </div>
          <h1 className="text-primary mt-4 text-4xl leading-tight font-semibold">테스트 페이지</h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">
            스타일/토큰/컴포넌트가 정상 동작하는지 빠르게 확인하는 라우팅 허브입니다.
          </p>

          {/* 로그인 상태 표시 */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              로그인 상태: {isLoggedIn ? '✅ 로그인됨' : '❌ 로그아웃'}
            </span>
            {isLoggedIn && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            )}
            {!isLoggedIn && (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
            )}
          </div>

          {/* 토큰 갱신 테스트 */}
          {isLoggedIn && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">🔧 토큰 갱신 테스트</h3>
              <p className="mt-1 text-xs text-gray-500">
                1. 토큰 만료 버튼 클릭 → 2. API 호출 버튼 클릭 → 3. 콘솔에서 갱신 로그 확인
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={expireAccessToken}>
                  1. 토큰 만료시키기
                </Button>
                <Button variant="default" size="sm" onClick={testUsersMe} disabled={isLoading}>
                  {isLoading ? '호출 중...' : '2. users/me 호출'}
                </Button>
              </div>
              {testResult && (
                <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-gray-100 p-3 text-xs text-gray-700">
                  {testResult}
                </pre>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-gray-200/70 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:shadow-sm"
            >
              홈으로
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold">
                {item.badge}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              <div className="text-primary mt-4 text-sm font-semibold opacity-0 transition group-hover:opacity-100">
                이동 →
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
