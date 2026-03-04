import { Button } from '@/components/Button';
import { Modal } from '@/components/modals/Modal';
import { FilePreview } from './FilePreview';

interface UploadErrorModalProps {
  open: boolean;
  onClose: () => void;
  files: File[];
}

/**
 * 업로드 실패 파일 목록 모달
 *
 * - 용량/개수/재생시간 초과, 타입 불일치로 업로드되지 않은 파일 목록 표시
 */
export function UploadErrorModal({ open, onClose, files }: UploadErrorModalProps) {
  return (
    <Modal.Root open={open} onOpenChange={(o) => !o && onClose()} className="max-h-106 w-135">
      <Modal.Header
        title="파일 업로드 실패"
        subTitle={
          <>
            파일 용량이나 개수가 초과한 경우 업로드가 되지 않습니다.
            <br />
            아래 내용을 확인해주시길 바랍니다
          </>
        }
      />
      <Modal.Body className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        <p className="typo-body-8 text-gray-500">업로드 실패 리스트</p>
        <ul className="flex flex-col gap-2">
          {files.map((file, i) => (
            <FilePreview key={i} name={file.name} size={file.size} />
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer direction="col" full>
        <Button color="contrast" size="xl" onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
