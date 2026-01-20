import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/schemas/auth/signup.schema';

export async function POST(req: NextRequest) {
  try {
    // 1. body 파싱
    const body = await req.json();

    // 2. zod 검증
    const validated = signupSchema.parse(body);

    // 3. 백엔드 회원가입 API 호출
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/users/signup/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
    });

    const data = await res.json();

    // 4. 백엔드 에러 전달
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 5. 성공 응답
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('[API /auth/signup] error:', err);

    return NextResponse.json(
      {
        message: 'Invalid request',
        error: err instanceof Error ? err.message : err,
      },
      { status: 400 },
    );
  }
}
