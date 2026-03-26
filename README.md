# 1. ETF Tracker
매매일지 작성을 돕기 위한 실시간 ETF 시세 조회 및 자산 가치 확인 도구입니다.
실시간 배포 주소: https://etf-tracker-lovat.vercel.app/

🚀 빠른 시작 (Quick Start)로컬 환경에서 프로젝트를 실행하려면 아래 명령어를 복사하여 터미널에 입력하세요.
Bash
# 1. 저장소 복제
git clone https://github.com/your-username/etf-tracker.git

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

🔑 환경변수 설정 가이드프로젝트 루트에 .env.local 파일을 생성하고 아래 환경 변수를 설정해야 합니다.
(기본적으로 .env.example 파일을 참고하세요.)

코드 스니펫# Supabase 설정 (DB 및 인증 사용 시)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
📂 폴더 구조 (Folder Structure)관심사의 분리와 확장성을 고려한 구조입니다.
src/app/: Next.js 14 App Router 기반의 페이지 레이아웃 및 API Route (/api/quote).
src/components/: 재사용 가능한 UI 컴포넌트 (shadcn/ui 기반).
common/: ErrorBoundary, Loading 등 공통 컴포넌트.
etf/: ETF 카드, 조회 폼 등 도메인 특화 컴포넌트.
src/lib/: yahoo-finance2, supabase 클라이언트 및 Zustand 스토어 설정.
src/hooks/: 데이터 페칭 및 시세 업데이트 로직을 분리한 커스텀 훅.
src/types/: Strict Mode를 준수하는 TypeScript 
인터페이스 정의.✨ 주요 기능 목록
실시간 시세 조회: yahoo-finance2 라이브러리를 통해 최신 마켓 데이터를 파싱합니다.
CORS 보안 프록시: 클라이언트 사이드 에러를 방지하기 위해 Next.js API Route를 서버 프록시로 활용합니다.
안정성 보장: 모든 컴포넌트를 ErrorBoundary로 감싸 런타임 에러 시에도 서비스 중단을 최소화합니다.
반응형 UI: Tailwind CSS와 shadcn/ui를 활용하여 모바일과 데스크톱 모두 최적화된 경험을 제공합니다.
🔌 API 엔드포인트방식엔드포인트설명파라미터GET/api/quote특정 종목의 현재가 정보를 반환합니다.
symbol (예: SPY)응답 데이터 구조:JSON{
  "symbol": "SPY",
  "price": 512.34,
  "currency": "USD",
  "change": 1.25,
  "changePercent": 0.24,
  "updatedAt": "2026-03-26T..."
}
🚢 배포 방법본 프로젝트는 Vercel에 최적화되어 있습니다.GitHub 레포지토리를 Vercel 대시보드와 연결합니다.
Settings > Environment Variables에서 위의 환경 변수를 등록합니다.main 브랜치에 푸시하면 자동으로 빌드 및 배포가 진행됩니다.
🛠 알려진 이슈 & TODO이슈: 새로고침 시 추가된 종목 리스트가 초기화되는 현상 (P0 단계 제약사항).
TODO:[ ] localStorage를 활용한 조회 목록 유지 기능 추가.[ ] 
Supabase DB 연동을 통한 사용자별 관심 종목 저장 기능.[ ] 
종목별 전일 대비 등락률에 따른 조건부 컬러링 (Red/Blue) 강화.

📄 라이선스 & 기여방법
License: MIT License
Contribution: 프로젝트 개선을 위한 Issue 제보 및 Pull Request는 언제나 환영합니다. 
코드 작성 시 TypeScript Strict 타입을 준수해 주세요.
