interface Props {
  accuserName: string | null;
  submitterName: string | null;
  policeStation: string | null;
}

export function SubmissionFooter({ accuserName, submitterName, policeStation }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* 법적 고지 */}
      <p className="typo-body-7 text-center text-black">
        본 고소장에 기재한 내용은 고소인이 알고 있는 사실과 정황을 바탕으로 작성한 것이며,
        <br />
        검찰 또는 경찰에서 조사하였으면, 허위사실을 고소하였을 시에는 형법 제156조 무고죄로 처벌받을
        수 있습니다
      </p>

      {/* 날짜 */}
      <div className="typo-body-3 flex items-end justify-center gap-2 text-black">
        <span>20</span>
        <span className="w-16 border-b px-0.5" />
        <span>년</span>
        <span className="w-16 border-b px-0.5" />
        <span>월</span>
        <span className="w-16 border-b px-0.5" />
        <span>일</span>
      </div>

      {/* 고소인 · 제출인 */}
      <div className="flex flex-col gap-6">
        {[
          { label: '고소인', value: accuserName },
          { label: '제출인', value: submitterName },
        ].map(({ label, value }) => (
          <div key={label} className="typo-body-3 flex items-end gap-2 text-black">
            <span>{label}</span>
            <span className="w-40 border-b px-0.5 text-center">{value ?? ''}</span>
            <span>(인)</span>
          </div>
        ))}
      </div>

      {/* 안내 문구 */}
      <p className="typo-body-7 pb-6 text-black">
        ※ 고소장 제출을 기재하여야하며, 고소인 란에는 고소인이 직접 작성한 서명 또는 날인이
        필요합니다.
        <br />
        다만, 법정대리인이나 변호사에 의한 고소대리의 경우 제출인의 기재·서명 또는 날인을
        하여야합니다.
      </p>

      {/* 경찰서 */}
      <div className="flex items-end justify-center gap-2 pt-6">
        <div className="flex w-40 flex-col items-center">
          <span className="typo-body-4 text-gray-900">{policeStation ?? ''}</span>
          <span className="w-full border-b" />
        </div>
        <span className="typo-heading-1 shrink-0 text-gray-900">귀중</span>
      </div>

      <p className="typo-body-8 -mt-4 text-center text-gray-300">
        ※ 고소장은 가까운 경찰서에 제출해주세요
      </p>
    </div>
  );
}
