const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const command = process.argv[2];

async function startDb() {
  console.log('🚀 DB 시작 요청 중...');
  const res = await fetch(`${BASE_URL}/api/v1/dev/db/start`, { method: 'POST' });
  if (res.ok) {
    console.log('✅ DB 시작 요청 완료! 3~6분 후 사용 가능');
  } else {
    console.error('❌ DB 시작 실패:', res.status);
  }
}

async function getStatus() {
  console.log('🔍 DB 상태 확인 중...');
  const res = await fetch(`${BASE_URL}/api/v1/dev/db/status`);
  const data = await res.json();
  if (data.status === 'available') {
    console.log('✅ DB 사용 가능!');
  } else {
    console.log('⏳ DB 아직 준비 중...');
  }
}

async function stopDb() {
  console.log('🛑 DB 중지 요청 중...');
  const res = await fetch(`${BASE_URL}/api/v1/dev/db/stop`, { method: 'POST' });
  if (res.ok) {
    console.log('✅ DB 중지 요청 완료!');
  } else {
    console.error('❌ DB 중지 실패:', res.status);
  }
}

switch (command) {
  case 'start':
    startDb();
    break;
  case 'status':
    getStatus();
    break;
  case 'stop':
    stopDb();
    break;
  default:
    console.log(`
사용법:
  pnpm db:start   - DB 시작 (3~6분 소요)
  pnpm db:status  - DB 상태 확인
  pnpm db:stop    - DB 중지
    `);
}
