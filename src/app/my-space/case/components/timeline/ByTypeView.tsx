'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { TAG_LABEL_MAP, type TimelineTag, type TimelineDateGroup } from '@/types/timeline';
import { TimelineView } from './TimelineView';

interface ByTypeViewProps {
  groups: TimelineDateGroup[];
  allTags: TimelineTag[];
  onAdd: (date: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/** 종류별 보기 탭 — 태그 pill 선택 시 해당 태그 카드만 표시 */
export function ByTypeView({ groups, allTags, onAdd, onEdit, onDelete }: ByTypeViewProps) {
  const [selectedTag, setSelectedTag] = useState<TimelineTag>(allTags[0]);

  // 선택된 태그를 가진 증거만 남기도록 그룹 필터링
  const filtered = groups
    .map((group) => ({
      ...group,
      events: group.events
        .map((event) => ({
          ...event,
          evidences: event.evidences.filter((e) => e.tags.includes(selectedTag)),
        }))
        .filter((event) => event.evidences.length > 0),
    }))
    .filter((group) => group.events.length > 0);

  return (
    <div className="space-y-6">
      {/* 태그 pill 필터 */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Button
            key={tag}
            size="lg"
            color={tag === selectedTag ? 'primary' : 'secondary'}
            variant="outline"
            onClick={() => setSelectedTag(tag)}
          >
            {TAG_LABEL_MAP[tag]}
          </Button>
        ))}
      </div>

      {/* 필터된 카드 목록 */}
      <TimelineView groups={filtered} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
