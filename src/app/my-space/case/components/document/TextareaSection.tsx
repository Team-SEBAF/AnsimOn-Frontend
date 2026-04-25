'use client';

import { useEffect, useRef } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import { SectionBlock } from './SectionBlock';
import { ContentBlock } from './ContentBlock';
import type { DocumentFormValues } from '@/types/document';

interface Props {
  title: string;
  required?: boolean;
  note: string;
  placeholder: string;
  fieldName: Path<DocumentFormValues>;
  register: UseFormRegister<DocumentFormValues>;
}

export function TextareaSection({
  title,
  required,
  note,
  placeholder,
  fieldName,
  register,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: registerRef, ...rest } = register(fieldName);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  });

  return (
    <SectionBlock title={title} required={required}>
      <ContentBlock note={note}>
        <textarea
          {...rest}
          ref={(el) => {
            registerRef(el);
            textareaRef.current = el;
          }}
          rows={6}
          placeholder={placeholder}
          className="typo-body-7 focus:border-primary w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300"
        />
      </ContentBlock>
    </SectionBlock>
  );
}
