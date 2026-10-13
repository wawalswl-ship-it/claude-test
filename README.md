# 전화번호부

Next.js(App Router) + Supabase 로 만든 전화번호 관리 웹사이트입니다. Vercel 배포를 전제로 구성되어 있습니다.

## 기능

- 연락처 추가 / 수정 / 삭제
- 이름·전화번호·이메일·그룹·메모 검색 (전화번호는 하이픈 유무와 관계없이 검색)
- 그룹별 필터, 즐겨찾기(상단 고정)
- 전화번호 클릭 시 바로 전화(`tel:`), 한 번에 복사

## 1. Supabase 설정

1. https://supabase.com 에서 새 프로젝트를 만듭니다.
2. 좌측 **SQL Editor** 에서 `supabase/schema.sql` 파일 내용을 붙여 넣고 실행합니다.
3. **Project Settings → API** 에서 아래 두 값을 확인합니다.
   - `Project URL`
   - `service_role` secret 키

> 이 앱은 서버(Server Actions)에서만 Supabase 에 접근하며 `service_role` 키를 사용합니다.
> 테이블에 RLS 가 켜져 있고 anon 정책이 없으므로 브라우저에서 DB 에 직접 접근할 수 없습니다.
> 단, **사이트 URL 을 아는 사람은 누구나 연락처를 편집할 수 있습니다.** 공개 배포 시 Supabase Auth 또는 Vercel 의 Password Protection 을 추가하세요.

## 2. 로컬 실행

```bash
cp .env.example .env.local   # 값 채우기
npm install
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 3. Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
2. https://vercel.com/new 에서 저장소를 Import 합니다. (Framework: Next.js 자동 인식)
3. **Environment Variables** 에 다음을 추가합니다.

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role 키 |

4. **Deploy** 를 누릅니다.

또는 CLI:

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel --prod
```

## 구조

```
app/
  page.tsx            목록 + 검색 + 필터 (서버 컴포넌트)
  actions.ts          추가/수정/삭제/즐겨찾기 Server Actions
components/
  ContactForm.tsx     새 연락처 추가 폼
  ContactCard.tsx     연락처 카드 (인라인 수정, 삭제, 복사)
  ContactFields.tsx   추가/수정 공용 입력 필드
  SearchBar.tsx       검색창 (URL ?q= 동기화)
  GroupFilter.tsx     그룹 필터 칩
  SetupNotice.tsx     환경변수 미설정 시 안내 화면
lib/
  supabase/server.ts  서버 전용 Supabase 클라이언트
  phone.ts            전화번호 정규화/포맷
  types.ts
supabase/
  schema.sql          테이블 + 트리거 + RLS
```
