'use client';

import FileIcon from '@/assets/icons/FileIcon.svg';
import FileDownloadIcon from '@/assets/icons/FileDownloadIcon.svg';
import { Button } from '@/components/Button';
import { Modal } from '@/components/modals/Modal';
import { Spinner } from '@/components/Spinner';

interface EvidenceDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subTitle?: string;
  /** 파일명 (없으면 기본 파일명 표시) */
  fileName?: string;
  /** 파일 용량 (예: "48.0MB") */
  fileSize?: string;
  /** 다운로드 버튼 클릭 핸들러 */
  onDownload?: () => void;
  /** 다운로드 중 여부 */
  isDownloading?: boolean;
}

/** 다운로드 확인 모달 */
export function EvidenceDownloadModal({
  open,
  onOpenChange,
  title = '증거 자료 다운로드',
  subTitle = '타임라인으로 정리된 증거 자료 PDF 파일입니다',
  fileName = '안심은_증거분석타임라인.zip',
  fileSize,
  onDownload,
  isDownloading = false,
}: EvidenceDownloadModalProps) {
  const handleDownload = () => {
    onDownload?.();
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange} className="w-110">
      <Modal.Header title={title} subTitle={subTitle} />
      <Modal.Body className="flex flex-col gap-2">
        <p className="typo-body-8 text-gray-400">최종 파일</p>
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
          <FileIcon width={20} height={20} className="shrink-0 text-gray-400" />
          <span className="typo-body-7 flex-1 truncate text-gray-900">{fileName}</span>
          {fileSize && <span className="typo-body-8 shrink-0 text-gray-400">{fileSize}</span>}
        </div>
      </Modal.Body>
      <Modal.Footer direction="col" full>
        <Button color="contrast" size="xl" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            <FileDownloadIcon width={18} height={18} className="text-white" />
          )}
          {isDownloading ? '다운로드 중...' : '다운로드'}
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
