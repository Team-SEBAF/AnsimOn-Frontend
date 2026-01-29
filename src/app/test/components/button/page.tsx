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
      <section className="space-y-16">
        <h2 className="text-xl font-semibold text-white">Icon Only</h2>

        {colors.map((color) => (
          <div key={color} className="space-y-8">
            <h3 className="text-lg font-medium text-white">{color}</h3>

            {/* Default */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">default</div>

              {variants.map((variant) => (
                <div key={variant} className="flex items-center gap-4">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      color={color}
                      variant={variant}
                      size={size}
                      rounded="full"
                      leftIcon={<span>⚙</span>}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6">
              {/* 아이콘 + 라운드 사각형 */}
              <Button leftIcon={<span>⚙</span>} />

              {/* 아이콘 + 원형 */}
              <Button leftIcon={<span>⚙</span>} rounded="full" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
