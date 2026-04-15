const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const command = process.argv[2];

async function startSse() {
  console.log('🚀 SSE 서버 시작 요청 중...');
  const res = await fetch(`${BASE_URL}/api/v1/server_cost/sse/start`, { method: 'POST' });
  if (res.ok) {
    console.log('✅ SSE 서버 시작 요청 완료! 약 1분 후 사용 가능');
  } else {
    console.error('❌ SSE 서버 시작 실패:', res.status);
  }
}

async function getStatus() {
  console.log('🔍 SSE 서버 상태 확인 중...');
  const res = await fetch(`${BASE_URL}/api/v1/server_cost/sse/status`);
  const data = await res.json();
  if (data.status === 'available') {
    console.log('✅ SSE 서버 사용 가능!');
  } else {
    console.log('⏳ SSE 서버 아직 준비 중...');
  }
}

async function stopSse() {
  console.log('🛑 SSE 서버 중지 요청 중...');
  const res = await fetch(`${BASE_URL}/api/v1/server_cost/sse/stop`, { method: 'POST' });
  if (res.ok) {
    console.log('✅ SSE 서버 중지 요청 완료! 약 10초 후 중지');
  } else {
    console.error('❌ SSE 서버 중지 실패:', res.status);
  }
}

switch (command) {
  case 'start':
    startSse();
    break;
  case 'status':
    getStatus();
    break;
  case 'stop':
    stopSse();
    break;
  default:
    console.log(`
사용법:
  pnpm sse:start   - SSE 서버 시작 (약 1분 소요)
  pnpm sse:status  - SSE 서버 상태 확인
  pnpm sse:stop    - SSE 서버 중지 (약 10초 소요)

🚨 실시간 진행률 API 테스트할 때만 실행할 것 (비용 발생)
    `);
}
