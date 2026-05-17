'use client';

import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';
import Image from 'next/image';
import HeaderImage1 from '@/assets/HeaderImage1.png';
import HeaderImage2 from '@/assets/Headerimage2.png';
import HeaderImage3 from '@/assets/Headerimage3.png';

const SLIDES = [HeaderImage1, HeaderImage2, HeaderImage3];

/** 자동 재생 간격 (ms) */
const AUTOPLAY_INTERVAL = 4000;

/**
 * 자동 재생 플러그인
 * - 일정 간격으로 다음 슬라이드로 이동
 */
const autoplayPlugin: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>;

  function nextTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      slider.next();
    }, AUTOPLAY_INTERVAL);
  }

  slider.on('created', nextTimeout);
  slider.on('animationEnded', nextTimeout);
  slider.on('destroyed', () => clearTimeout(timeout));
};

/**
 * 슬라이더 컴포넌트
 *
 * keen-slider를 사용한 캐러셀 구현
 * - 자동 재생
 * - 페이지네이션 도트로 현재 위치 표시 및 이동
 */
export default function Slider() {
  // 현재 활성화된 슬라이드 인덱스 (0부터 시작)
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * useKeenSlider 훅
   * - sliderRef: 슬라이더 컨테이너에 연결할 ref
   * - instanceRef: 슬라이더 인스턴스 접근용 ref (moveToIdx 등 메서드 호출)
   */
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      rubberband: false,
      // 부드러운 전환 애니메이션
      defaultAnimation: {
        duration: 800,
        easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out-cubic
      },
      slides: {
        perView: 1,
        spacing: 12,
      },
      // 슬라이드 전환 완료 시 호출 (애니메이션 끝난 후 1회)
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [autoplayPlugin],
  );

  return (
    <div className="flex flex-col items-center gap-12.5">
      {/* 슬라이더 컨테이너 */}
      <div ref={sliderRef} className="keen-slider w-160">
        {/* TODO: 실제 이미지로 교체 예정 (640x357px) */}
        {SLIDES.map((src, idx) => (
          <div key={idx} className="keen-slider__slide">
            <Image
              src={src}
              alt={`슬라이드 ${idx + 1}`}
              className="rounded-5 h-89.25 w-160 object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      <p className="typo-body-1 text-center text-black">
        We escalate transfer efficiency <br />
        and productivity
      </p>

      {/* 페이지네이션 도트 */}
      <div className="flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            aria-label={`${idx + 1}번 슬라이드로 이동`}
            className={`h-3 w-3 rounded-full transition ${
              currentSlide === idx ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
