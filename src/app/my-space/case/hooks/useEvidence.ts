import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPresignedUrls,
  uploadToS3,
  deleteEvidences,
  // 타입별 register
  registerMessages,
  registerVoices,
  registerTrackings,
  registerReportRecords,
  registerIncidentLogFiles,
  // 타입별 preview
  getMessagePreviews,
  getVoicePreviews,
  getTrackingPreviews,
  getReportRecordPreviews,
  getIncidentLogPreviews,
} from '@/api/evidence';
import type {
  EvidenceType,
  EvidencePreviewItem,
  PresignedUrlItemRequest,
  MessagePreviewListResponse,
  VoicePreviewListResponse,
  TrackingPreviewListResponse,
  ReportRecordPreviewListResponse,
  IncidentLogPreviewListResponse,
} from '@/types/evidence';
import { EVIDENCE_CONFIG } from '../components/evidence/constants';
import { getMediaDuration } from '../components/evidence/validate';

// ─── query key ──────────────────────────────────────────

const evidenceKeys = {
  previews: (complaintId: string, type: EvidenceType) =>
    ['evidence', 'previews', complaintId, type] as const,
  allPreviews: (complaintId: string) => ['evidence', 'previews', complaintId] as const,
};

// ─── 타입별 preview → 통일 PreviewItem 변환 ────────────

const fetchAndNormalize: Record<
  EvidenceType,
  (complaintId: string) => Promise<{ items: EvidencePreviewItem[]; totalCount: number }>
> = {
  MESSAGE: async (complaintId) => {
    const res: MessagePreviewListResponse = await getMessagePreviews(complaintId);
    return {
      items: res.previews.map((p) => ({
        id: p.message_id,
        thumbnailUrl: p.thumbnail_url,
      })),
      totalCount: res.total_count,
    };
  },
  VOICE: async (complaintId) => {
    const res: VoicePreviewListResponse = await getVoicePreviews(complaintId);
    return {
      items: res.previews.map((p) => ({
        id: p.voice_id,
        filename: p.filename,
        durationSeconds: p.duration_seconds,
      })),
      totalCount: res.total_count,
    };
  },
  TRACKING: async (complaintId) => {
    const res: TrackingPreviewListResponse = await getTrackingPreviews(complaintId);
    return {
      items: res.previews.map((p) => ({
        id: p.tracking_id,
        thumbnailUrl: p.thumbnail_url,
        durationSeconds: p.duration_seconds,
      })),
      totalCount: res.total_count,
    };
  },
  REPORT_RECORD: async (complaintId) => {
    const res: ReportRecordPreviewListResponse = await getReportRecordPreviews(complaintId);
    return {
      items: res.previews.map((p) => ({
        id: p.report_record_id,
        filename: p.filename,
        sizeBytes: p.size_bytes,
      })),
      totalCount: res.total_count,
    };
  },
  INCIDENT_LOG: async (complaintId) => {
    const res: IncidentLogPreviewListResponse = await getIncidentLogPreviews(complaintId);
    return {
      items: res.previews.map((p) => ({
        id: p.incident_log_id,
        filename: p.filename,
        sizeBytes: p.size_bytes ?? undefined,
      })),
      totalCount: res.total_count,
    };
  },
};

// ─── 타입별 register 함수 매핑 ──────────────────────────

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
    case 'TRACKING':
      return registerTrackings(complaintId, {
        items: items.map((i) => ({ trackingId: i.evidenceId, filename: i.filename })),
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

export function useEvidencePreviews(complaintId: string | undefined, type: EvidenceType) {
  return useQuery({
    queryKey: evidenceKeys.previews(complaintId!, type),
    queryFn: () => fetchAndNormalize[type](complaintId!),
    enabled: !!complaintId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지 (불필요한 refetch 방지)
  });
}

// ─── 업로드 훅 (presigned URL → S3 PUT → register) ─────

export function useUploadEvidence(complaintId: string | undefined, type: EvidenceType) {
  const queryClient = useQueryClient();
  const config = EVIDENCE_CONFIG[type];

  return useMutation({
    mutationFn: async (files: File[]) => {
      // 1) presigned URL 발급
      // VOICE/TRACKING은 실제 재생 길이를 구해서 전달
      let durations: number[] = [];
      if (config.maxDuration) {
        durations = await Promise.all(files.map((f) => getMediaDuration(f)));
      }

      const presignedItems: PresignedUrlItemRequest[] = files.map((file, i) => ({
        index: i,
        filename: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        ...(config.maxDuration ? { durationSeconds: Math.round(durations[i]) } : {}),
      }));

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

// ─── 삭제 훅 ────────────────────────────────────────────

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
