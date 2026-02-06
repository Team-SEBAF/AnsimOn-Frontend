'use client';

import { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/modals/Modal';
import { EmailConfirmModal, LoginRequiredModal } from '@/components/modals';
import { Button } from '@/components/Button';

export default function ModalTestPage() {
  const basicModal = useModal();
  const confirmModal = useModal();
  const formModal = useModal();

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-neutral-900">Modal 테스트</h1>

        <div className="space-y-4 rounded-lg bg-white p-6 shadow">
          <div>
            <h2 className="mb-2 text-lg font-semibold">기본 모달</h2>
            <Button onClick={basicModal.open}>열기</Button>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">확인 모달 (가로 반반)</h2>
            <Button onClick={confirmModal.open}>열기</Button>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">폼 모달 (세로 버튼)</h2>
            <Button onClick={formModal.open}>열기</Button>
          </div>

          <hr className="my-4" />

          <div>
            <h2 className="mb-2 text-lg font-semibold">이메일 확인 모달</h2>
            <p className="mb-2 text-sm text-neutral-500">회원가입 시 이메일 확인용</p>
            <Button onClick={() => setEmailModalOpen(true)}>열기</Button>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">로그인 필요 모달</h2>
            <p className="mb-2 text-sm text-neutral-500">로그인 필요 시 리다이렉트용</p>
            <Button onClick={() => setLoginModalOpen(true)}>열기</Button>
          </div>

          <div className="mt-6 rounded bg-neutral-100 p-4">
            <p className="text-sm text-neutral-600">
              <strong>사용법:</strong>
            </p>
            <pre className="mt-2 text-xs">
              {`const modal = useModal();

<Modal.Root {...modal.props}>
  <Modal.Header title="제목" subTitle="설명" />
  <Modal.Body>내용</Modal.Body>
  <Modal.Footer>버튼</Modal.Footer>
</Modal.Root>`}
            </pre>
          </div>
        </div>
      </div>

      {/* 기본 모달 */}
      <Modal.Root {...basicModal.props}>
        <Modal.Header title="기본 모달" subTitle="간단한 안내 메시지" />
        <Modal.Body>
          <p className="text-sm text-neutral-600">이것은 기본 모달입니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={basicModal.close}>닫기</Button>
        </Modal.Footer>
      </Modal.Root>

      {/* 확인 모달 */}
      <Modal.Root {...confirmModal.props}>
        <Modal.Header title="정말 삭제하시겠습니까?" subTitle="이 작업은 되돌릴 수 없습니다" />
        <Modal.Body>
          <p className="text-sm text-neutral-600">삭제하면 모든 데이터가 영구적으로 제거됩니다.</p>
        </Modal.Body>
        <Modal.Footer full>
          <Button variant="ghost" onClick={confirmModal.close}>
            취소
          </Button>
          <Button variant="default" onClick={confirmModal.close}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal.Root>

      {/* 폼 모달 */}
      <Modal.Root {...formModal.props}>
        <Modal.Header title="프로필 수정" subTitle="정보를 입력해주세요" />
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">이름</label>
              <input
                type="text"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">이메일</label>
              <input
                type="email"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                placeholder="example@email.com"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer direction="col" full>
          <Button onClick={formModal.close}>저장</Button>
          <Button variant="ghost" onClick={formModal.close}>
            취소
          </Button>
        </Modal.Footer>
      </Modal.Root>

      {/* 이메일 확인 모달 */}
      <EmailConfirmModal
        open={emailModalOpen}
        email="test@example.com"
        onConfirm={() => {
          alert('인증번호 보내기 클릭');
          setEmailModalOpen(false);
        }}
        onOpenChange={setEmailModalOpen}
      />

      {/* 로그인 필요 모달 */}
      <LoginRequiredModal
        open={loginModalOpen}
        onConfirm={() => {
          alert('로그인하기 클릭');
          setLoginModalOpen(false);
        }}
        onOpenChange={setLoginModalOpen}
      />
    </div>
  );
}
