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
  fields: { label: string; name: string }[];
};

type CheckboxGroupCell = {
  type: 'checkbox-group';
  items: CheckboxItem[];
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
  control: Control<T>;
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
  legalRep: boolean;
  legalRepName: string;
  legalRepContact: string;
  lawyerRep: boolean;
  lawyerRepName: string;
  lawyerRepContact: string;
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
