'use client';

import FileDownloadIcon from '@/assets/icons/FileDownloadIcon.svg';
import { Button } from '@/components/Button';
import { TabsList } from '@/components/ui/tabs';
import { AppTabs, AppTabsTrigger, AppTabsContent } from '@/components/AppTabs';
import { useTimeline } from '../hooks/useTimeline';
import { TimelineView } from './timeline/TimelineView';
import { ByDateView } from './timeline/ByDateView';
import { ByTypeView } from './timeline/ByTypeView';

interface StepTimelineProps {
  complaintId: string;
}

/**
 * 타임라인 정리 단계 (Step 2)
 * - 타임라인 보기 / 날짜별 보기 / 종류별 보기 탭
 * - 다운로드 버튼
 */
export function StepTimeline({ complaintId }: StepTimelineProps) {
  const { groups, allDates, allTags } = useTimeline(complaintId);

  const handlers = {
    onAdd: (date: string) => console.log('add', date),
    onEdit: (id: string) => console.log('edit', id),
    onDelete: (id: string) => console.log('delete', id),
  };

  return (
    <AppTabs defaultValue="timeline">
      {/* 탭 헤더 + 다운로드 버튼 */}
      <div className="mb-6 flex items-center justify-between">
        <TabsList className="h-auto rounded-none bg-transparent p-0">
          <AppTabsTrigger value="timeline">타임라인 보기</AppTabsTrigger>
          <AppTabsTrigger value="by-date">날짜별 보기</AppTabsTrigger>
          <AppTabsTrigger value="by-type">종류별 보기</AppTabsTrigger>
        </TabsList>
        <Button color="contrast" size="lg" className="typo-btn2 shrink-0">
          <FileDownloadIcon width={24} height={24} className="text-white" />
          다운로드
        </Button>
      </div>

      {/* 탭 콘텐츠 */}
      <AppTabsContent value="timeline">
        <TimelineView groups={groups} {...handlers} />
      </AppTabsContent>
      <AppTabsContent value="by-date">
        <ByDateView groups={groups} allDates={allDates} {...handlers} />
      </AppTabsContent>
      <AppTabsContent value="by-type">
        <ByTypeView groups={groups} allTags={allTags} {...handlers} />
      </AppTabsContent>
    </AppTabs>
  );
}
