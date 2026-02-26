import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  // blob URL 등 외부 리소스 생성/해제를 effect 내에서 setState로 관리해야 하는 케이스가 있어 warn으로 완화
  { rules: { 'react-hooks/set-state-in-effect': 'warn' } },

  // Disable ESLint rules that conflict with Prettier.
  eslintConfigPrettier,
]);

export default eslintConfig;
