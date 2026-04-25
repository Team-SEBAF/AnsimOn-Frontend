import { SectionBlock } from './SectionBlock';

export function ComplaintPurposeSection() {
  return (
    <SectionBlock title="3. 고소 취지" required>
      <div className="border-primary-dark bg-primary/10 rounded-lg border px-5 py-4">
        <p className="typo-body-5 text-black">
          고소인은 피고소인을{' '}
          <span className="text-error">스토킹범죄의 처벌 등에 관한 법률 위반</span>
          으로 고소하오니 철저하게 처벌하여 주시기 바랍니다.
        </p>
      </div>
    </SectionBlock>
  );
}
