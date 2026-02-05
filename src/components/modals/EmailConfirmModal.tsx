'use client';

import { Modal } from './Modal';
import { Button } from '@/components/Button';

interface EmailConfirmModalProps {
  open: boolean;
  email: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export function EmailConfirmModal({
  open,
  email,
  onConfirm,
  onOpenChange,
}: EmailConfirmModalProps) {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange} className="w-135">
      <Modal.Header
        title="이메일 정보 확인"
        subTitle={
          <>
            입력하신 이메일 정보가 맞는지 다시 한번 확인해주세요.
            <br />
            해당 메일로 인증번호가 발송되며, 다시 수정할 수 없습니다.
          </>
        }
      />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-neutral-200 bg-neutral-100 p-4">
          <p className="typo-body-7 text-neutral-400">이메일</p>
          <p className="typo-heading-2 text-neutral-900">{email}</p>
        </div>
      </Modal.Body>
      <Modal.Footer direction="col" full>
        <Button size="xl" onClick={onConfirm}>
          인증번호 보내기
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
}
