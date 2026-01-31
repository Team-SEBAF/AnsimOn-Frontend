import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getGoogleToken } from '@/app/api/auth/google';
import { authCookies } from '@/utils/auth';

export function useGoogle() {
  // (1) 구글 로그인 함수
  const loginWithGoogle = async () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
      identity_provider: 'Google',
    });

    window.location.href = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
  };

  // (2) 구글 로그인 콜백 후 토큰 저장 Side Effect
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const code = params.get('code');
    if (!code) return;

    const run = async () => {
      try {
        // 1. 구글 로그인 코드로 토큰 교환
        setGoogleLoading(true);
        const { access_token, refresh_token } = await getGoogleToken(code);

        // 2. 토큰 저장
        login(access_token, refresh_token);
        setGoogleLoading(false);

        // 3. 메인 페이지로 이동
        router.push('/my-space');
      } catch {
        // TODO: 에러 토스트
      }
    };

    run();
  }, [params, router]);

  // (3) 구글 로그아웃 함수
  const logoutWithGoogle = () => {
    // 1. 토큰 삭제
    authCookies.clearTokens();

    // 2. Cognito 세션 로그아웃
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      logout_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
    });

    window.location.href = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout?${params.toString()}`;
  };

  // (4) 리프레시 토큰 갱신 함수

  return { loginWithGoogle, googleLoading, logoutWithGoogle };
}
