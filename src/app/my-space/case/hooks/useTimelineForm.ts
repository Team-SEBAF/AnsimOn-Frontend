import { useState } from 'react';
import type { TimelineTag, TimelineEvidence } from '@/types/timeline';

interface UseTimelineFormOptions {
  initialDate?: string;
  initialTime?: string;
  evidence?: TimelineEvidence;
}

/** 타임라인 추가/수정 폼 상태 및 핸들러 */
export function useTimelineForm({
  initialDate = '',
  initialTime = '',
  evidence,
}: UseTimelineFormOptions) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime || '00:00');
  const [title, setTitle] = useState(evidence?.title ?? '');
  const [description, setDescription] = useState(evidence?.description ?? '');
  const [selectedTags, setSelectedTags] = useState<TimelineTag[]>(evidence?.tags ?? []);

  const handleTimeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      setTime(digits);
    } else {
      setTime(`${digits.slice(0, 2)}:${digits.slice(2)}`);
    }
  };

  const handleTimeBlur = () => {
    const digits = time.replace(/\D/g, '').padEnd(4, '0');
    const h = Math.min(parseInt(digits.slice(0, 2), 10), 23)
      .toString()
      .padStart(2, '0');
    const m = Math.min(parseInt(digits.slice(2, 4), 10), 59)
      .toString()
      .padStart(2, '0');
    setTime(`${h}:${m}`);
  };

  const toggleTag = (tag: TimelineTag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  return {
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
  };
}
