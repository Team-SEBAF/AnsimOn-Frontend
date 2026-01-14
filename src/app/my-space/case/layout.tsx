import type { ReactNode } from 'react';

export default function CaseLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <header>
        <h1>Case Flow</h1>
      </header>
      <div>{children}</div>
    </section>
  );
}
