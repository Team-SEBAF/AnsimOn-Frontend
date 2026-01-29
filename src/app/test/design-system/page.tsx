import Link from 'next/link';

const typoRows: { label: string; className: string }[] = [
  { label: 'typo-display-1', className: 'typo-display-1' },
  { label: 'typo-display-2', className: 'typo-display-2' },
  { label: 'typo-display-3', className: 'typo-display-3' },

  { label: 'typo-heading-1', className: 'typo-heading-1' },
  { label: 'typo-heading-2', className: 'typo-heading-2' },
  { label: 'typo-heading-3', className: 'typo-heading-3' },
  { label: 'typo-heading-4', className: 'typo-heading-4' },
  { label: 'typo-heading-5', className: 'typo-heading-5' },
  { label: 'typo-heading-6', className: 'typo-heading-6' },

  { label: 'typo-body-1', className: 'typo-body-1' },
  { label: 'typo-body-2', className: 'typo-body-2' },
  { label: 'typo-body-3', className: 'typo-body-3' },
  { label: 'typo-body-4', className: 'typo-body-4' },
  { label: 'typo-body-5', className: 'typo-body-5' },
  { label: 'typo-body-6', className: 'typo-body-6' },
  { label: 'typo-body-7', className: 'typo-body-7' },
  { label: 'typo-body-8', className: 'typo-body-8' },

  { label: 'typo-btn-1', className: 'typo-btn-1' },
  { label: 'typo-btn-2', className: 'typo-btn-2' },
  { label: 'typo-btn-3', className: 'typo-btn-3' },

  { label: 'typo-placeholder', className: 'typo-placeholder' },
  { label: 'typo-label', className: 'typo-label' },
  { label: 'typo-caption', className: 'typo-caption' },
];

export default function DesignSystemTestPage() {
  return (
    <main className="from-bg-1 bg-linear-to-b to-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-12">
        {/* Header */}
        <header className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-10 shadow-sm">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            TEST
            <span className="bg-primary h-1 w-1 rounded-full" aria-hidden />
            Design System
          </div>
          <h1 className="text-primary mt-4 text-4xl leading-tight font-semibold">
            디자인시스템 테스트
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">
            컬러 토큰(@theme)과 타이포 유틸(typo-*)이 정상 적용되는지 확인합니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/test"
              className="rounded-full border border-gray-200/70 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:shadow-sm"
            >
              ← 테스트 허브로
            </Link>
            <Link
              href="/test/components"
              className="border-primary/30 bg-bg-1 text-primary hover:border-primary rounded-full border px-4 py-2 text-sm font-semibold transition hover:shadow-sm"
            >
              공용 컴포넌트 테스트 →
            </Link>
          </div>
        </header>

        {/* Color */}
        <section className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-8 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-primary text-lg font-semibold">컬러 토큰 테스트</h2>
              <p className="mt-2 text-sm text-gray-600">
                아래 블록들이 의도한 색으로 보이면 정상입니다.
              </p>
            </div>
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[11px] font-semibold">
              @theme 확인
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-red-500 px-5 py-4 text-white shadow-sm">
              Tailwind bg-red-500 (이게 안 보이면 Tailwind 자체가 안 먹는 상태)
            </div>

            <div className="bg-bg-2 text-primary rounded-2xl border border-gray-200/70 px-5 py-4 shadow-sm">
              text-primary / bg-bg-2 테스트
            </div>

            <div className="bg-bg-1 rounded-2xl border border-gray-200/70 px-5 py-4 shadow-sm">
              <div className="flex flex-wrap gap-3">
                <div className="bg-primary rounded-full px-4 py-2 text-sm font-semibold text-white">
                  bg-primary
                </div>
                <div className="bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-semibold">
                  bg-primary/10
                </div>
                <div className="border-primary/30 text-primary rounded-full border px-4 py-2 text-sm font-semibold">
                  border-primary/30
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200/70 bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">bg-bg-1 / bg-bg-2</p>
                  <p className="mt-1 text-sm text-gray-600">
                    bg-bg-1은 연한 배경, bg-bg-2는 카드 배경(흰색)이어야 함
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200/70 bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">text-primary</p>
                  <p className="mt-1 text-sm text-gray-600">텍스트가 브랜드 컬러로 보이면 정상</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="bg-bg-2 rounded-3xl border border-gray-200/70 px-8 py-8 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-primary text-lg font-semibold">타이포 유틸 테스트</h2>
              <p className="mt-2 text-sm text-gray-600">
                각 row가 서로 다른 크기/줄높이/두께로 보이면 정상입니다.
              </p>
            </div>
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[11px] font-semibold">
              typo-* 확인
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {typoRows.map((row) => (
              <div
                key={row.label}
                className="bg-bg-1 rounded-2xl border border-gray-200/70 px-5 py-4 shadow-sm"
              >
                <div className="text-xs font-semibold text-gray-500">{row.label}</div>
                <div className={`mt-2 ${row.className}`}>
                  가나다라마바사 ABC 123 — Typography Token Test
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
