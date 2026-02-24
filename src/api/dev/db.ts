import { axiosInstance } from '../axiosInstance';

export type DbStatus = 'available' | 'unavailable';

export type DbStatusResponse = {
  status: DbStatus;
};

/**
 * DB 시작
 * - 개발 시작할 때 호출
 * - 3~6분 소요
 */
export async function startDb(): Promise<void> {
  await axiosInstance.post('/api/v1/dev/db/start');
}

/**
 * DB 상태 확인
 * - available: 사용 가능 (모든 백엔드 API 사용 가능)
 * - unavailable: 사용 불가
 */
export async function getDbStatus(): Promise<DbStatus> {
  const { data } = await axiosInstance.get<DbStatusResponse>('/api/v1/dev/db/status');
  return data.status;
}

/**
 * DB 중지
 * - 개발 작업 마무리할 때 호출
 * - 8~15분 소요
 */
export async function stopDb(): Promise<void> {
  await axiosInstance.post('/api/v1/dev/db/stop');
}
