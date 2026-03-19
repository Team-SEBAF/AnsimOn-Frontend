import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPresignedUrls,
  uploadToS3,
  deleteEvidences,
  // 타입별 register
  registerMessages,
  registerVoices,
  registerVictims,
  registerReportRecords,
  registerIncidentLogFiles,
  uploadIncidentLogFormData,
  updateIncidentLogFormData,
  // 타입별 detail
  getMessageDetails,
  getVoiceDetails,
  getVictimDetails,
  getReportRecordDetails,
  getIncidentLogDetails,
} from '@/api/evidence';
import type {
  EvidenceType,
  EvidencePreviewItem,
  IncidentLogFormDataUploadRequest,
  IncidentLogFormDataUpdateRequest,
  MessageDetailListResponse,
  VoiceDetailListResponse,
  VictimDetailListResponse,
  ReportRecordDetailListResponse,
  IncidentLogDetailListResponse,
} from '@/types/evidence';
import { EVIDENCE_CONFIG } from '../components/evidence/constants';
import { buildPresignedUrlItems } from '../components/evidence/validate';

// ─── query key ──────────────────────────────────────────

/** React Query 캐시 키 팩토리. `['evidence', 'previews', complaintId, type]` 형태 */
const evidenceKeys = {
  previews: (complaintId: string, type: EvidenceType) =>
    ['evidence', 'previews', complaintId, type] as const,
  allPreviews: (complaintId: string) => ['evidence', 'previews', complaintId] as const,
};

// ─── 타입별 detail → 통일 PreviewItem 변환 ─────────────

/**
 * 타입별 detail → 통일 PreviewItem 변환 매퍼
 *
 * - 각 타입마다 응답 필드명이 다름(message_id, voice_id 등) → 여기서 통일
 * - preview 대신 detail API를 사용하여 filename, size_bytes 등 추가 필드를 함께 조회
 */
const fetchAndNormalize: Record<
  EvidenceType,
  (complaintId: string) => Promise<{ items: EvidencePreviewItem[]; totalCount: number }>
> = {
  MESSAGE: async (complaintId) => {
    const res: MessageDetailListResponse = await getMessageDetails(complaintId);
    return {
      items: res.details.map((d) => ({
        id: d.message_id,
        filename: d.filename,
        thumbnailUrl: d.thumbnail_url,
        sizeBytes: d.size_bytes,
      })),
      totalCount: res.total_count,
    };
  },
  VOICE: async (complaintId) => {
    const res: VoiceDetailListResponse = await getVoiceDetails(complaintId);
    return {
      items: res.details.map((d) => ({
        id: d.voice_id,
        filename: d.filename,
        sizeBytes: d.size_bytes,
        durationSeconds: d.duration_seconds,
      })),
      totalCount: res.total_count,
    };
  },
  VICTIM: async (complaintId) => {
    const res: VictimDetailListResponse = await getVictimDetails(complaintId);
    return {
      items: res.details.map((d) => ({
        id: d.victim_id,
        filename: d.filename,
        thumbnailUrl: d.thumbnail_url,
        sizeBytes: d.size_bytes,
        durationSeconds: d.duration_seconds,
      })),
      totalCount: res.total_count,
    };
  },
  REPORT_RECORD: async (complaintId) => {
    const res: ReportRecordDetailListResponse = await getReportRecordDetails(complaintId);
    return {
      items: res.details.map((d) => ({
        id: d.report_record_id,
        filename: d.filename,
        sizeBytes: d.size_bytes,
      })),
      totalCount: res.total_count,
    };
  },
  INCIDENT_LOG: async (complaintId) => {
    const res: IncidentLogDetailListResponse = await getIncidentLogDetails(complaintId);
    return {
      items: res.details.map((d) => ({
        id: d.incident_log_id,
        filename: d.filename,
        sizeBytes: d.size_bytes ?? undefined,
        isEditable: d.type === 'FORM_DATA',
      })),
      totalCount: res.total_count,
    };
  },
};

// ─── 타입별 register 함수 매핑 ──────────────────────────

/**
 * 타입별 register API 호출
 *
 * - presigned URL 응답의 evidenceId를 타입별 ID 필드명으로 매핑 (messageId, voiceId 등)
 */
const registerByType = async (
  type: EvidenceType,
  complaintId: string,
  items: { evidenceId: string; filename: string }[],
) => {
  switch (type) {
    case 'MESSAGE':
      return registerMessages(complaintId, {
        items: items.map((i) => ({ messageId: i.evidenceId, filename: i.filename })),
      });
    case 'VOICE':
      return registerVoices(complaintId, {
        items: items.map((i) => ({ voiceId: i.evidenceId, filename: i.filename })),
      });
    case 'VICTIM':
      return registerVictims(complaintId, {
        items: items.map((i) => ({ victimId: i.evidenceId, filename: i.filename })),
      });
    case 'REPORT_RECORD':
      return registerReportRecords(complaintId, {
        items: items.map((i) => ({ reportRecordId: i.evidenceId, filename: i.filename })),
      });
    case 'INCIDENT_LOG':
      return registerIncidentLogFiles(complaintId, {
        items: items.map((i) => ({ incidentLogId: i.evidenceId, filename: i.filename })),
      });
  }
};

// ─── 프리뷰 조회 훅 ────────────────────────────────────

/**
 * 증거 목록 조회 훅
 *
 * - 타입별 detail API를 호출하고 EvidencePreviewItem[]로 정규화하여 반환
 * - staleTime: 5분
 * - 업로드/삭제 시 invalidateQueries로 갱신
 *
 * @param complaintId - 고소장 ID (undefined이면 요청하지 않음)
 * @param type - 증거 타입 (MESSAGE, VOICE, VICTIM, REPORT_RECORD, INCIDENT_LOG)
 * @returns `{ items: EvidencePreviewItem[], totalCount: number }`
 */
export function useEvidencePreviews(complaintId: string, type: EvidenceType) {
  return useSuspenseQuery({
    queryKey: evidenceKeys.previews(complaintId, type),
    queryFn: () => fetchAndNormalize[type](complaintId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지 (불필요한 refetch 방지)
  });
}

// ─── 업로드 훅 (presigned URL → S3 PUT → register) ─────

/**
 * 증거 파일 업로드 훅 (3단계 플로우)
 *
 * - Presigned URL 발급 → S3 PUT 업로드 → 서버 Register 순차 실행
 * - VOICE/VICTIM은 업로드 전 getMediaDuration()으로 실제 재생 길이 측정
 * - S3 PUT은 인증 토큰 없이 fetch 사용 (presigned URL 자체에 인증 포함)
 * - 성공 시 invalidateQueries로 목록 자동 갱신
 *
 * @param complaintId - 고소장 ID
 * @param type - 증거 타입
 * @returns useMutation — mutate(files: File[])로 호출
 */
export function useUploadEvidence(complaintId: string | undefined, type: EvidenceType) {
  const queryClient = useQueryClient();
  const config = EVIDENCE_CONFIG[type];

  return useMutation({
    mutationFn: async (files: File[]) => {
      // 1) presigned URL 발급
      const presignedItems = await buildPresignedUrlItems(files, config.categories);

      const { items: presignedUrls } = await getPresignedUrls(complaintId!, {
        type,
        items: presignedItems,
      });

      // 2) S3에 파일 업로드
      await Promise.all(presignedUrls.map((presigned, i) => uploadToS3(presigned.url, files[i])));

      // 3) 서버에 등록
      return registerByType(
        type,
        complaintId!,
        presignedUrls.map((p) => ({
          evidenceId: p.evidence_id,
          filename: p.filename,
        })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evidenceKeys.previews(complaintId!, type),
      });
    },
  });
}

// ─── 사건일지 폼 데이터 업로드 훅 ──────────────────────

/**
 * 사건일지 직접 작성(폼 데이터) 업로드 훅
 *
 * - 날짜, 장소, 상황 등을 JSON으로 직접 전송 (S3 업로드 불필요)
 * - 성공 시 INCIDENT_LOG 목록 자동 갱신
 *
 * @param complaintId - 고소장 ID
 * @returns useMutation — mutate(payload: IncidentLogFormDataUploadRequest)로 호출
 */
export function useUploadIncidentLogFormData(complaintId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IncidentLogFormDataUploadRequest) =>
      uploadIncidentLogFormData(complaintId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evidenceKeys.previews(complaintId!, 'INCIDENT_LOG'),
      });
    },
  });
}

// ─── 사건일지 폼 데이터 수정 훅 ─────────────────────────

/**
 * 사건일지 직접 작성(폼 데이터) 수정 훅
 *
 * - 날짜, 장소, 상황 등을 Partial로 PATCH 전송
 * - 성공 시 INCIDENT_LOG 목록 자동 갱신
 *
 * @param complaintId - 고소장 ID (invalidateQueries에 사용)
 * @returns useMutation — mutate({ incidentLogId, payload })로 호출
 */
export function useUpdateIncidentLogFormData(complaintId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentLogId,
      payload,
    }: {
      incidentLogId: string;
      payload: IncidentLogFormDataUpdateRequest;
    }) => updateIncidentLogFormData(incidentLogId, payload),
    onSuccess: () => {
      if (!complaintId) return;
      queryClient.invalidateQueries({
        queryKey: evidenceKeys.previews(complaintId, 'INCIDENT_LOG'),
      });
    },
  });
}

// ─── 삭제 훅 ────────────────────────────────────────────

/**
 * 증거 삭제 훅
 *
 * - 증거 ID 배열을 받아 일괄 삭제
 * - 성공 시 invalidateQueries로 목록 자동 갱신
 *
 * @param complaintId - 고소장 ID
 * @param type - 증거 타입
 * @returns useMutation — mutate(evidenceIds: string[])로 호출
 */
export function useDeleteEvidence(complaintId: string | undefined, type: EvidenceType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evidenceIds: string[]) => deleteEvidences({ type, evidenceIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evidenceKeys.previews(complaintId!, type),
      });
    },
  });
}
