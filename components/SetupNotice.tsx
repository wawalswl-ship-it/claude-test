const envExample = `NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...`;

export default function SetupNotice() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold">설정이 필요합니다</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Supabase 환경변수가 설정되지 않았습니다. 아래 순서대로 진행하세요.
      </p>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm">
        <li>
          Supabase 프로젝트를 만들고 <b>SQL Editor</b>에서{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">supabase/schema.sql</code>{" "}
          내용을 실행합니다.
        </li>
        <li>
          프로젝트 <b>Settings → API</b>에서 <b>Project URL</b>과 <b>service_role</b> 키를 복사합니다.
        </li>
        <li>
          로컬에서는 <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">.env.local</code>에,
          Vercel에서는 <b>Project → Settings → Environment Variables</b>에 아래 두 값을 넣습니다.
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-100">{envExample}</pre>
        </li>
        <li>개발 서버를 재시작하거나 Vercel에서 다시 배포합니다.</li>
      </ol>
    </main>
  );
}
