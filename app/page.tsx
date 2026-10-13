import { Suspense } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Contact } from "@/lib/types";
import ContactForm from "@/components/ContactForm";
import ContactCard from "@/components/ContactCard";
import SearchBar from "@/components/SearchBar";
import GroupFilter from "@/components/GroupFilter";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; group?: string }>;

/** PostgREST or() 필터에서 문제가 되는 문자 제거 */
function sanitize(value: string) {
  return value.replace(/[,()"\%]/g, "").trim();
}

async function loadData(q: string, group: string) {
  const supabase = createServerSupabase();

  let query = supabase
    .from("contacts")
    .select("*")
    .order("favorite", { ascending: false })
    .order("name", { ascending: true });

  if (group === "__none__") {
    query = query.is("group_name", null);
  } else if (group) {
    query = query.eq("group_name", group);
  }

  const term = sanitize(q);
  if (term) {
    const digits = term.replace(/\D/g, "");
    const parts = [
      `name.ilike.%${term}%`,
      `email.ilike.%${term}%`,
      `group_name.ilike.%${term}%`,
      `memo.ilike.%${term}%`,
    ];
    if (digits) parts.push(`phone.ilike.%${digits}%`);
    query = query.or(parts.join(","));
  }

  const [{ data: contacts, error }, { data: groupRows }] = await Promise.all([
    query,
    supabase.from("contacts").select("group_name").not("group_name", "is", null),
  ]);

  if (error) throw new Error(error.message);

  const groups = Array.from(
    new Set((groupRows ?? []).map((r) => r.group_name as string))
  ).sort((a, b) => a.localeCompare(b, "ko"));

  return { contacts: (contacts ?? []) as Contact[], groups };
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", group = "" } = await searchParams;

  const configured =
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!configured) return <SetupNotice />;

  let contacts: Contact[] = [];
  let groups: string[] = [];
  let loadError: string | null = null;

  try {
    ({ contacts, groups } = await loadData(q, group));
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  const subtitle = loadError
    ? "연결 오류"
    : `${contacts.length}개의 연락처` + (q ? ` · "${q}" 검색 결과` : "");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">전화번호부</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </header>

      <section className="mb-6">
        <ContactForm groups={groups} />
      </section>

      <section className="mb-4 space-y-3">
        <Suspense fallback={null}>
          <SearchBar />
          <GroupFilter groups={groups} />
        </Suspense>
      </section>

      {loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <p className="font-semibold">데이터를 불러오지 못했습니다.</p>
          <p className="mt-1 break-all font-mono text-xs">{loadError}</p>
          <p className="mt-2">
            Supabase에 contacts 테이블이 있는지, 환경변수가 올바른지 확인하세요.
            (supabase/schema.sql 참고)
          </p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          {q || group ? "조건에 맞는 연락처가 없습니다." : "아직 연락처가 없습니다. 위에서 추가해 보세요."}
        </div>
      ) : (
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li key={c.id}>
              <ContactCard contact={c} groups={groups} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
