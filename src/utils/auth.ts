import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ID_TOKEN_KEY = 'idToken';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const authCookies = {
  // 토큰 저장
  setTokens: (accessToken: string, refreshToken: string, idToken: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      ...COOKIE_OPTIONS,
      expires: 1 / 24, // 1시간
    });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      ...COOKIE_OPTIONS,
      expires: 3, // 3일
    });
    Cookies.set(ID_TOKEN_KEY, idToken, {
      ...COOKIE_OPTIONS,
      expires: 1 / 24, // 1시간 (access token과 동일)
    });
  },

  // 토큰 갱신 (리프레시 시 - refresh_token 제외)
  updateTokens: (accessToken: string, idToken: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      ...COOKIE_OPTIONS,
      expires: 1 / 24,
    });
    Cookies.set(ID_TOKEN_KEY, idToken, {
      ...COOKIE_OPTIONS,
      expires: 1 / 24,
    });
  },

  // Access Token 읽기
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_KEY),

  // Refresh Token 읽기
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),

  // ID Token 읽기
  getIdToken: () => Cookies.get(ID_TOKEN_KEY),

  // 토큰 삭제 (로그아웃)
  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
    Cookies.remove(ID_TOKEN_KEY, { path: '/' });
  },

  // 로그인 여부 (refresh_token 기준 - 3일간 세션 유지)
  isLoggedIn: () => !!Cookies.get(REFRESH_TOKEN_KEY),
};
