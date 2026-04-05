import type { ReactNode } from 'react';
import WarningOutlineIcon from '@/assets/icons/WarningOutlineIcon.svg';
import { TAG_LABEL_MAP, TAG_COLOR_MAP, type TimelineTag } from '@/types/timeline';

interface TimelineTagBadgeProps {
  tag: TimelineTag;
}

export const TAG_ICON: Partial<Record<TimelineTag, ReactNode>> = {
  PHYSICAL_HARM: <WarningOutlineIcon width={16} height={16} />,
  THREAT_COERCION: <WarningOutlineIcon width={16} height={16} />,
};

export function TimelineTagBadge({ tag }: TimelineTagBadgeProps) {
  const { bg, text } = TAG_COLOR_MAP[tag];
  return (
    <span
      className={`typo-heading-6 inline-flex items-center gap-1 rounded-full px-2 py-1 ${bg} ${text}`}
    >
      {TAG_ICON[tag]}
      {TAG_LABEL_MAP[tag]}
    </span>
  );
}
