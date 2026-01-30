import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const authCookies = {
  // 토큰 저장
  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      ...COOKIE_OPTIONS,
      expires: 1 / 24, // 1시간
    });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      ...COOKIE_OPTIONS,
      expires: 7, // 7일
    });
  },

  // Access Token 읽기
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_KEY),

  // Refresh Token 읽기
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),

  // 토큰 삭제 (로그아웃)
  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
  },

  // 로그인 여부
  isLoggedIn: () => !!Cookies.get(ACCESS_TOKEN_KEY),
};
