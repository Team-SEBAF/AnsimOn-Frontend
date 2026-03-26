'use client';

import { useState } from 'react';
import AddEventIcon from '@/assets/icons/AddEventIcon.svg';
import EventIconContainer from '@/assets/icons/EventIconContainer.svg';
import { TimelineItemCard } from './TimelineItemCard';
import { TimelineFormModal } from './TimelineFormModal';
import type { TimelineDateGroup as TimelineDateGroupType } from '@/types/timeline';

interface TimelineDateGroupProps {
  group: TimelineDateGroupType;
}

/**
 * 날짜 단위 타임라인 그룹
 * - 날짜 헤더 (dot + 날짜 + 추가하기 버튼)
 * - 좌측 선(border-l) + 해당 날짜의 증거 카드 목록
 */
export function TimelineDateGroup({ group }: TimelineDateGroupProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <div className="mb-1">
        {/* 날짜 헤더 */}
        <div className="mb-2 flex items-center gap-3">
          <EventIconContainer width={12} height={12} />
          <span className="typo-body-3 text-gray-700">{group.date}</span>
          <button
            className="typo-headoing-6 group hover:text-primary flex items-center text-gray-400"
            onClick={() => setAddOpen(true)}
          >
            <AddEventIcon
              width={16}
              height={16}
              className="group-hover:text-primary text-gray-400"
            />
            추가하기
          </button>
        </div>

        {/* 카드 목록 */}
        <div className="ml-1.5 space-y-2 border-l-2 border-gray-100 pl-6">
          {group.events.map((event) =>
            event.evidences.map((evidence) => (
              <TimelineItemCard
                key={evidence.timeline_evidence_id}
                date={group.date}
                time={event.time}
                evidence={evidence}
              />
            )),
          )}
        </div>
      </div>

      {/* 추가 모달 */}
      <TimelineFormModal
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="add"
        initialDate={group.date}
      />
    </>
  );
}
