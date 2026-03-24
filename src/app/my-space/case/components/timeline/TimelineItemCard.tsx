'use client';

import EllipsisIcon from '@/assets/icons/ellipsis-vertical.svg';
import EditIcon from '@/assets/icons/EditOutlineIcon.svg';
import TrashIcon from '@/assets/icons/TrashOutlineIcon.svg';
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
import type { TimelineEvidence } from '@/types/timeline';

interface TimelineItemCardProps {
  time: string;
  evidence: TimelineEvidence;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 타임라인 증거 카드
 * - 시각 / 썸네일(영상길이·개수 뱃지) / 제목·설명·태그 / 수정·삭제 드롭다운
 */
export function TimelineItemCard({ time, evidence, onEdit, onDelete }: TimelineItemCardProps) {
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

  return (
    <div className="flex w-full gap-6 rounded-2xl border border-gray-100 bg-white px-7 py-6 shadow-[0_20px_50px_#4040400d]">
      {/* 시각 */}
      <span className="typo-body-6 w-20 shrink-0 text-gray-400">{time}</span>

      {/* 썸네일 */}
      <ImagePreview
        src={has_thumbnail && thumbnail_url ? thumbnail_url : undefined}
        alt={title}
        size="sm"
        duration={duration_seconds > 0 ? formatDuration(duration_seconds) : undefined}
        showFileCount={
          duration_seconds === 0 && referenced_evidence_count > 1
            ? String(referenced_evidence_count)
            : undefined
        }
      />

      {/* 본문 */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-0.5">
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
            onClick={() => onEdit(timeline_evidence_id)}
            className="typo-body-6 cursor-pointer text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
          >
            <EditIcon width={16} height={16} />
            수정하기
          </DropdownMenuItem>
          <AppDropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(timeline_evidence_id)}
            className="typo-body-6 text-error focus:text-error cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
          >
            <TrashIcon width={16} height={16} />
            삭제하기
          </DropdownMenuItem>
        </AppDropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
