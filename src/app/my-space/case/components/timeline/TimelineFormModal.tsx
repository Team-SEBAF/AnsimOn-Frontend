'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/modals/Modal';
import { EvidenceContent } from '../evidence/EvidenceContent';
import type { EvidencePreviewItem } from '@/types/evidence';
import {
  TAG_LABEL_MAP,
  TAG_COLOR_MAP,
  type TimelineTag,
  type TimelineEvidence,
} from '@/types/timeline';
import { TAG_ICON } from './TimelineTagBadge';
import { useTimelineForm } from '../../hooks/useTimelineForm';

const ALL_TAGS: TimelineTag[] = ['PHYSICAL_HARM', 'THREAT', 'SEXUAL_INSULT', 'REFUSAL', 'REPEAT'];

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
  const {
    date,
    setDate,
    time,
    handleTimeChange,
    handleTimeBlur,
    title,
    setTitle,
    description,
    setDescription,
    selectedTags,
    toggleTag,
  } = useTimelineForm({ initialDate, initialTime, evidence });

  // TODO: API 연결 시 filterValidFiles로 타입·크기·길이·개수 검증 추가, rejected 파일은 toast.error()로 표시
  const [files, setFiles] = useState<EvidencePreviewItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdd = (newFiles: File[]) => {
    const items: EvidencePreviewItem[] = newFiles.map((f) => ({
      id: `${f.name}-${f.size}`,
      filename: f.name,
      sizeBytes: f.size,
    }));
    setFiles((prev) => [...prev, ...items]);
  };

  const handleFileRemove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleSubmit = () => {
    // TODO: API 연결
    console.log({ date, time, title, description, tags: selectedTags, files });
    onOpenChange(false);
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange} className="max-h-[90vh] w-135 flex-col">
      <Modal.Header
        title={mode === 'edit' ? '타임라인 수정하기' : '타임라인 추가하기'}
        subTitle="날짜 기반으로 사건을 수정합니다"
      />

      <Modal.Body className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {/* 날짜 + 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="날짜"
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="시간"
            required
            placeholder="00:00"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            onBlur={handleTimeBlur}
          />
        </div>

        {/* 제목 */}
        <Input
          label="제목"
          required
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 상황 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="typo-label text-gray-700">상황</label>
            <span className="typo-body-8 text-gray-400">{description.length}/1,000</span>
          </div>
          <textarea
            maxLength={1000}
            placeholder="어떤 일이 있었는지 기록해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="typo-body-7 h-30 w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
        </div>

        {/* 태그 멀티 선택 */}
        <div className="flex flex-col gap-2">
          <p className="typo-label text-gray-700">태그</p>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              const { bg, text } = TAG_COLOR_MAP[tag];
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
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

        {/* 증거자료 */}
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

          <div className={files.length > 0 ? 'no-scrollbar max-h-28 overflow-y-auto' : ''}>
            <EvidenceContent
              previewType="file"
              items={files}
              onFilesAdd={handleFilesAdd}
              onRemove={handleFileRemove}
              onClickUpload={() => fileInputRef.current?.click()}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files) handleFilesAdd(Array.from(e.target.files));
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>
      </Modal.Body>

      <Modal.Footer direction="col" full>
        <Button color="contrast" size="xl" onClick={handleSubmit}>
          {mode === 'edit' ? '수정하기' : '추가하기'}
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
