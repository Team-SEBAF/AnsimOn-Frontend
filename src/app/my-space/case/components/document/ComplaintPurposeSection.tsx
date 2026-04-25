'use client';

const COMPLAINT_PURPOSE_TEXT =
  '고소인은 피고소인을 스토킹범죄의처벌등에관한법률위반으로 고소하오니 법에 따라 처벌하여 주시기 바랍니다.';

export function ComplaintPurposeSection() {
  return (
    <section>
      <h3 className="typo-heading-3 mb-3 text-gray-900">3. 고소 취지</h3>
      <div className="border-primary-dark bg-primary rounded-lg border px-5 py-4">
        <p className="typo-body-6 text-warning-700">{COMPLAINT_PURPOSE_TEXT}</p>
      </div>
    </section>
  );
}
