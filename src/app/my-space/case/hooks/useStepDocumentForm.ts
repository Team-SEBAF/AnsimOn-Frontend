'use client';

import { useRef, useEffect, type RefObject } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegister, UseFormWatch, Control, FieldErrors } from 'react-hook-form';
import type { DocumentFormValues, CombinedDocumentFormValues } from '@/types/document';
import { showAlert } from '@/utils/alert';

const getDocumentValues = (values: CombinedDocumentFormValues): DocumentFormValues => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { statement, ...documentValues } = values;
  return documentValues;
};

interface Params {
  documentData: DocumentFormValues;
  saveDocument: (payload: Partial<DocumentFormValues>) => Promise<unknown>;
  onValidSubmit: (values: DocumentFormValues) => void;
  rootRef: RefObject<HTMLElement | null>;
}

interface DocForm {
  register: UseFormRegister<DocumentFormValues>;
  watch: UseFormWatch<DocumentFormValues>;
  control: Control<DocumentFormValues>;
  errors: FieldErrors<DocumentFormValues>;
}

export function useStepDocumentForm({
  documentData,
  saveDocument,
  onValidSubmit,
  rootRef,
}: Params) {
  const form = useForm<CombinedDocumentFormValues>({
    defaultValues: {
      ...documentData,
      statement: {
        damage_facts_statement: '',
        declarant_name: '',
        submission_target_police_station: '',
      },
    },
  });
  const {
    register,
    watch,
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, dirtyFields },
  } = form;

  const dirtyFieldsRef = useRef(dirtyFields);
  useEffect(() => {
    dirtyFieldsRef.current = dirtyFields;
  });

  const docForm: DocForm = {
    register: register as unknown as UseFormRegister<DocumentFormValues>,
    watch: watch as unknown as UseFormWatch<DocumentFormValues>,
    control: control as unknown as Control<DocumentFormValues>,
    errors: errors as unknown as FieldErrors<DocumentFormValues>,
  };

  const getDirtyDocumentPayload = (
    values: CombinedDocumentFormValues,
  ): Partial<DocumentFormValues> => {
    const documentValues = getDocumentValues(values);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { statement, ...documentDirtyFields } = dirtyFieldsRef.current;
    return Object.keys(documentDirtyFields).reduce((acc, key) => {
      const documentKey = key as keyof DocumentFormValues;
      return { ...acc, [documentKey]: documentValues[documentKey] };
    }, {} as Partial<DocumentFormValues>);
  };

  const scrollToFirstInvalid = () => {
    const invalidEl = Array.from(
      rootRef.current?.querySelectorAll('[aria-invalid="true"]') ?? [],
    ).find((el) => (el as HTMLElement).offsetParent !== null);
    invalidEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleInvalidSubmit = () => {
    showAlert.error({
      title: '고소장·진술서의 필수 항목을 확인해주세요.',
    });
    scrollToFirstInvalid();
  };

  const submit = () =>
    handleSubmit(async (values) => {
      const documentValues = getDocumentValues(values);
      const payload = getDirtyDocumentPayload(values);
      if (Object.keys(payload).length > 0) await saveDocument(payload);
      onValidSubmit(documentValues);
    }, handleInvalidSubmit)();

  const save = async () => {
    const isValid = await trigger();
    if (!isValid) {
      handleInvalidSubmit();
      return;
    }
    const values = getValues();
    const payload = getDirtyDocumentPayload(values);
    if (Object.keys(payload).length > 0) await saveDocument(payload);
  };

  return { form, docForm, submit, save };
}
