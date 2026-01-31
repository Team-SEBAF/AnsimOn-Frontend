# 안심온 Frontend

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Form**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Package Manager**: pnpm

---

## 개발 환경 세팅

### 1. 필수 설치

- **Node.js**: v20 이상
- **pnpm**: v10 이상

```bash
# pnpm 설치 (없는 경우)
corepack enable
corepack prepare pnpm@latest --activate
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.example.com
```

### 4. DB 시작 (필수)

백엔드 API를 사용하려면 **개발 시작 전 DB를 켜야 합니다.**

```bash
pnpm db:start
```

- 시작까지 **3~6분** 소요
- `pnpm db:status`로 상태 확인 (`available`이면 사용 가능)
- 개발 끝나면 `pnpm db:stop`으로 중지

### 5. 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

---

## 주요 명령어

| 명령어        | 설명            |
| ------------- | --------------- |
| `pnpm dev`    | 개발 서버 실행  |
| `pnpm build`  | 프로덕션 빌드   |
| `pnpm lint`   | ESLint 검사     |
| `pnpm format` | Prettier 포맷팅 |

### DB 관리 (개발용)

| 명령어           | 설명                 |
| ---------------- | -------------------- |
| `pnpm db:start`  | DB 시작 (3~6분 소요) |
| `pnpm db:status` | DB 상태 확인         |
| `pnpm db:stop`   | DB 중지              |

---

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API 호출 함수
│   ├── auth/               # 인증 페이지 (로그인, 회원가입)
│   └── ...
├── components/             # 공통 컴포넌트
├── hooks/                  # 커스텀 훅
├── lib/                    # 유틸리티
├── schemas/                # Zod 스키마
└── stores/                 # Zustand 스토어
```

---

## Git 브랜치 전략

- `main`: 프로덕션
- `dev`: 개발 통합
- `feat/*`: 기능 개발
- `fix/*`: 버그 수정

---

## 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
chore: 설정, 빌드 관련
refactor: 리팩토링
docs: 문서 수정
```

---

## Pre-commit Hook

커밋 시 **Husky + lint-staged**가 자동 실행됩니다.

### 동작 방식

```
git commit 실행
      ↓
Husky가 pre-commit 훅 실행
      ↓
lint-staged가 staged 파일만 검사
      ↓
├── *.ts, *.tsx → ESLint 자동 수정
└── *.ts, *.tsx, *.css, *.json 등 → Prettier 자동 포맷
      ↓
검사 통과 시 커밋 완료
```

### 검사 실패 시

- ESLint/Prettier 오류가 있으면 커밋이 **차단**됩니다
- 오류 메시지 확인 후 수정하고 다시 커밋하세요

### 수동 검사

```bash
# ESLint 검사 + 자동 수정
pnpm lint --fix

# Prettier 포맷팅
pnpm format
```
