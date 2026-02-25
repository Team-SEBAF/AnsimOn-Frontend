import { EvidenceCard } from './evidence/EvidenceCard';
import type { EvidenceType } from './evidence/constants';

/** 왼쪽: 이미지 프리뷰 카드 */
const LEFT_TYPES: EvidenceType[] = ['MESSAGE', 'TRACKING'];

/** 오른쪽: 파일 프리뷰 카드 */
const RIGHT_TYPES: EvidenceType[] = ['VOICE', 'REPORT_RECORD', 'INCIDENT_LOG'];

export function StepCollect() {
  return (
    <div className="flex gap-6">
      {/* 왼쪽 컬럼 — 이미지 프리뷰 */}
      <div className="flex flex-1 flex-col gap-6">
        {LEFT_TYPES.map((type) => (
          <EvidenceCard key={type} type={type} />
        ))}
      </div>

      {/* 오른쪽 컬럼 — 파일 프리뷰 */}
      <div className="flex flex-1 flex-col gap-6">
        {RIGHT_TYPES.map((type) => (
          <EvidenceCard key={type} type={type} />
        ))}
      </div>
    </div>
  );
}
