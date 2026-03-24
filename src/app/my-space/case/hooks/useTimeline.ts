import type { TimelineResponse } from '@/types/timeline';

const MOCK_DATA: TimelineResponse = {
  items: [
    {
      date: '2026-02-12',
      events: [
        {
          time: 'AM 11:30',
          evidences: [
            {
              timeline_evidence_id: 'e1',
              index: 0,
              title: '카톡 및 메세지 수신',
              description:
                '심야 시간에 총 15건의 카톡과 8건의 메세지로 지속적 연락, "자고있어?" "왜안자?" 등 일상 감시 암시',
              tags: ['REPEAT'],
              referenced_evidence_count: 1,
              has_thumbnail: true,
              thumbnail_url: '',
              duration_seconds: 0,
              is_ai_original: true,
            },
          ],
        },
        {
          time: 'AM 11:45',
          evidences: [
            {
              timeline_evidence_id: 'e2',
              index: 1,
              title: '주거 인근 협박 경고장',
              description: '현관 출입문에 자필로 쓴 협박 메모지 발견',
              tags: ['THREAT'],
              referenced_evidence_count: 1,
              has_thumbnail: false,
              thumbnail_url: '',
              duration_seconds: 0,
              is_ai_original: true,
            },
          ],
        },
        {
          time: 'PM 13:30',
          evidences: [
            {
              timeline_evidence_id: 'e3',
              index: 2,
              title: '해바라기센터 상담 기록',
              description:
                '해바라기센터 2차례 방문 상담 기록, 스토킹 피해 상담 및 법적 대응 방안 안내받음',
              tags: ['REFUSAL'],
              referenced_evidence_count: 1,
              has_thumbnail: false,
              thumbnail_url: '',
              duration_seconds: 0,
              is_ai_original: false,
            },
          ],
        },
      ],
    },
    {
      date: '2026-02-16',
      events: [
        {
          time: 'AM 05:30',
          evidences: [
            {
              timeline_evidence_id: 'e4',
              index: 3,
              title: '통화 25통 수신',
              description:
                '부재중 전화 20통, 원치않는 통화 시도 거부 후 욕설과 협박. "만나주지않으면 가만 안 둬" 등 명백한 위협',
              tags: ['REPEAT', 'THREAT'],
              referenced_evidence_count: 2,
              has_thumbnail: false,
              thumbnail_url: '',
              duration_seconds: 0,
              is_ai_original: true,
            },
          ],
        },
        {
          time: 'AM 08:30',
          evidences: [
            {
              timeline_evidence_id: 'e5',
              index: 4,
              title: '블랙박스 영상',
              description:
                '차량 블랙박스 영상. 출근 중 특정 차량이 지속적으로 뒤따라오는 후방 영상 확인',
              tags: ['THREAT'],
              referenced_evidence_count: 1,
              has_thumbnail: false,
              thumbnail_url: '',
              duration_seconds: 952,
              is_ai_original: false,
            },
          ],
        },
        {
          time: 'AM 08:44',
          evidences: [
            {
              timeline_evidence_id: 'e6',
              index: 5,
              title: '2026-02-16 미행 목격',
              description:
                '직장 동료의 미행 발견 목격담. 지난번 여러차례바왔던 차량이어서 의심을 샀으며 직장 입장까지 지켜보다가 따남을 진술함',
              tags: ['REPEAT'],
              referenced_evidence_count: 1,
              has_thumbnail: false,
              thumbnail_url: '',
              duration_seconds: 0,
              is_ai_original: false,
            },
          ],
        },
      ],
    },
    {
      date: '2026-02-20',
      events: [
        {
          time: 'PM 20:23',
          evidences: [
            {
              timeline_evidence_id: 'e7',
              index: 6,
              title: '거주지 방문 후 대면 협박',
              description:
                '방문 시 촬영한 영상. 10분간 문을 두드렸으며, 주변 민원으로 인해 분리조치됨',
              tags: ['THREAT'],
              referenced_evidence_count: 1,
              has_thumbnail: false,
              thumbnail_url: '',
              duration_seconds: 952,
              is_ai_original: false,
            },
          ],
        },
        {
          time: 'PM 20:48',
          evidences: [
            {
              timeline_evidence_id: 'e8',
              index: 7,
              title: '경찰서 방문 후 진정서 작성',
              description: '진정서 작성 후 피해자 보호 프로그램을 신청함',
              tags: ['REFUSAL'],
              referenced_evidence_count: 1,
              has_thumbnail: false,
              thumbnail_url: '',
              duration_seconds: 0,
              is_ai_original: false,
            },
          ],
        },
      ],
    },
  ],
};

/**
 * 타임라인 목업 데이터 훅
 * - API 연결 전 UI 개발용
 * - 추후 useSuspenseQuery로 교체 예정: GET /api/v1/{complaint_id}/timeline
 */
export function useTimeline(_complaintId: string) {
  const groups = MOCK_DATA.items;
  const allDates = groups.map((g) => g.date);
  const allTags = [
    ...new Set(
      groups.flatMap((g) => g.events.flatMap((e) => e.evidences.flatMap((ev) => ev.tags))),
    ),
  ];

  return { groups, allDates, allTags };
}
