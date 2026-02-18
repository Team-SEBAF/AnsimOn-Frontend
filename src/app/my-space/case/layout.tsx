import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CaseLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <section>
        <div>{children}</div>
      </section>
    </ProtectedRoute>
  );
}
