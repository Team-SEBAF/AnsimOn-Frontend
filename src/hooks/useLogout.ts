import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { logoutApi } from '@/api/auth/login';
import { useGoogleAuth } from '@/hooks/useGoogle';

export function useLogout() {
  const router = useRouter();
  const loginMethod = useAuthStore((s) => s.loginMethod);
  const logout = useAuthStore((s) => s.logout);
  const { logoutWithGoogle } = useGoogleAuth();

  const handleLogout = async () => {
    if (loginMethod === 'email') {
      await logoutApi();
      logout();
      router.push('/auth/login');
    } else {
      logoutWithGoogle();
    }
  };

  return { handleLogout };
}
