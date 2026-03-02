import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getGoogleToken } from '@/api/auth/google';

export function useGoogleAuth() {
  const logout = useAuthStore((state) => state.logout);

  // (1) 구글 로그인 함수
  const loginWithGoogle = () => {
    // 현재 URL의 ?redirect= 값을 OAuth state에 담아서 콜백까지 전달
    const redirect = new URLSearchParams(window.location.search).get('redirect');

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      response_type: 'code',
      scope: 'openid email profile aws.cognito.signin.user.admin',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
      identity_provider: 'Google',
    });

    if (redirect) {
      params.set('state', redirect);
    }

    window.location.href = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
  };

  // (2) 구글 로그아웃 함수
  const logoutWithGoogle = () => {
    // 1. 토큰 삭제 + Zustand 상태 초기화
    logout();

    // 2. Cognito 세션 로그아웃
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      logout_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
    });

    window.location.href = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout?${params.toString()}`;
  };

  return { loginWithGoogle, logoutWithGoogle };
}

// (3)구글 로그인 콜백 후 토큰 저장 Side Effect
export function useGoogleLoginSideEffect() {
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
        const { access_token, refresh_token, id_token } = await getGoogleToken(code);

        // 2. 토큰 저장
        login(access_token, refresh_token, id_token);
        setGoogleLoading(false);

        // 3. OAuth state에서 redirect 경로 읽고 이동
        const redirect = params.get('state') || '/my-space/case';
        router.replace(redirect);
      } catch {
        // TODO: 에러 토스트
      }
    };

    run();
  }, [params, router]);

  return { googleLoading };
}
