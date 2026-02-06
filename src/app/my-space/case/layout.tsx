import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CaseLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <section>
        <header>
          <h1>Case Flow</h1>
        </header>
        <div>{children}</div>
      </section>
    </ProtectedRoute>
  );
}
