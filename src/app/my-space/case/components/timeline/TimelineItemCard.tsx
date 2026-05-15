'use client';

import { useState } from 'react';
import EllipsisIcon from '@/assets/icons/ellipsis-vertical.svg';
import EditIcon from '@/assets/icons/EditOutlineIcon.svg';
import TrashIcon from '@/assets/icons/TrashOutlineIcon.svg';
import voiceFallback from '@/assets/voice-fallback.png';
import fileFallback from '@/assets/file-fallback.png';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  AppDropdownMenuContent,
  AppDropdownMenuSeparator,
} from '@/components/AppDropdownMenu';
import { ImagePreview } from '../evidence/ImagePreview';
import { formatDuration } from '@/utils/format';
import { TimelineTagBadge } from './TimelineTagBadge';
import { TimelineDeleteDialog } from './TimelineDeleteDialog';
import { TimelineFormModal } from './TimelineFormModal';
import { EvidenceDownloadModal } from './EvidenceDownloadModal';
import type { TimelineEvidence } from '@/types/timeline';
import { useDeleteTimelineEvidences } from '../../hooks/useTimeline';

type ModalType = 'edit' | 'delete' | 'download' | null;

interface TimelineItemCardProps {
  date: string;
  time: string;
  evidence: TimelineEvidence;
}

/**
 * 타임라인 증거 카드
 * - 시각 / 썸네일 / 제목·설명·태그 / 수정·삭제·다운로드 드롭다운
 */
export function TimelineItemCard({ date, time, evidence }: TimelineItemCardProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const deleteEvidences = useDeleteTimelineEvidences();

  const {
    timeline_evidence_id,
    title,
    description,
    tags,
    has_thumbnail,
    thumbnail_url,
    duration_seconds,
    referenced_evidence_count,
  } = evidence;

  const handleDelete = async () => {
    await deleteEvidences.mutateAsync({ timelineEvidenceIds: [timeline_evidence_id] });
    setModal(null);
  };

  return (
    <>
      <div className="flex w-full gap-6 rounded-2xl border border-gray-100 bg-white px-7 py-6 shadow-[0_20px_50px_#4040400d]">
        {/* 시각 */}
        <span className="typo-body-6 w-20 shrink-0 text-gray-400">{time}</span>

        {/* 썸네일 */}
        <ImagePreview
          src={has_thumbnail && thumbnail_url ? thumbnail_url : undefined}
          fallback={!has_thumbnail && duration_seconds > 0 ? voiceFallback : fileFallback}
          alt={title}
          size="sm"
          showFileCount={
            referenced_evidence_count > 1 ? String(referenced_evidence_count) : undefined
          }
          duration={
            has_thumbnail && duration_seconds > 0 ? formatDuration(duration_seconds) : undefined
          }
        />

        {/* 본문 */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-1.5">
            <p className="typo-heading-4 text-gray-900">{title}</p>
            <p className="typo-body-7 text-gray-900">{description}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <TimelineTagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>

        {/* 3점 메뉴 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="shrink-0 self-start p-1 text-gray-900">
              <EllipsisIcon width={20} height={20} />
            </button>
          </DropdownMenuTrigger>
          <AppDropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setModal('edit')}
              className="typo-body-6 cursor-pointer text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
            >
              <EditIcon width={16} height={16} />
              수정하기
            </DropdownMenuItem>
            <AppDropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setModal('delete')}
              className="typo-body-6 text-error focus:text-error cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            >
              <TrashIcon width={16} height={16} />
              삭제하기
            </DropdownMenuItem>
          </AppDropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 수정 모달 */}
      <TimelineFormModal
        open={modal === 'edit'}
        onOpenChange={(o) => !o && setModal(null)}
        mode="edit"
        initialDate={date}
        initialTime={time}
        evidence={evidence}
      />

      {/* 삭제 확인 다이얼로그 */}
      <TimelineDeleteDialog
        open={modal === 'delete'}
        onOpenChange={(o) => !o && setModal(null)}
        onConfirm={handleDelete}
      />

      {/* 다운로드 모달 */}
      <EvidenceDownloadModal
        open={modal === 'download'}
        onOpenChange={(o) => !o && setModal(null)}
        fileName={title}
      />
    </>
  );
}
