'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { TAG_LABEL_MAP, type TimelineTag, type TimelineDateGroup } from '@/types/timeline';
import { TimelineView } from './TimelineView';

interface ByTypeViewProps {
  groups: TimelineDateGroup[];
  allTags: TimelineTag[];
}

/** 종류별 보기 탭 — 태그 pill 선택 시 해당 태그 카드만 표시, null = 태그 없음 */
export function ByTypeView({ groups, allTags }: ByTypeViewProps) {
  const [selectedTag, setSelectedTag] = useState<TimelineTag | null>(allTags[0] ?? null);

  const filtered = groups
    .map((group) => ({
      ...group,
      events: group.events
        .map((event) => ({
          ...event,
          evidences: event.evidences.filter((e) =>
            selectedTag === null ? e.tags.length === 0 : e.tags.includes(selectedTag),
          ),
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
        <Button
          size="lg"
          color={selectedTag === null ? 'primary' : 'secondary'}
          variant="outline"
          onClick={() => setSelectedTag(null)}
        >
          없음
        </Button>
      </div>

      <TimelineView groups={filtered} />
    </div>
  );
}
