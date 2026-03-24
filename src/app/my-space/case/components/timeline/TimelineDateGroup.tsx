import AddEventIcon from '@/assets/icons/AddEventIcon.svg';
import EventIconContainer from '@/assets/icons/EventIconContainer.svg';
import { TimelineItemCard } from './TimelineItemCard';
import type { TimelineDateGroup as TimelineDateGroupType } from '@/types/timeline';

interface TimelineDateGroupProps {
  group: TimelineDateGroupType;
  onAdd: (date: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 날짜 단위 타임라인 그룹
 * - 날짜 헤더 (주황 dot + 날짜 + 추가하기 버튼)
 * - 좌측 선(border-l) + 해당 날짜의 증거 카드 목록
 */
export function TimelineDateGroup({ group, onAdd, onEdit, onDelete }: TimelineDateGroupProps) {
  return (
    <div className="mb-1">
      {/* 날짜 헤더 */}
      <div className="mb-2 flex items-center gap-3">
        <EventIconContainer width={12} height={12} />
        <span className="typo-body-3 text-gray-700">{group.date}</span>
        <button
          className="typo-headoing-6 group hover:text-primary flex items-center text-gray-400"
          onClick={() => onAdd(group.date)}
        >
          <AddEventIcon width={16} height={16} className="group-hover:text-primary text-gray-400" />
          추가하기
        </button>
      </div>

      {/* 카드 목록 — ml-1로 dot 중앙에 선 정렬 */}
      <div className="ml-1 space-y-2 border-l border-gray-200 pl-4">
        {group.events.map((event) =>
          event.evidences.map((evidence) => (
            <TimelineItemCard
              key={evidence.timeline_evidence_id}
              time={event.time}
              evidence={evidence}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )),
        )}
      </div>
    </div>
  );
}
