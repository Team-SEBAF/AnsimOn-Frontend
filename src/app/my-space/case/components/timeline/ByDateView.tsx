'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { TimelineView } from './TimelineView';
import type { TimelineDateGroup } from '@/types/timeline';

interface ByDateViewProps {
  groups: TimelineDateGroup[];
  allDates: string[];
}

/** 날짜별 보기 탭 — 날짜 pill 선택 시 해당 날짜 그룹만 표시 */
export function ByDateView({ groups, allDates }: ByDateViewProps) {
  const [selectedDate, setSelectedDate] = useState(allDates[0]);

  const filtered = groups.filter((g) => g.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* 날짜 pill 필터 */}
      <div className="flex flex-wrap gap-2">
        {allDates.map((date) => (
          <Button
            key={date}
            size="lg"
            color={date === selectedDate ? 'primary' : 'secondary'}
            variant="outline"
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </Button>
        ))}
      </div>

      <TimelineView groups={filtered} />
    </div>
  );
}
