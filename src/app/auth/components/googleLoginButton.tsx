import { Button } from '@/components/Button';
import { useGoogleAuth, useGoogleLoginSideEffect } from '@/hooks/useGoogle';
import GoogleIcon from '@/assets/icons/google.svg';

export function GoogleLoginButton() {
  const { loginWithGoogle } = useGoogleAuth();
  const { googleLoading } = useGoogleLoginSideEffect();

  return (
    <Button
      type="button"
      className="typo-btn-2 bg-bg-1! h-10 w-full text-[#1f1f1f]!"
      onClick={loginWithGoogle}
      loading={googleLoading}
      rounded="full"
    >
      <span className="flex items-center gap-2.5">
        <GoogleIcon className="h-4.5 w-4.5" aria-hidden="true" />
        Sign in with Google
      </span>
    </Button>
  );
}
