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
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="rounded-3xl border border-zinc-200 bg-white px-8 py-10 shadow-sm">
          <p className="text-sm font-medium tracking-wide text-zinc-500">SEBAF FRONTEND</p>
          <h1 className="mt-3 text-3xl font-semibold">라우팅 구조 미리보기</h1>
          <p className="mt-2 text-zinc-600">
            My Space에서 판단 기능을 사용하고, 필요할 때만 로그인 후 고소장 작성 플로우로
            이어집니다.
          </p>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white px-8 py-8 shadow-sm">
          <h2 className="text-lg font-semibold">주요 사용자 흐름</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {primaryFlow.map((step, index) => (
              <li
                key={step.href}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="font-medium">{step.label}</span>
                  {step.requiresAuth ? (
                    <span className="rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-600">
                      로그인 필요
                    </span>
                  ) : null}
                </div>
                <Link
                  href={step.href}
                  className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
                >
                  이동
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white px-8 py-6 shadow-sm">
            <h2 className="text-lg font-semibold">인증</h2>
            <p className="mt-2 text-sm text-zinc-600">
              로그인은 데이터 저장/관리 시점에만 필요합니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {authLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white px-8 py-6 shadow-sm">
            <h2 className="text-lg font-semibold">마이페이지</h2>
            <p className="mt-2 text-sm text-zinc-600">로그인 유저 전용 영역입니다.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {accountLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
                >
                  <span className="mr-2">{item.label}</span>
                  {item.requiresAuth ? (
                    <span className="rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-600">
                      로그인 필요
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
