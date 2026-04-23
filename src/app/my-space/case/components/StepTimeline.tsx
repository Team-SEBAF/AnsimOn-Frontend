'use client';

import { useState } from 'react';
import FileDownloadIcon from '@/assets/icons/FileDownloadIcon.svg';
import { Button } from '@/components/Button';
import { TabsList } from '@/components/ui/tabs';
import { AppTabs, AppTabsTrigger, AppTabsContent } from '@/components/AppTabs';
import { useTimeline, useDownloadTimeline } from '../hooks/useTimeline';
import { TimelineView } from './timeline/TimelineView';
import { ByDateView } from './timeline/ByDateView';
import { ByTypeView } from './timeline/ByTypeView';
import { EvidenceDownloadModal } from './timeline/EvidenceDownloadModal';

/**
 * 타임라인 정리 단계 (Step 2)
 * - 타임라인 보기 / 날짜별 보기 / 종류별 보기 탭
 * - 다운로드 버튼
 */
export function StepTimeline() {
  const { groups, allDates, allTags } = useTimeline();
  const downloadTimeline = useDownloadTimeline();
  const [downloadOpen, setDownloadOpen] = useState(false);

  const handleDownload = async () => {
    const { download_url } = await downloadTimeline.mutateAsync();
    window.open(download_url, '_blank');
    setDownloadOpen(false);
  };

  return (
    <div className="rounded-xl border border-[#F5F5F5] bg-white px-7 py-6 shadow-[0_20px_50px_-5px_rgba(64,64,64,0.05)]">
      <AppTabs defaultValue="timeline">
        {/* 탭 헤더 + 다운로드 버튼 */}
        <div className="mb-6 flex items-center justify-between">
          <TabsList className="h-auto rounded-none bg-transparent p-0">
            <AppTabsTrigger value="timeline">타임라인 보기</AppTabsTrigger>
            <AppTabsTrigger value="by-date">날짜별 보기</AppTabsTrigger>
            <AppTabsTrigger value="by-type">종류별 보기</AppTabsTrigger>
          </TabsList>
          <Button
            color="contrast"
            size="lg"
            className="typo-btn2 shrink-0"
            onClick={() => setDownloadOpen(true)}
          >
            <FileDownloadIcon width={24} height={24} className="text-white" />
            다운로드
          </Button>
        </div>

        {/* 탭 콘텐츠 */}
        <AppTabsContent value="timeline">
          <TimelineView groups={groups} />
        </AppTabsContent>
        <AppTabsContent value="by-date">
          <ByDateView groups={groups} allDates={allDates} />
        </AppTabsContent>
        <AppTabsContent value="by-type">
          <ByTypeView groups={groups} allTags={allTags} />
        </AppTabsContent>
      </AppTabs>

      <EvidenceDownloadModal
        open={downloadOpen}
        onOpenChange={setDownloadOpen}
        title="타임라인 다운로드"
        subTitle="타임라인으로 정리된 증거 자료 ZIP 파일입니다"
        fileName="안심은_증거분석타임라인.zip"
        onDownload={handleDownload}
        isDownloading={downloadTimeline.isPending}
      />
    </div>
  );
}
