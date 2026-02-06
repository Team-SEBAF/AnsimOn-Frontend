import Link from 'next/link';
import { Button } from '@/components/Button';

const colors = ['primary', 'secondary', 'danger', 'success', 'warning', 'contrast'] as const;
const sizes = ['sm', 'md', 'lg', 'xl'] as const;
const variants = ['default', 'outline', 'ghost'] as const;

export default function ButtonPreviewPage() {
  return (
    <div className="space-y-20 bg-[#2A2A2A] p-8 text-white">
      <h1 className="text-2xl font-bold text-white">Button Preview</h1>

      <section className="space-y-16">
        {colors.map((color) => (
          <div key={color} className="space-y-6">
            <h3 className="text-lg font-medium text-white">{color}</h3>

            {variants.map((variant) => (
              <div key={variant} className="flex items-center gap-4">
                {sizes.map((size) => (
                  <Button key={size} color={color} variant={variant} size={size}>
                    {variant}-{size}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* ================= Disabled ================= */}
      <section className="space-y-16">
        <h2 className="text-xl font-semibold text-white">Disabled</h2>

        <div className="start flex gap-12">
          {colors.map((color) => (
            <div key={color} className="space-y-6">
              <h3 className="text-lg font-medium text-white">{color}</h3>

              {variants.map((variant) => (
                <div key={variant} className="flex items-center gap-4">
                  <Button key="lg" color={color} variant={variant} size="lg" disabled>
                    {variant}-lg
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      {/* ================= Icon Only ================= */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold text-white">Icon Only</h2>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">Sizes (rounded: full)</div>
          <div className="flex items-center gap-4">
            {sizes.map((size) => (
              <Button key={size} size={size} rounded="full" className="aspect-square p-0!">
                <span>⚙</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">Variants</div>
          <div className="flex items-center gap-4">
            {variants.map((variant) => (
              <Button key={variant} variant={variant} rounded="full" className="aspect-square p-0!">
                <span>⚙</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">Colors</div>
          <div className="flex items-center gap-4">
            {colors.map((color) => (
              <Button key={color} color={color} rounded="full" className="aspect-square p-0!">
                <span>⚙</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Icon + Text ================= */}
      <section className="space-y-16">
        <h2 className="text-xl font-semibold text-white">Icon + Text</h2>

        {colors.map((color) => (
          <div key={color} className="space-y-8">
            <h3 className="text-lg font-medium text-white">{color}</h3>

            {variants.map((variant) => (
              <div key={variant} className="flex items-center gap-4">
                {sizes.map((size) => (
                  <Button key={size} color={color} variant={variant} size={size} rounded="full">
                    <span>⚙</span> {variant}-{size}
                  </Button>
                ))}
              </div>
            ))}

            <div className="flex items-center gap-6">
              {/* 아이콘 + 라운드 사각형 */}
              <Button>
                <span>⚙</span> 설정
              </Button>

              {/* 아이콘 + 원형 */}
              <Button rounded="full">
                <span>⚙</span> 설정
              </Button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= asChild (Link as Button) ================= */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold text-white">asChild (Link as Button)</h2>

        <div className="flex items-center gap-4">
          {sizes.map((size) => (
            <Button key={size} asChild size={size}>
              <Link href="/test/components/button">Link {size}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/test/components/button">Outline Link</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/test/components/button">Ghost Link</Link>
          </Button>
        </div>
      </section>

      {/* ================= Loading ================= */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold text-white">Loading</h2>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">Sizes</div>
          <div className="flex items-center gap-4">
            {sizes.map((size) => (
              <Button key={size} size={size} loading>
                로딩 {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">Variants</div>
          <div className="flex items-center gap-4">
            {variants.map((variant) => (
              <Button key={variant} variant={variant} loading>
                {variant}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">Colors</div>
          <div className="flex items-center gap-4">
            {colors.map((color) => (
              <Button key={color} color={color} loading>
                {color}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
