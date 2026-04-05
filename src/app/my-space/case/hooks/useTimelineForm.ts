import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TimelineEvidence, TimelineTag } from '@/types/timeline';

// ─── 검증 ────────────────────────────────────────────────

export const timelineFormSchema = z.object({
  date: z.string().min(1, '날짜를 선택해주세요'),
  time: z.string().min(1, '시간을 입력해주세요'),
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z.string(),
});

export type TimelineFormValues = z.infer<typeof timelineFormSchema>;

// ─── 기능 ────────────────────────────────────────────────

interface UseTimelineFormParams {
  open: boolean;
  initialDate?: string;
  initialTime?: string;
  evidence?: TimelineEvidence;
}

/**
 * 타임라인 폼 상태 훅
 *
 * - RHF 폼 (date, time, title, description)
 * - 태그 멀티 선택
 * - 시간 입력 마스킹 / 범위 정규화
 * - 모달 열릴 때 초기값으로 reset
 */
export function useTimelineForm({
  open,
  initialDate = '',
  initialTime = '',
  evidence,
}: UseTimelineFormParams) {
  const [selectedTags, setSelectedTags] = useState<TimelineTag[]>([]);

  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineFormSchema),
    mode: 'onChange',
    defaultValues: { date: '', time: '00:00', title: '', description: '' },
  });

  /** 모달 열릴 때마다 폼 / 태그 초기화 */
  useEffect(() => {
    if (!open) return;
    const rawTime = initialTime.replace(/^(AM|PM)\s*/i, '').trim() || '00:00';
    form.reset({
      date: initialDate,
      time: rawTime,
      title: evidence?.title ?? '',
      description: evidence?.description ?? '',
    });
    setSelectedTags(evidence?.tags ?? []);
    // open이 true로 바뀔 때만 초기화하면 되므로 의도적으로 의존성 생략
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** 시간 입력 마스킹 (HH:MM) */
  const handleTimeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
    form.setValue('time', formatted, { shouldValidate: true });
  };

  /** 시간 blur — 범위 정규화 (0~23시, 0~59분) */
  const handleTimeBlur = () => {
    const digits = form.getValues('time').replace(/\D/g, '').padEnd(4, '0');
    const h = Math.min(parseInt(digits.slice(0, 2), 10), 23)
      .toString()
      .padStart(2, '0');
    const m = Math.min(parseInt(digits.slice(2, 4), 10), 59)
      .toString()
      .padStart(2, '0');
    form.setValue('time', `${h}:${m}`, { shouldValidate: true });
  };

  /** 태그 토글 */
  const toggleTag = (tag: TimelineTag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  return { form, selectedTags, toggleTag, handleTimeChange, handleTimeBlur };
}
