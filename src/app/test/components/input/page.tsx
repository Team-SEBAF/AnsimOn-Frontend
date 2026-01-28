'use client';

import { useState } from 'react';
import { Input } from '@/components/Input';
import { Eye, EyeOff, Mail } from 'lucide-react';

export default function InputTestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('이메일을 입력해주세요');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('올바른 이메일 형식이 아닙니다');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('비밀번호를 입력해주세요');
    } else if (value.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-neutral-900">Input 테스트</h1>

        <div className="space-y-8 rounded-lg bg-white p-6 shadow">
          {/* 기본 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">기본</h2>
            <Input placeholder="이름을 입력하세요" />
          </div>

          {/* 라벨 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">라벨</h2>
            <Input label="이름" placeholder="홍길동" />
          </div>

          {/* 필수 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">필수</h2>
            <Input label="이메일" required placeholder="example@email.com" />
          </div>

          {/* 에러 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">에러</h2>
            <Input
              label="이메일"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              error={emailError}
              placeholder="example@email.com"
            />
          </div>

          {/* 아이콘 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">아이콘</h2>
            <Input label="이메일" icon={<Mail size={16} />} placeholder="example@email.com" />
          </div>

          {/* Disabled */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Disabled</h2>
            <Input label="이름" placeholder="홍길동" disabled />
          </div>

          {/* 비밀번호 (아이콘 클릭) */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">비밀번호 (아이콘 클릭)</h2>
            <Input
              label="비밀번호"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              error={passwordError}
              placeholder="8자 이상 입력"
              icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              onIconClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* 전체 조합 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">전체 조합</h2>
            <div className="space-y-4">
              <Input
                label="이메일"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                error={emailError}
                icon={<Mail size={16} />}
                placeholder="example@email.com"
              />

              <Input
                label="비밀번호"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                error={passwordError}
                placeholder="8자 이상 입력"
                icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                onIconClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {/* 사용법 */}
          <div className="mt-6 rounded bg-neutral-100 p-4">
            <p className="text-sm text-neutral-600">
              <strong>사용법:</strong>
            </p>
            <pre className="mt-2 text-xs">
              {`<Input
  label="이메일"
  required
  error={error}
  icon={<Mail />}
  placeholder="example@email.com"
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
