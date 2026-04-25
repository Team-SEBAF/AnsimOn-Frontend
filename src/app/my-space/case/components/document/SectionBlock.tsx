import type { ReactNode } from 'react';

interface SectionBlockProps {
  title: string;
  required?: boolean;
  children?: ReactNode;
}

export function SectionBlock({ title, required = false, children }: SectionBlockProps) {
  return (
    <section>
      <h3 className="typo-body-2 mb-3 text-gray-700">
        {title}
        {required && <span className="typo-label text-primary ml-1">필수</span>}
      </h3>
      {children}
    </section>
  );
}
