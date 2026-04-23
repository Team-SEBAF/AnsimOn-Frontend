import type { ReactNode } from 'react';

interface ContentBlockProps {
  title?: ReactNode; // 굵고 진한 텍스트 (예: "제출 예정 증거 목록")
  note?: ReactNode; // 연하고 작은 안내 텍스트 (예: "※ 고소이유에는...")
  children?: ReactNode; // 메인 컨텐츠 (textarea, 리스트 등)
}

export function ContentBlock({ title, note, children }: ContentBlockProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
      {title && <p className="typo-heading-5 text-black">{title}</p>}
      {note && <p className="typo-body-8 text-gray-400">{note}</p>}
      {children}
    </div>
  );
}
