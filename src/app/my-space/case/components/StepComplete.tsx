'use client';

import { useState } from 'react';
import Image from 'next/image';
import FileDownloadIcon from '@/assets/icons/FileDownloadIcon.svg';
import FileIcon from '@/assets/icons/FileIcon.svg';
import InstructionsIcon from '@/assets/icons/InstructionsIcon.png';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { useDownloadTimeline } from '../hooks/useTimeline';
import { useDownloadDocument, useDownloadAll } from '../hooks/useComplete';

const SUBMIT_METHODS = [
  {
    title: '온라인 제출',
    badge: '권장',
    description:
      '경찰청 사이버민원센터(ecrm.police.go.kr)를 통해 온라인으로 고소장을 제출할 수 있습니다. 다운로드한 파일을 업로드하고, 본인인증 후 제출하시면 됩니다.',
  },
  {
    title: '경찰서 직접 방문',
    badge: null,
    description:
      '가까운 경찰서의 민원실 또는 여성청소년과를 방문하여 제출할 수 있습니다. 다운로드한 자료와 신분증을 지참하세요. 사전 예약은 필요하지 않습니다.',
  },
  {
    title: '우편 제출',
    badge: null,
    description:
      '관할 경찰서 수사과 또는 여성청소년과 앞으로 등기우편 발송이 가능합니다. 고소장과 증거자료를 출력하여 우편으로 보내시면 됩니다.',
  },
];

const CHECKLIST = [
  {
    question: '고소 주체와 의사가 명확한가요?',
    description:
      '고소인은 누구인지 분명히 기재되어 있으며, 본인의 고소 의사가 명확히 드러나야합니다.',
  },
  {
    question: '대리 고소의 경우 증명 서류를 함께 첨부했나요?',
    description:
      '미성년자의 친권자 등 법정대리인이 고소하는 경우, 혹은 변호사에 의한 고소대리의 경우 이를 증명할 수 있는 서류를 함께 첨부하여 제출해야 합니다.',
  },
  {
    question: '피고소인을 특정할 수 있나요?',
    description:
      '실명 여부와 관계없이 관계, 연락 수단, 계정 등 신원 특정이 가능한 정보가 포함되어 있어야합니다.',
  },
  {
    question: '스토킹 행위의 반복성과 기간이 객관적으로 드러나있나요?',
    description: '단발 사건이 아닌, 유사한 행위가 일정 기간 반복되었음이 잘 드러나야합니다.',
  },
  {
    question: '사실 중심 서술과 증거의 직접성이 확보되어있나요?',
    description:
      '추측·의견·감정 표현을 배제하고 행위·시점·장소 중심으로 서술되어 있으며, 각 증거가 직접적으로 연결되어 있어야합니다.',
  },
];

const RELATED_ORGS = [
  {
    name: '해바라기센터',
    phone: '1899-3075',
    description: '전국 센터 연계 가능하며 심리 상담, 의료 지원, 법률 지원을 한 곳에서 제공합니다',
  },
  {
    name: '여성 긴급 전화',
    phone: '1366 (24시간 운영)',
    description:
      '스토킹·데이트폭력·가정폭력 피해 상담 및 보호시설 연계, 경찰·법률·의료 지원 안내받을 수 있어요',
  },
  {
    name: '원스톱 지원센터',
    phone: '1577-1701',
    description: '스토킹, 성폭력 등 모든 법적 피해에 대한 법리 지원 가능해요',
  },
  {
    name: '여성폭력 사이버 상담 카카오톡 채널',
    phone: null,
    description:
      '카카오톡 플러스 친구 "여성폭력 사이버 상담(Women1366)"을 통한 전국 24시간 온라인 상담이 가능해요',
  },
];

export function StepComplete() {
  const downloadTimeline = useDownloadTimeline();
  const downloadDocument = useDownloadDocument();
  const downloadAll = useDownloadAll();
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.map(() => false));

  const handleDownload = async (mutate: {
    mutateAsync: () => Promise<{ download_url: string }>;
  }) => {
    const { download_url } = await mutate.mutateAsync();
    window.open(download_url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 자료 다운로드 */}
      <div className="flex flex-col gap-6 rounded-2xl border border-[#F5F5F5] bg-white px-7 py-6 shadow-[0_20px_50px_-5px_rgba(64,64,64,0.05)]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="typo-heading-2 text-gray-900">자료 다운로드</h2>
            <p className="typo-body-7 text-gray-400">
              모든 자료를 ZIP 파일로 다운로드 할 수 있습니다
            </p>
          </div>
          <Button
            color="contrast"
            size="lg"
            loading={downloadAll.isPending}
            onClick={() => handleDownload(downloadAll)}
          >
            <FileDownloadIcon width={20} height={20} className="text-white" />
            전체 다운로드
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 증거자료 카드 */}
          <div className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#F5F5F5] p-6 shadow-[0_20px_50px_-5px_#4040400D]">
            <div>
              <p className="typo-heading-4 mb-1 text-gray-900">증거자료</p>
              <p className="typo-body-8 text-gray-400">원본 파일 및 타임라인</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
              <FileIcon width={18} height={18} className="shrink-0 text-gray-400" />
              <span className="typo-body-8 flex-1 truncate text-gray-600">
                안심온_증거분석타임라인.zip
              </span>
              <button
                onClick={() => handleDownload(downloadTimeline)}
                disabled={downloadTimeline.isPending}
                className="text-primary shrink-0 disabled:opacity-50"
              >
                <FileDownloadIcon width={18} height={18} />
              </button>
            </div>
          </div>

          {/* 고소장·진술서 카드 */}
          <div className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#F5F5F5] p-6 shadow-[0_20px_50px_-5px_#4040400D]">
            <div>
              <p className="typo-heading-4 mb-1 text-gray-900">고소장 및 진술서</p>
              <p className="typo-body-8 text-gray-400">작성된 고소장·진술서 PDF</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
              <FileIcon width={18} height={18} className="shrink-0 text-gray-400" />
              <span className="typo-body-8 flex-1 truncate text-gray-600">안심온_고소장.zip</span>
              <button
                onClick={() => handleDownload(downloadDocument)}
                disabled={downloadDocument.isPending}
                className="text-primary shrink-0 disabled:opacity-50"
              >
                <FileDownloadIcon width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 제출 방법 안내 */}
      <div className="rounded-xl border border-[#F5F5F5] bg-white px-7 py-6 shadow-[0_20px_50px_-5px_rgba(64,64,64,0.05)]">
        <h2 className="typo-heading-2 mb-1 text-gray-900">제출 방법 안내</h2>
        <p className="typo-body-7 mb-5 text-gray-400">
          다운받은 자료를 기반으로 제출하는 방법을 안내해드립니다
        </p>
        <div className="space-y-4">
          {SUBMIT_METHODS.map((method) => (
            <div
              key={method.title}
              className="flex gap-6 rounded-2xl border border-gray-100 px-7 py-6"
            >
              <Image src={InstructionsIcon} alt="" width={40} height={40} className="shrink-0" />
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="typo-heading-4 text-gray-900">{method.title}</span>
                  {method.badge && (
                    <span className="typo-body-8 bg-primary/10 text-primary inline-flex h-5 items-center rounded-full px-1.5">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="typo-body-7 text-gray-600">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2 rounded-lg border border-gray-100 bg-gray-50 px-5 py-4">
          <strong>도움말</strong>
          <p className="typo-body-8 text-gray-400">
            고소장 제출 후 수사 과정에서 어려움이 있거나 도움이 필요하시면 여성신변안전 1366,
            스토킹피해상담 117, 또는 법률구조공단(국번없이 132)에 문의하실 수 있습니다.
          </p>
        </div>
      </div>

      {/* 안심온 CheckList */}
      <div className="rounded-xl border border-[#F5F5F5] bg-white px-7 py-6 shadow-[0_20px_50px_-5px_rgba(64,64,64,0.05)]">
        <h2 className="typo-heading-2 mb-1 text-gray-900">안심온 CheckList !</h2>
        <p className="typo-body-7 mb-5 text-gray-400">
          마지막으로 놓친 부분은 없는지 체크리스트를 확인해보여 고소 준비를 함께 마쳐드립니다
        </p>
        <div className="space-y-2">
          {CHECKLIST.map((item, i) => (
            <div
              key={item.question}
              className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white px-5 py-4"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checked[i]}
                  onCheckedChange={(val) =>
                    setChecked((prev) => prev.map((c, idx) => (idx === i ? !!val : c)))
                  }
                  className="h-6 w-6 shrink-0"
                />
                <span className="typo-heading-4 text-gray-900">{item.question}</span>
              </div>
              <p className="typo-body-7 pl-8 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 연관 기관 안내 */}
      <div className="rounded-xl border border-[#F5F5F5] bg-white px-7 py-6 shadow-[0_20px_50px_-5px_rgba(64,64,64,0.05)]">
        <h2 className="typo-heading-2 mb-5 text-gray-900">연관 기관 안내</h2>
        <div className="grid gap-6">
          {RELATED_ORGS.map((org) => (
            <div key={org.name} className="rounded-lg border border-gray-100 px-5 py-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="typo-heading-4 text-gray-900">{org.name}</span>
                {org.phone && <span className="typo-body-7 text-gray-400">| {org.phone}</span>}
              </div>
              <p className="typo-body-7 text-gray-600">{org.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
