import type { ReactNode } from 'react';

export default function MySpaceLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <header>
        <h1>My Space</h1>
      </header>
      <div>{children}</div>
    </section>
  );
}
