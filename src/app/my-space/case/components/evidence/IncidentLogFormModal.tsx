'use client';

import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import UploadIcon from '@/assets/icons/UploadIcon.svg';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/modals/Modal';
import { useUploadIncidentLogFormData, useUploadEvidence } from '../../hooks/useEvidence';
import { filterValidFiles } from './validate';
import { EVIDENCE_CONFIG } from './constants';
import { FilePreview } from './FilePreview';

const incidentLogSchema = z.object({
  filename: z.string().min(1, '제목을 입력해주세요'),
  date: z.string().min(1, '날짜를 선택해주세요'),
  time: z.string().min(1, '시간을 입력해주세요'),
  location: z.string().min(1, '장소를 입력해주세요'),
  description: z.string().min(1, '상황을 입력해주세요'),
});

type IncidentLogFormValues = z.infer<typeof incidentLogSchema>;

interface IncidentLogFormModalProps {
  open: boolean;
  onClose: () => void;
  complaintId: string | undefined;
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

const config = EVIDENCE_CONFIG.INCIDENT_LOG;

export function IncidentLogFormModal({ open, onClose, complaintId }: IncidentLogFormModalProps) {
  const today = getTodayString();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<IncidentLogFormValues>({
    resolver: zodResolver(incidentLogSchema),
    mode: 'onChange',
    defaultValues: {
      filename: `${today} 사건일지`,
      date: today,
      time: '00:00',
      location: '',
      description: '',
    },
  });

  const descriptionLength = useWatch({ control, name: 'description' }).length;

  const uploadFormData = useUploadIncidentLogFormData(complaintId);
  const uploadFiles = useUploadEvidence(complaintId, 'INCIDENT_LOG');

  const handleFilesAdd = async (files: File[]) => {
    const { valid } = await filterValidFiles(files, config, localFiles.length);
    if (valid.length > 0) setLocalFiles((prev) => [...prev, ...valid]);
  };

  const onSubmit = async (values: IncidentLogFormValues) => {
    const tasks: Promise<unknown>[] = [
      uploadFormData.mutateAsync({ ...values, witness: '', perceivedRisk: '' }),
    ];
    if (localFiles.length > 0) {
      tasks.push(uploadFiles.mutateAsync(localFiles));
    }
    await Promise.all(tasks);
    onClose();
  };

  const isPending = uploadFormData.isPending || uploadFiles.isPending;

  return (
    <Modal.Root
      open={open}
      onOpenChange={(o) => !o && onClose()}
      className="max-h-[90vh] w-120 flex-col"
    >
      <Modal.Header title="사건일지 작성" subTitle="사건에 대해 자세하게 작성할수록 좋습니다" />

      <Modal.Body className="flex flex-col gap-5 overflow-y-auto">
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
            rows={6}
            placeholder="구체적으로 어떤 일이 있었는지 기록해주세요"
            className="typo-body-7 w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
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
          <p className="typo-label text-gray-700">증거자료</p>

          {/* 선택된 파일 목록 */}
          {localFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              {localFiles.map((file, i) => (
                <FilePreview
                  key={i}
                  name={file.name}
                  size={file.size}
                  onRemove={() => setLocalFiles((prev) => prev.filter((_, idx) => idx !== i))}
                />
              ))}
            </div>
          )}

          {/* 업로드 영역 */}
          {localFiles.length < config.maxFiles && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFilesAdd(Array.from(e.dataTransfer.files));
              }}
              className={`bg-bg-2 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-[1.5px] border-dashed py-8 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <UploadIcon className="h-6 w-6 text-gray-400" />
              <p className="typo-heading-4 text-gray-400">증거 업로드</p>
              <p className="typo-body-7 text-gray-400">
                클릭하거나 드래그앤드롭으로 자료를 업로드해주세요
              </p>
            </div>
          )}

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
          disabled={!isValid || isPending}
        >
          {isPending ? '저장 중...' : '작성하기'}
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
