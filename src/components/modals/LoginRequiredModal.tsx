'use client';

import { Modal } from './Modal';
import { Button } from '@/components/Button';

interface LoginRequiredModalProps {
  open: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export function LoginRequiredModal({ open, onConfirm, onOpenChange }: LoginRequiredModalProps) {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Header title="로그인이 필요해요" subTitle="고소장 작성은 로그인 후 이용할 수 있어요" />
      <Modal.Footer full>
        <Button color="contrast" onClick={onConfirm} size="xl">
          로그인하기
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
