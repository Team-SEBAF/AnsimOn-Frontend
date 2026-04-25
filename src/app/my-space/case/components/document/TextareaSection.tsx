'use client';

import { useEffect, useRef } from 'react';
import type { UseFormRegister, RegisterOptions, FieldError } from 'react-hook-form';
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
  rules?: RegisterOptions<DocumentFormValues, Path<DocumentFormValues>>;
  error?: FieldError;
}

export function TextareaSection({
  title,
  required,
  note,
  placeholder,
  fieldName,
  register,
  rules,
  error,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: registerRef, ...rest } = register(fieldName, rules);

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
          aria-invalid={!!error}
          className="typo-body-7 focus:border-primary w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300"
        />
        {error?.message && <p className="typo-body-8 text-error mt-1">{error.message}</p>}
      </ContentBlock>
    </SectionBlock>
  );
}
