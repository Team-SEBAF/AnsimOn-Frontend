import { useAuthStore } from '@/stores/authStore';

/** 현재 로그인 유저의 complaint_id를 반환 */
export function useComplaintId() {
  return useAuthStore((s) => s.user!.complaint_id);
}
