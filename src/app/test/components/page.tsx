import Link from 'next/link';

const componentLinks = [
  { href: '/test/components/buttons', label: 'Buttons (추가 예정)', disabled: true },
  { href: '/test/components/forms', label: 'Forms (추가 예정)', disabled: true },
  { href: '/test/components/dialogs', label: 'Dialogs (추가 예정)', disabled: true },
];

export default function ComponentsTestHub() {
  return (
    <main className="from-bg-1 bg-linear-to-b to-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-10 shadow-sm">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            TEST
            <span className="bg-primary h-1 w-1 rounded-full" aria-hidden />
            Components
          </div>
          <h1 className="text-primary mt-4 text-4xl leading-tight font-semibold">
            공용 컴포넌트 테스트
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">
            공용 컴포넌트 데모를 라우팅 단위로 추가할 수 있는 허브입니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/test"
              className="rounded-full border border-gray-200/70 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:shadow-sm"
            >
              ← 테스트 허브로
            </Link>
            <Link
              href="/test/design-system"
              className="border-primary/30 bg-bg-1 text-primary hover:border-primary rounded-full border px-4 py-2 text-sm font-semibold transition hover:shadow-sm"
            >
              디자인시스템 테스트 →
            </Link>
          </div>
        </header>

        <section className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-8 shadow-sm">
          <h2 className="text-primary text-lg font-semibold">카테고리</h2>
          <p className="mt-2 text-sm text-gray-600">아래는 라우팅 자리만 만들어둔 상태입니다.</p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {componentLinks.map((item) =>
              item.disabled ? (
                <div
                  key={item.href}
                  className="bg-bg-1 rounded-2xl border border-gray-200/70 px-5 py-4 text-sm font-semibold text-gray-500 shadow-sm"
                >
                  {item.label}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-bg-1 hover:border-primary/30 rounded-2xl border border-gray-200/70 px-5 py-4 text-sm font-semibold text-gray-900 shadow-sm transition hover:shadow-md"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
