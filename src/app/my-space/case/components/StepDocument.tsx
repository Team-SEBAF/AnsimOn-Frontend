'use client';

import ExternalLinkIcon from '@/assets/icons/external-link.svg';
import { TabsList } from '@/components/ui/tabs';
import { AppTabs, AppTabsTrigger, AppTabsContent } from '@/components/AppTabs';
import { Button } from '@/components/Button';
import { ComplainantForm } from './document/ComplainantForm';
import { SectionBlock } from './document/SectionBlock';
import { ContentBlock } from './document/ContentBlock';

export function StepDocument() {
  return (
    <AppTabs defaultValue="complaint">
      {/* 탭 헤더 + 링크 공유 버튼 */}
      <div className="mb-6 flex items-center justify-between">
        <TabsList className="h-auto rounded-none bg-transparent p-0">
          <AppTabsTrigger value="complaint">고소장</AppTabsTrigger>
          <AppTabsTrigger value="statement">진술서</AppTabsTrigger>
        </TabsList>
        <Button color="contrast" variant="outline" size="md">
          <ExternalLinkIcon width={16} height={16} />
          링크 공유
        </Button>
      </div>

      {/* 고소장 탭 */}
      <AppTabsContent value="complaint">
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
            <ComplainantForm />

            {/* TODO: DefendantForm */}
            {/* TODO: ComplaintPurposeSection */}

            {/* SectionBlock + ContentBlock 미리보기 */}
            <SectionBlock title="4. 범죄 사실" required>
              <ContentBlock note="※ 범죄사실은 일시, 장소, 방법, 결과 등을 구체적으로 특정하여 기재하여 주시기 바랍니다.">
                <textarea
                  rows={6}
                  placeholder="범죄 사실을 입력하세요"
                  className="typo-body-7 focus:border-primary w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300"
                />
              </ContentBlock>
            </SectionBlock>

            <SectionBlock title="5. 고소 이유">
              <ContentBlock note="※ 고소이유에는 피고소인의 범행 경위 및 경과, 고소를 하게 된 동기와 사유 등을 기재하여 주시기 바랍니다.">
                <textarea
                  rows={6}
                  placeholder="고소 이유를 입력하세요"
                  className="typo-body-7 focus:border-primary w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300"
                />
              </ContentBlock>
            </SectionBlock>

            {/* TODO: EvidenceSection */}
            {/* TODO: RelatedCasesSection */}
            {/* TODO: OtherSection */}
            {/* TODO: SubmissionFooter */}
          </div>
        </div>
      </AppTabsContent>

      {/* 진술서 탭 (미구현) */}
      <AppTabsContent value="statement">
        <div className="flex items-center justify-center py-20">
          <p className="typo-body-7 text-gray-400">진술서 준비 중입니다.</p>
        </div>
      </AppTabsContent>
    </AppTabs>
  );
}
