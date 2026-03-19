'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/modals/Modal';
import type { IncidentLogFormDataResponse } from '@/types/evidence';
import { useIncidentLogForm } from '../../hooks/useIncidentLogForm';
import { EvidenceContent } from './EvidenceContent';
import { getTodayString } from '@/utils/date';

// ─── UI ──────────────────────────────────────────────────

interface IncidentLogFormModalProps {
  open: boolean;
  onClose: () => void;
  complaintId: string | undefined;
  /** 수정 모드: 기존 사건일지 데이터 */
  initialData?: IncidentLogFormDataResponse;
}

export function IncidentLogFormModal({
  open,
  onClose,
  complaintId,
  initialData,
}: IncidentLogFormModalProps) {
  const today = getTodayString();

  const {
    fileInputRef,
    form: {
      register,
      handleSubmit,
      formState: { errors, isValid },
    },
    descriptionLength,
    attachmentItems,
    attachmentConfig: config,
    isEditMode,
    isChanged,
    isSubmitting,
    handleFilesAdd,
    handleAttachmentRemove,
    onSubmit,
  } = useIncidentLogForm({ open, onClose, complaintId, initialData });

  return (
    <Modal.Root
      open={open}
      onOpenChange={(o) => !o && onClose()}
      className="max-h-[90vh] w-135 flex-col"
    >
      <Modal.Header
        title={isEditMode ? '사건일지 수정' : '사건일지 작성'}
        subTitle="사건에 대해 자세하게 작성할수록 좋습니다"
      />

      <Modal.Body className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {/* 제목 */}
        <Input
          label="제목"
          required
          placeholder={`${today} 사건일지`}
          error={errors.filename?.message}
          {...register('filename')}
        />

        {/* 날짜 + 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="날짜"
            required
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          <Input
            label="시간"
            required
            type="time"
            error={errors.time?.message}
            {...register('time')}
          />
        </div>

        {/* 장소 */}
        <Input
          label="장소"
          required
          placeholder="집 앞, 회사 근처 등"
          error={errors.location?.message}
          {...register('location')}
        />

        {/* 상황 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="typo-label text-gray-700">
              상황 <span className="text-primary ml-2">필수</span>
            </label>
            <span className="typo-body-8 text-gray-400">{descriptionLength}/1,000</span>
          </div>
          <textarea
            maxLength={1000}
            placeholder="구체적으로 어떤 일이 있었는지 기록해주세요"
            className="typo-body-7 h-30 w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-error text-[12px] leading-4.5 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* 증거자료 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="typo-label text-gray-700">증거자료</p>
            <Button color="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              증거 업로드
            </Button>
          </div>

          {/* 파일 2.5개 이상부터 스크롤 — 빈 상태(업로드 존)엔 높이 제한 없음 */}
          <div
            className={attachmentItems.length > 0 ? 'no-scrollbar max-h-28 overflow-y-auto' : ''}
          >
            <EvidenceContent
              previewType="file"
              items={attachmentItems}
              onFilesAdd={handleFilesAdd}
              onRemove={handleAttachmentRemove}
              onClickUpload={() => fileInputRef.current?.click()}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
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
        <Button
          color="contrast"
          size="xl"
          onClick={handleSubmit(onSubmit)}
          disabled={isEditMode ? !isChanged : !isValid}
          loading={isSubmitting}
        >
          {isEditMode ? '수정하기' : '작성하기'}
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
