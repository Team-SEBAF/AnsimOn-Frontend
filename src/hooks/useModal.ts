import { useState } from 'react';

/**
 * 모달 제어를 위한 Hook
 *
 * 로컬 상태 기반으로 간단하게 모달을 제어합니다.
 *
 */
export function useModal() {
  const [open, setOpen] = useState(false);

  return {
    /**
     * 모달 열기
     */
    open: () => setOpen(true),

    /**
     * 모달 닫기
     */
    close: () => setOpen(false),

    /**
     * 현재 열림 상태
     */
    isOpen: open,

    /**
     * Modal.Root에 spread할 수 있는 props
     */
    props: {
      open,
      onOpenChange: setOpen,
    },
  };
}
