import { EvidenceCard } from './evidence/EvidenceCard';
import type { EvidenceType } from '@/types/evidence';

/** 왼쪽: 이미지 프리뷰 카드 */
const LEFT_TYPES: EvidenceType[] = ['MESSAGE', 'TRACKING'];

/** 오른쪽: 파일 프리뷰 카드 */
const RIGHT_TYPES: EvidenceType[] = ['VOICE', 'REPORT_RECORD', 'INCIDENT_LOG'];

interface StepCollectProps {
  complaintId: string | undefined;
}

export function StepCollect({ complaintId }: StepCollectProps) {
  return (
    <div className="flex gap-6">
      {/* 왼쪽 컬럼 — 이미지 프리뷰 */}
      <div className="flex flex-1 flex-col gap-6">
        {LEFT_TYPES.map((type) => (
          <EvidenceCard key={type} type={type} complaintId={complaintId} />
        ))}
      </div>

      {/* 오른쪽 컬럼 — 파일 프리뷰 */}
      <div className="flex flex-1 flex-col gap-6">
        {RIGHT_TYPES.map((type) => (
          <EvidenceCard key={type} type={type} complaintId={complaintId} />
        ))}
      </div>
    </div>
  );
}
