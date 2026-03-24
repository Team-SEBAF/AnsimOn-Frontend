import { TAG_LABEL_MAP, TAG_COLOR_MAP, type TimelineTag } from '@/types/timeline';

interface TimelineTagBadgeProps {
  tag: TimelineTag;
}

export function TimelineTagBadge({ tag }: TimelineTagBadgeProps) {
  const { bg, text } = TAG_COLOR_MAP[tag];
  return (
    <span
      className={`typo-heading-6 inline-flex items-center rounded-full px-2 py-1 ${bg} ${text}`}
    >
      {TAG_LABEL_MAP[tag]}
    </span>
  );
}
