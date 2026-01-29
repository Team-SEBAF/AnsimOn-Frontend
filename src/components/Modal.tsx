'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Modal (Compound Component)
 *
 * - shadcn/ui(Radix Dialog) 기반 모달 래퍼
 * - Root에서 컨테이너 스타일/레이아웃을 통일하고
 * - Header/Body/Footer를 조합해서 사용
 *
 */

/**
 * Modal.Root props
 *
 * @property open - 모달 열림 여부
 * @property onOpenChange - open 상태 변경 핸들러(overlay/esc 닫기 포함)
 * @property a11yTitle - 스크린리더용 제목(Radix Dialog 접근성 요구사항)
 * @property className - DialogContent(컨테이너) 추가 클래스
 * @property children - Modal.Header/Body/Footer 조합
 */
type ModalRootProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  a11yTitle?: string;
  children: React.ReactNode;
};

function Root({ open, onOpenChange, className, a11yTitle = '모달', children }: ModalRootProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // 컨테이너 기본 스타일 (카드 외형/여백/레이아웃)
          'flex min-h-50 w-[320px] flex-col gap-6 rounded-xl border border-neutral-100 bg-white px-7 py-6 shadow-2xl',
          className,
        )}
      >
        {/* Radix DialogContent는 DialogTitle(스크린리더용 포함)을 요구 */}
        <DialogTitle className="sr-only">{a11yTitle}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Modal.Header props
 *
 * @property title - 모달 제목(필수)
 * @property subTitle - 서브타이틀/설명(필수)
 * @property className - 헤더 영역 추가 클래스
 */
type ModalHeaderProps = {
  title: string;
  subTitle: string;
  className?: string;
};

function Header({ title, subTitle, className }: ModalHeaderProps) {
  return (
    <DialogHeader className={className}>
      <h2 className="typo-heading-2 mb-1 text-neutral-900">{title}</h2>
      <p className="typo-body-7 text-neutral-400">{subTitle}</p>
    </DialogHeader>
  );
}

/**
 * Modal.Body props
 *
 * - 컨텐츠 영역 (텍스트/폼/리스트 등 자유롭게 구성)
 *
 * @property children - 바디 컨텐츠
 * @property className - 바디 영역 추가 클래스(스크롤 필요 시 여기서 설정)
 *
 */
type ModalBodyProps = {
  children: React.ReactNode;
  className?: string;
};

function Body({ children, className }: ModalBodyProps) {
  return <div className={className}>{children}</div>;
}

/**
 * Modal.Footer props
 *
 * - 버튼 영역 레이아웃을 최소 옵션으로 제어
 *
 * @property direction - 버튼 배치 방향 (row: 가로, col: 세로)
 * @property full - 버튼 폭 채우기
 *   - row + full: 자식에 flex-1 적용 (2개면 1/2 + 1/2)
 *   - col + full: 자식에 w-full 적용 (세로 full 버튼)
 * @property className - 푸터 영역 추가 클래스
 *
 */
type ModalFooterProps = {
  direction?: 'row' | 'col';
  full?: boolean;
  children: React.ReactNode;
  className?: string;
};

function Footer({ direction = 'row', full = false, children, className }: ModalFooterProps) {
  const directionClass = direction === 'col' ? 'flex-col' : 'flex-row';
  const fullClass = full ? (direction === 'col' ? '[&>*]:w-full' : '[&>*]:flex-1') : '';

  return (
    <div className={cn('flex justify-end gap-2 p-0', directionClass, fullClass, className)}>
      {children}
    </div>
  );
}

export const Modal = {
  Root,
  Header,
  Body,
  Footer,
};
