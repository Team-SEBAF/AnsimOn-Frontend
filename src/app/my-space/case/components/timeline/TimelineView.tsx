import { TimelineDateGroup } from './TimelineDateGroup';
import type { TimelineDateGroup as TimelineDateGroupType } from '@/types/timeline';

interface TimelineViewProps {
  groups: TimelineDateGroupType[];
  onAdd: (date: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/** 타임라인 보기 탭 — 날짜 그룹 순서대로 나열 */
export function TimelineView({ groups, onAdd, onEdit, onDelete }: TimelineViewProps) {
  return (
    <div>
      {groups.map((group) => (
        <TimelineDateGroup
          key={group.date}
          group={group}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
