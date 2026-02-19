/** 백엔드 에러 코드 */
export type ApiErrorCode =
  // Auth - Signup
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_PASSWORD'
  // Auth - Verify
  | 'INVALID_CODE'
  | 'EXPIRED_CODE'
  // Auth - Login
  | 'USER_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_CONFIRMED'
  // Auth - Token
  | 'INVALID_REFRESH_TOKEN'
  // Frontend
  | 'NETWORK_ERROR';

/** 백엔드 공통 에러 응답 */
export type ApiError = {
  code: ApiErrorCode;
  message?: string;
};
