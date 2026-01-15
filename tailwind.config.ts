import type { Config } from 'tailwindcss';

// Tailwind 설정
// - semantic 컬러 토큰만 Tailwind에 노출
// - primitive 컬러 직접 사용 방지
export default {
  // Tailwind가 클래스 스캔할 파일 범위
  content: ['./src/**/*.{ts,tsx,js,jsx,html}'],

  theme: {
    extend: {
      colors: {
        // 브랜드 대표 컬러
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          soft: 'var(--color-primary-soft)',
          dark: 'var(--color-primary-dark)',
        },

        // 버튼 전용 컬러
        btn: {
          DEFAULT: 'var(--color-btn)',
          hover: 'var(--color-btn-hover)',
          pressed: 'var(--color-btn-pressed)',
          disabled: 'var(--color-btn-disabled)',
        },

        // 배경 컬러
        bg: {
          1: 'var(--color-bg-1)',
          2: 'var(--color-bg-2)',
        },

        // 상태(semantic) 컬러
        info: 'var(--color-info)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
    },
  },

  // 추가 플러그인 없음
  plugins: [],
} satisfies Config;
