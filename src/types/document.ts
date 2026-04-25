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
  fields?: { label: string; name: string; prefix?: string }[];
};

type CheckboxGroupCell = {
  type: 'checkbox-group';
  items: CheckboxItem[];
};

export type CellConfig = LabelCell | InputCell | CheckboxGroupCell;

// ─── 행 설정 ─────────────────────────────────────────

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

// ─── 전체 고소장 폼 값 (백엔드 스펙과 동일) ──────────────────

export type DocumentFormValues = {
  section_1_complainant: {
    name_or_company: string;
    resident_or_corp_registration_number: string;
    address: string;
    occupation: string;
    office_address: string;
    contact: {
      mobile: string;
      home: string;
      office: string;
    };
    email: string;
    representative: {
      is_legal_representative: boolean;
      is_lawyer: boolean;
      name: string;
      contact: string;
    };
  };
  section_2_accused: {
    name: string;
    resident_registration_number: string;
    address: string;
    occupation: string;
    office_address: string;
    contact: {
      mobile: string;
      home: string;
      office: string;
    };
    email: string;
    other_details: string;
  };
  section_4_crime_facts: { content: string };
  section_5_complaint_reason: { content: string };
  section_6_evidence: {
    has_evidence_beyond_statement: boolean;
    evidence_list_text: string[];
  };
  section_7_related_cases: {
    is_duplicate_complaint: boolean;
    has_related_criminal_investigation: boolean;
    has_related_civil_lawsuit: boolean;
  };
  section_8_other: { content: string };
};

export type PatchDocumentPayload = Partial<DocumentFormValues>;

export type NeedToGenerateDocumentResponse = {
  need_to_generate: boolean;
};

export type RequestGenerateDocumentResponse = {
  task_id: string;
};

export const defaultDocumentValues: DocumentFormValues = {
  section_1_complainant: {
    name_or_company: '',
    resident_or_corp_registration_number: '',
    address: '',
    occupation: '',
    office_address: '',
    contact: { mobile: '', home: '', office: '' },
    email: '',
    representative: {
      is_legal_representative: false,
      is_lawyer: false,
      name: '',
      contact: '',
    },
  },
  section_2_accused: {
    name: '',
    resident_registration_number: '',
    address: '',
    occupation: '',
    office_address: '',
    contact: { mobile: '', home: '', office: '' },
    email: '',
    other_details: '',
  },
  section_4_crime_facts: { content: '' },
  section_5_complaint_reason: { content: '' },
  section_6_evidence: {
    has_evidence_beyond_statement: false,
    evidence_list_text: [],
  },
  section_7_related_cases: {
    is_duplicate_complaint: false,
    has_related_criminal_investigation: false,
    has_related_civil_lawsuit: false,
  },
  section_8_other: { content: '' },
};
