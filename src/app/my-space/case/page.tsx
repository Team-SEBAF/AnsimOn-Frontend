'use client';

import { useState } from 'react';
import { CaseHeader } from './components/CaseHeader';
import { CaseProgress } from './components/CaseProgress';

export default function CasePage() {
  // TODO: React Query로 전환
  // - useQuery로 GET /api/v1/complaints/my-complaint 조회 (title, step, updatedAt)
  // - useMutation으로 PATCH /api/v1/complaints/my-complaint (title, step 저장)
  // - useState 제거 후 서버 데이터로 대체
  const [title, setTitle] = useState('사건 제목');

  return (
    <div>
      <CaseHeader
        title={title}
        onTitleChange={setTitle}
        onSave={() => {}}
        onPrev={() => {}}
        onNext={() => {}}
        hasPrev={false}
        hasNext={true}
        updatedAt="2021.02.22"
      />
      <CaseProgress currentStep={1} />
    </div>
  );
}
