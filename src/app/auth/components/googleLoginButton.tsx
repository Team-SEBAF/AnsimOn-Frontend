import { Button } from '@/components/Button';
import { useGoogleAuth, useGoogleLoginSideEffect } from '@/hooks/useGoogle';
import { Loader2 } from 'lucide-react';

export function GoogleLoginButton() {
  const { loginWithGoogle } = useGoogleAuth();
  const { googleLoading } = useGoogleLoginSideEffect();

  return (
    <Button
      type="button"
      variant="outline"
      color="secondary"
      className="h-14 w-full border-gray-400 font-semibold text-gray-400"
      onClick={loginWithGoogle}
      disabled={googleLoading}
    >
      <div className="flex items-center justify-center gap-2">
        구글 로그인
        {googleLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
    </Button>
  );
}
