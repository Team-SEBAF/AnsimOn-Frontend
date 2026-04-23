import type { UseFormRegister, UseFormWatch, Control, FieldValues } from 'react-hook-form';

// ─── 셀 설정 ─────────────────────────────────────────

type LabelCell = {
  type: 'label';
  text: string;
  subText?: string;
};

type InputCell = {
  type?: 'input';
  name: string;
  placeholder?: string;
  /** 인라인 앞 라벨 (예: "휴대폰", "자택") */
  prefix?: string;
};

type CheckboxItem = {
  checkboxName: string;
  label: string;
};

type CheckboxGroupCell = {
  type: 'checkbox-group';
  items: CheckboxItem[];
  /** 체크박스들이 공유하는 입력 필드 (하나라도 체크 시 활성화) */
  sharedFields?: { label: string; name: string }[];
};

export type CellConfig = LabelCell | InputCell | CheckboxGroupCell;

// ─── 행 설정 ─────────────────────────────────────────
// cells[0]은 항상 LabelCell (메인 라벨)

export type RowConfig = {
  cells: [LabelCell, ...CellConfig[]];
};

// ─── FormTable props ──────────────────────────────────

export type FormTableProps<T extends FieldValues> = {
  rows: RowConfig[];
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
};

// ─── 폼 값 ────────────────────────────────────────────

export type ComplainantFormValues = {
  name: string;
  idNumber: string;
  address: string;
  job: string;
  officeAddress: string;
  phoneMobile: string;
  phoneHome: string;
  phoneOffice: string;
  email: string;
  representative_is_legal: boolean;
  representative_is_lawyer: boolean;
  representative_name: string;
  representative_contact: string;
};

export type DefendantFormValues = {
  name: string;
  idNumber: string;
  address: string;
  job: string;
  officeAddress: string;
  phoneMobile: string;
  phoneHome: string;
  phoneOffice: string;
  email: string;
  notes: string;
};
