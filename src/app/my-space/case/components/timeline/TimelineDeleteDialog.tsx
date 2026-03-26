'use client';

import { Modal } from '@/components/modals/Modal';
import { Button } from '@/components/Button';

interface TimelineDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** 타임라인 삭제 확인 다이얼로그 */
export function TimelineDeleteDialog({ open, onOpenChange, onConfirm }: TimelineDeleteDialogProps) {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Header
        title="타임라인 삭제"
        subTitle={
          <>
            삭제한 타임라인은 복구할 수 없어요.
            <br />
            정말 삭제할까요?
          </>
        }
      />
      <Modal.Footer full>
        <Button color="secondary" size="xl" onClick={() => onOpenChange(false)}>
          취소하기
        </Button>
        <Button color="danger" size="xl" onClick={onConfirm}>
          삭제하기
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
