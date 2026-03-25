'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/modals/Modal';
import { ImagePreview } from '../evidence/ImagePreview';
import { FilePreview } from '../evidence/FilePreview';
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

  const handleSubmit = () => {
    // TODO: API 연결
    console.log({ date, time, title, description, tags: selectedTags });
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

        {/* 설명 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="typo-label text-gray-700">설명</label>
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
            <button type="button" className="typo-heading-6 text-gray-400">
              + 추가하기
            </button>
          </div>

          {/* 썸네일 목록 */}
          {evidence?.has_thumbnail && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <ImagePreview src={evidence.thumbnail_url} alt={evidence.title} size="md" />
            </div>
          )}

          {/* 파일 목록 */}
          {evidence && (
            <div className="flex flex-col gap-1">
              <FilePreview
                name={evidence.title}
                size={0}
                action={{ type: 'remove', onRemove: () => {} }}
              />
            </div>
          )}
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
