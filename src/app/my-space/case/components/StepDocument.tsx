'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { TabsList } from '@/components/ui/tabs';
import { AppTabs, AppTabsTrigger, AppTabsContent } from '@/components/AppTabs';
import {
  ComplainantForm,
  DefendantForm,
  ComplaintPurposeSection,
  TextareaSection,
  EvidenceSection,
  RelatedCasesSection,
  SectionBlock,
  ContentBlock,
  SubmissionFooter,
  StatementContent,
} from './document';
import type { DocumentFormValues } from '@/types/document';
import {
  useGetDocument,
  usePatchDocument,
  useGetStatement,
  usePatchStatement,
} from '../hooks/useDocument';
import { useStepDocumentForm } from '../hooks/useStepDocumentForm';

export type StepDocumentHandle = {
  submit: () => void;
  save: () => Promise<void>;
};

interface Props {
  complaintId: string;
  onValidSubmit: (values: DocumentFormValues) => void;
}

export const StepDocument = forwardRef<StepDocumentHandle, Props>(function StepDocument(
  { complaintId, onValidSubmit },
  ref,
) {
  const { data: documentData } = useGetDocument(complaintId);
  const { data: statementData } = useGetStatement(complaintId);
  const { mutateAsync: saveDocument } = usePatchDocument(complaintId);
  const { mutateAsync: saveStatement } = usePatchStatement(complaintId);
  const rootRef = useRef<HTMLDivElement>(null);
  const { form, docForm, submit, save } = useStepDocumentForm({
    documentData,
    statementData,
    saveDocument,
    saveStatement,
    onValidSubmit,
    rootRef,
  });

  useImperativeHandle(ref, () => ({ submit, save }));

  return (
    <div ref={rootRef}>
      <AppTabs defaultValue="complaint">
        {/* 탭 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <TabsList className="h-auto rounded-none bg-transparent p-0">
            <AppTabsTrigger value="complaint">고소장</AppTabsTrigger>
            <AppTabsTrigger value="statement">진술서</AppTabsTrigger>
          </TabsList>
        </div>

        {/* 고소장 탭 */}
        <AppTabsContent value="complaint" forceMount className="data-[state=inactive]:hidden">
          <div className="min-w-292 rounded-xl bg-white py-6 shadow-[0px_20px_50px_-5px_#4040400D]">
            {/* 문서 헤더 */}
            <div className="border-b border-gray-200 p-6 text-center">
              <h2 className="typo-heading-1 text-gray-900">고소장</h2>
              <p className="typo-body-4 mt-2 text-gray-400">
                고소장 기재사항 등 [ 필수 ] 표시된 항목은 반드시 기재하여야합니다
              </p>
            </div>

            {/* 폼 섹션 목록 */}
            <div className="flex flex-col gap-10 px-10 py-10">
              <ComplainantForm
                register={docForm.register}
                watch={docForm.watch}
                control={docForm.control}
                errors={docForm.errors}
              />
              <DefendantForm
                register={docForm.register}
                watch={docForm.watch}
                control={docForm.control}
                errors={docForm.errors}
              />
              <ComplaintPurposeSection />
              <TextareaSection
                title="4. 범죄 사실"
                required
                note="※ 범죄사실은 형법 등 처벌법규에 해당하는 사실에 대하여 육하, 장소, 방법행, 결과 등을 구체적으로 특정하여 기재하여 피고소인의 얼굴과 목소리 등 외부에서 인지할 수 있는 사실만을 기재하여야 합니다"
                placeholder="범죄 사실을 입력하세요"
                fieldName="section_4_crime_facts.content"
                register={docForm.register}
                rules={{
                  required: '범죄사실 내용을 입력해주세요',
                  validate: (v: unknown) =>
                    !!(v as string)?.trim() || '범죄사실 내용을 입력해주세요',
                }}
                error={docForm.errors.section_4_crime_facts?.content}
              />
              <TextareaSection
                title="5. 고소 이유"
                note="※ 고소이유에는 피고소인의 범행 경위 및 경과, 고소를 하게 된 동기와 사유 등 범죄사실을 뒷받침하는 내용을 간략, 명료하게 기재하여 합니다."
                placeholder="고소 이유를 입력하세요"
                fieldName="section_5_complaint_reason.content"
                register={docForm.register}
              />
              <EvidenceSection
                control={docForm.control}
                watch={docForm.watch}
                evidenceList={documentData.section_6_evidence.evidence_list_text}
              />
              <RelatedCasesSection control={docForm.control} />

              {/* 8. 기타 */}
              <SectionBlock title="8. 기타">
                <ContentBlock>
                  <textarea
                    {...docForm.register('section_8_other.content')}
                    rows={4}
                    placeholder="기타 추가하실 내용이 있으면 작성해주세요"
                    className="typo-body-7 focus:border-primary w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300"
                  />
                </ContentBlock>
              </SectionBlock>

              <SubmissionFooter
                accuserName={documentData.submission_footer.accuser_name}
                submitterName={documentData.submission_footer.submitter_name}
                policeStation={documentData.submission_footer.submission_target_police_station}
              />
            </div>
          </div>
        </AppTabsContent>

        {/* 진술서 탭 */}
        <AppTabsContent value="statement" forceMount className="data-[state=inactive]:hidden">
          <StatementContent
            register={form.register}
            errors={form.formState.errors}
            policeStation={statementData.submission_target_police_station}
          />
        </AppTabsContent>
      </AppTabs>
    </div>
  );
});
