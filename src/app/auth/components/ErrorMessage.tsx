'use client';

import { FieldError } from 'react-hook-form';

type ErrorMessageProps = {
  error?: FieldError;
  touched?: boolean;
};

export function ErrorMessage({ error, touched }: ErrorMessageProps) {
  if (!error) return null;

  if (touched === false) return null;

  return (
    <p role="alert" aria-live="polite" className="text-sm text-red-500">
      {error.message}
    </p>
  );
}
