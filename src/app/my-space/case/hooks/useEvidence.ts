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
import type { EvidenceType, PresignedUrlItemRequest } from '@/types/evidence';
import { EVIDENCE_CONFIG } from '../components/evidence/constants';

// ─── query key ──────────────────────────────────────────

const evidenceKeys = {
  previews: (complaintId: string, type: EvidenceType) =>
    ['evidence', 'previews', complaintId, type] as const,
  allPreviews: (complaintId: string) => ['evidence', 'previews', complaintId] as const,
};

// ─── 타입별 preview 조회 함수 매핑 ─────────────────────

const previewFetchers: Record<
  EvidenceType,
  (complaintId: string, limit?: number) => Promise<{ total_count: number }>
> = {
  MESSAGE: getMessagePreviews,
  VOICE: getVoicePreviews,
  TRACKING: getTrackingPreviews,
  REPORT_RECORD: getReportRecordPreviews,
  INCIDENT_LOG: getIncidentLogPreviews,
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
    queryFn: () => previewFetchers[type](complaintId!),
    enabled: !!complaintId,
  });
}

// ─── 업로드 훅 (presigned URL → S3 PUT → register) ─────

export function useUploadEvidence(complaintId: string | undefined, type: EvidenceType) {
  const queryClient = useQueryClient();
  const config = EVIDENCE_CONFIG[type];

  return useMutation({
    mutationFn: async (files: File[]) => {
      // 1) presigned URL 발급
      const presignedItems: PresignedUrlItemRequest[] = files.map((file, i) => ({
        index: i,
        filename: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        ...(config.maxDuration ? { durationSeconds: 0 } : {}), // TODO: 실제 duration 전달
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
