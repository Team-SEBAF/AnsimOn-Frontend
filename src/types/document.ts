import type {
  UseFormRegister,
  UseFormWatch,
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
  Path,
} from 'react-hook-form';

// ─── 셀 설정 ─────────────────────────────────────────

type LabelCell = {
  type: 'label';
  text: string;
  subText?: string;
};

export type InputCell<T extends FieldValues = FieldValues> = {
  type?: 'input';
  name: Path<T>;
  placeholder?: string;
  /** 인라인 앞 라벨 (예: "휴대폰", "자택") */
  prefix?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions<any, any>;
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

export type CellConfig<T extends FieldValues = FieldValues> =
  | LabelCell
  | InputCell<T>
  | CheckboxGroupCell;

// ─── 행 설정 ─────────────────────────────────────────

export type RowConfig<T extends FieldValues = FieldValues> = {
  cells: [LabelCell, ...CellConfig<T>[]];
};

// ─── FormTable props ──────────────────────────────────

export type FormTableProps<T extends FieldValues> = {
  rows: RowConfig<T>[];
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  errors?: FieldErrors<T>;
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
    is_duplicate_complaint: boolean | null;
    has_related_criminal_investigation: boolean | null;
    has_related_civil_lawsuit: boolean | null;
  };
  section_8_other: { content: string | null };
  submission_footer: {
    accuser_name: string | null;
    submitter_name: string | null;
    submission_target_police_station: string | null;
  };
};

export type StatementFormValues = {
  damage_facts_statement: string;
  declarant_name: string;
  submission_target_police_station: string;
};

export type CombinedDocumentFormValues = DocumentFormValues & {
  statement: StatementFormValues;
};

export type PatchDocumentPayload = Partial<DocumentFormValues>;

export type NeedToGenerateDocumentResponse = {
  need_to_generate: boolean;
};

export type RequestGenerateDocumentResponse = {
  task_id: string;
};

/** 필수 텍스트 필드 공통 규칙 */
export const requiredText: RegisterOptions<FieldValues> = {
  required: '필수 입력 항목입니다',
  validate: (v: string) => !!v?.trim() || '필수 입력 항목입니다',
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
    is_duplicate_complaint: null,
    has_related_criminal_investigation: null,
    has_related_civil_lawsuit: null,
  },
  section_8_other: { content: null },
  submission_footer: {
    accuser_name: null,
    submitter_name: null,
    submission_target_police_station: null,
  },
};
