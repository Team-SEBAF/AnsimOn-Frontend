'use client';

import { useTimeline } from '../hooks/useTimeline';
import { TimelineDateGroup } from './timeline/TimelineDateGroup';

interface StepTimelineProps {
  complaintId: string;
}

/**
 * 타임라인 정리 단계 (Step 2)
 * - 날짜별 그룹으로 증거 카드 렌더링
 * - 추후 탭(타임라인 보기 / 날짜별 / 종류별) 및 다운로드 버튼 추가 예정
 */
export function StepTimeline({ complaintId }: StepTimelineProps) {
  const { groups } = useTimeline(complaintId);

  return (
    <div>
      {groups.map((group) => (
        <TimelineDateGroup
          key={group.date}
          group={group}
          onAdd={(date) => console.log('add', date)}
          onEdit={(id) => console.log('edit', id)}
          onDelete={(id) => console.log('delete', id)}
        />
      ))}
    </div>
  );
}
