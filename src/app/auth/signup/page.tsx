'use client';

import { SignupForm } from '../components/SignupForm';

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1>Signup Page</h1>
      <div className="mt-4 w-full max-w-md">
        <SignupForm />
      </div>
    </main>
  );
}
