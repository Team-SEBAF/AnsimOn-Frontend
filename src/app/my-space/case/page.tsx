'use client';

import { CaseProgress } from './components/CaseProgress';

export default function CasePage() {
  return (
    <div>
      <CaseProgress currentStep={1} />
    </div>
  );
}
