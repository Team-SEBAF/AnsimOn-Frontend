import Link from 'next/link';

const primaryFlow = [
  { href: '/my-space/stalking', label: '스토킹 판단' },
  { href: '/my-space/evidence', label: '증거 유효성 판단' },
  { href: '/my-space/case/collect', label: '증거 수집', requiresAuth: true },
  { href: '/my-space/case/timeline', label: '타임라인 정리', requiresAuth: true },
  { href: '/my-space/case/document', label: '고소장/진술서 작성', requiresAuth: true },
  { href: '/my-space/case/complete', label: '완료 및 다운로드', requiresAuth: true },
];

const authLinks = [
  { href: '/auth/login', label: '로그인' },
  { href: '/auth/signup', label: '회원가입' },
];

const accountLinks = [
  { href: '/my-page', label: '내 정보 조회', requiresAuth: true },
  { href: '/my-page/edit', label: '회원 정보 수정', requiresAuth: true },
];

export default function Home() {
  return (
    <main className="from-bg-1 bg-gradient-to-b to-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-12">
        {/* Header */}
        <header className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-10 shadow-sm">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            SEBAF FRONTEND
            <span className="bg-primary h-1 w-1 rounded-full" aria-hidden />
            라우팅 프리뷰
          </div>
          <h1 className="text-primary mt-4 text-4xl leading-tight font-semibold">
            AnsimOn 사용자 여정 미리보기
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">
            My Space의 판단 기능을 우선 제공하고, 필요할 때만 로그인하여 고소장·진술서 작성으로
            이어지는 흐름을 확인할 수 있습니다.
          </p>
        </header>

        {/* Primary Flow */}
        <section className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-8 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-primary text-lg font-semibold">주요 사용자 흐름</h2>
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[11px] font-semibold">
              로그인 필요 단계 표시
            </span>
          </div>

          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {primaryFlow.map((step, index) => (
              <li
                key={step.href}
                className="group bg-bg-1 hover:border-primary/30 rounded-2xl border border-gray-200/70 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{step.label}</p>
                      {step.requiresAuth && (
                        <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                          로그인 필요
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={step.href}
                    className="text-primary text-sm font-semibold opacity-0 transition group-hover:opacity-100 hover:underline"
                  >
                    이동 →
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Auth / Account */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1.2fr]">
          <div className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-7 shadow-sm">
            <h2 className="text-primary text-lg font-semibold">인증</h2>
            <p className="mt-2 text-sm text-gray-600">
              로그인은 데이터 저장/관리 시점에만 필요합니다.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {authLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-primary/30 bg-bg-1 text-primary hover:border-primary rounded-full border px-4 py-2 text-sm font-semibold transition hover:shadow-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-7 shadow-sm">
            <h2 className="text-primary text-lg font-semibold">마이페이지</h2>
            <p className="mt-2 text-sm text-gray-600">로그인 유저 전용 영역입니다.</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {accountLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-primary/30 bg-bg-1 text-primary hover:border-primary rounded-full border px-4 py-2 text-sm font-semibold transition hover:shadow-sm"
                >
                  {item.label}
                  {item.requiresAuth && (
                    <span className="ml-2 text-xs text-gray-600">(로그인 필요)</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="space-y-4 p-6">
            {/* 1. Tailwind 기본 유틸리티 테스트 */}
            <div className="rounded-md bg-red-500 p-4 text-white">
              Tailwind bg-red-500 (이게 안 보이면 Tailwind 자체가 안 먹는 상태)
            </div>

            {/* 2. semantic 컬러 (CSS 변수) 테스트 */}
            <div className="bg-bg-2 text-primary rounded-md p-4">text-primary / bg-bg-2 테스트</div>

            {/* 3. CSS 변수 직접 확인 */}
            <div style={{ color: 'var(--color-primary)' }}>inline style: var(--color-primary)</div>

            {/* 4. 현재 CSS 변수 값 출력용 힌트 */}
            <div className="text-sm">
              <code>--color-primary</code> 값이 실제 색으로 보이면 tokens.css 정상
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
