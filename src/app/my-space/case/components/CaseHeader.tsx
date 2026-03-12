'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import EditOutlineIcon from '@/assets/icons/EditOutlineIcon.svg';
import { formatDateKo } from '@/utils/date';

interface CaseHeaderProps {
  /** 사건 제목 */
  title: string;
  /** 제목 변경 시 호출되는 콜백 */
  onTitleChange: (title: string) => void;
  /** 최종 수정일 (서버에서 항상 제공) */
  updatedAt: string;
  /** 저장 버튼 클릭 콜백 */
  onSave: () => void;
  /** 저장 중 로딩 상태 */
  isSaving?: boolean;
  /** 이전 단계 이동 콜백 */
  onPrev: () => void;
  /** 다음 단계 이동 콜백 */
  onNext: () => void;
  /** 이전 버튼 활성화 여부 (step 1이면 false) */
  hasPrev: boolean;
  /** 다음 버튼 활성화 여부 (step 4이면 false) */
  hasNext: boolean;
}

/**
 * Case 상단 헤더
 * - 좌측: 사건 제목 (클릭 시 인라인 편집) + 최종 수정일
 * - 우측: 저장 / 이전 / 다음 단계로 버튼
 * - 제목 편집: Enter·blur로 확정, Esc로 취소
 */
export function CaseHeader({
  title,
  onTitleChange,
  updatedAt,
  onSave,
  isSaving = false,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: CaseHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 편집 모드 진입 */
  const startEditing = () => {
    setDraft(title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  /** 편집 확정 */
  const confirmEdit = () => {
    const trimmedTitle = draft.trim();
    if (trimmedTitle) {
      onTitleChange(trimmedTitle);
    } else {
      setDraft(title); // 빈 제목은 허용하지 않고 원래 제목으로 복구
    }
    setIsEditing(false);
  };

  /** 편집 취소 */
  const cancelEdit = () => {
    setDraft(title);
    setIsEditing(false);
  };

  /** Enter로 확정, Escape로 취소 */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') confirmEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="flex w-full justify-between border-b border-gray-100 p-6">
      <div className="flex flex-col gap-1">
        {/* 제목 표시 / 편집 */}
        {isEditing ? (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={handleKeyDown}
            size="sm"
          />
        ) : (
          <button
            type="button"
            aria-label="사건 제목 편집"
            onClick={startEditing}
            className="flex items-center gap-2"
          >
            <h1 className="typo-heading-2">{title || '사건 제목'}</h1>
            <EditOutlineIcon className="aria-hidden size-5 text-gray-400" />
          </button>
        )}
        <span className="typo-body-8 text-gray-400">최종 수정일: {formatDateKo(updatedAt)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button color="secondary" size="lg" onClick={onSave} loading={isSaving}>
          저장
        </Button>
        <Button color="secondary" size="lg" onClick={onPrev} disabled={!hasPrev || isSaving}>
          이전
        </Button>
        <Button color="primary" size="lg" onClick={onNext} disabled={!hasNext || isSaving}>
          다음 단계로
        </Button>
      </div>
    </div>
  );
}
