'use client';

import { useRef } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/modals/Modal';
import { Spinner } from '@/components/Spinner';
import { EvidenceContent } from '../evidence/EvidenceContent';
import {
  TAG_LABEL_MAP,
  TAG_COLOR_MAP,
  type TimelineTag,
  type TimelineEvidence,
} from '@/types/timeline';
import { TAG_ICON } from './TimelineTagBadge';
import { useTimelineForm } from '../../hooks/useTimelineForm';
import { useTimelineFiles } from '../../hooks/useTimelineFiles';
import { useTimelineSubmit } from '../../hooks/useTimelineSubmit';

const ALL_TAGS: TimelineTag[] = [
  'PHYSICAL_HARM',
  'THREAT_COERCION',
  'SEXUAL_INSULT',
  'REFUSAL_INTENT',
  'REPEAT',
];

interface TimelineFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  /** 추가 모드: 날짜 초기값 */
  initialDate?: string;
  /** 수정 모드: 기존 증거 데이터 */
  evidence?: TimelineEvidence;
  initialTime?: string;
}

/** 타임라인 추가 / 수정 모달 */
export function TimelineFormModal({
  open,
  onOpenChange,
  mode,
  initialDate = '',
  initialTime = '',
  evidence,
}: TimelineFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canEditFiles = !evidence?.is_ai_original;

  const files = useTimelineFiles({
    open,
    isEditMode: mode === 'edit',
    canEditFiles,
    evidence,
  });

  const formHook = useTimelineForm({ open, initialDate, initialTime, evidence });

  const { submit, isSubmitting } = useTimelineSubmit({
    mode,
    canEditFiles,
    evidence,
    onClose: () => onOpenChange(false),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = formHook.form;
  const descriptionValue = watch('description');

  const handleFormSubmit = handleSubmit(async (values) => {
    await submit({
      formValues: values,
      tags: formHook.selectedTags,
      uploadFiles: files.getUploadFiles(),
      deleteIds: files.getDeleteIds(),
    });
  });

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange} className="max-h-[60vh] w-135 flex-col">
      <Modal.Header
        title={mode === 'edit' ? '타임라인 수정하기' : '타임라인 추가하기'}
        subTitle="날짜 기반으로 사건을 수정합니다"
      />

      <Modal.Body className="flex flex-1 flex-col gap-5 overflow-y-auto pr-2">
        {/* 날짜 + 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="날짜"
            required
            type="date"
            size="md"
            {...register('date')}
            error={errors.date?.message}
          />
          <Input
            label="시간"
            required
            placeholder="00:00"
            size="md"
            {...register('time', {
              onChange: (e) => formHook.handleTimeChange(e.target.value),
            })}
            onBlur={formHook.handleTimeBlur}
            error={errors.time?.message}
          />
        </div>

        {/* 제목 */}
        <Input
          label="제목"
          required
          placeholder="제목을 입력해주세요"
          size="md"
          {...register('title')}
          error={errors.title?.message}
        />

        {/* 상황 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="typo-label text-gray-700">상황</label>
            <span className="typo-body-8 text-gray-400">
              {(descriptionValue ?? '').length}/1,000
            </span>
          </div>
          <textarea
            maxLength={1000}
            placeholder="어떤 일이 있었는지 기록해주세요"
            {...register('description')}
            className="typo-body-7 h-30 w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
        </div>

        {/* 태그 멀티 선택 */}
        <div className="flex flex-col gap-2">
          <p className="typo-label text-gray-700">태그</p>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => {
              const selected = formHook.selectedTags.includes(tag);
              const { bg, text } = TAG_COLOR_MAP[tag];
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => formHook.toggleTag(tag)}
                  className={`typo-heading-6 inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
                    selected ? `${bg} ${text}` : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {TAG_ICON[tag]}
                  {TAG_LABEL_MAP[tag]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 증거자료 — AI 원본 증거는 편집 불가 */}
        {canEditFiles && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="typo-label text-gray-700">증거자료</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="typo-heading-6 hover:text-primary text-gray-400 transition-colors"
              >
                + 추가하기
              </button>
            </div>

            {files.isLoadingDetail ? (
              <div className="flex items-center justify-center py-4">
                <Spinner size="md" label="파일 목록 불러오는 중" />
              </div>
            ) : (
              <div>
                <EvidenceContent
                  previewType="mixed"
                  items={files.attachmentItems}
                  localFileMap={files.localFileMap}
                  onFilesAdd={files.addFiles}
                  onRemove={files.removeFile}
                  onClickUpload={() => fileInputRef.current?.click()}
                />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) files.addFiles(Array.from(e.target.files));
                e.target.value = '';
              }}
              className="hidden"
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer direction="col" full>
        <Button color="contrast" size="xl" onClick={handleFormSubmit} disabled={isSubmitting}>
          {isSubmitting && <Spinner size="sm" className="text-white" />}
          {isSubmitting ? '저장 중...' : mode === 'edit' ? '수정하기' : '추가하기'}
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
