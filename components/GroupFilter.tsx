"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function GroupFilter({ groups }: { groups: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("group") ?? "";

  if (groups.length === 0) return null;

  function select(group: string) {
    const sp = new URLSearchParams(params.toString());
    if (group) sp.set("group", group);
    else sp.delete("group");
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const base = "rounded-full border px-3 py-1 text-xs font-medium transition-colors";
  const on =
    "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900";
  const off =
    "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => select("")} className={`${base} ${current === "" ? on : off}`}>
        전체
      </button>
      {groups.map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => select(g)}
          className={`${base} ${current === g ? on : off}`}
        >
          {g}
        </button>
      ))}
      <button
        type="button"
        onClick={() => select("__none__")}
        className={`${base} ${current === "__none__" ? on : off}`}
      >
        그룹 없음
      </button>
    </div>
  );
}
