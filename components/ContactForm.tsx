"use client";

import { useActionState, useState } from "react";
import { createContact } from "@/app/actions";
import type { ActionState } from "@/lib/types";
import ContactFields from "./ContactFields";

const initial: ActionState = { ok: false, version: 0 };

export default function ContactForm({ groups }: { groups: string[] }) {
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [state, action, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const res = await createContact(prev, formData);
      if (res.ok) {
        setFlash(true);
        setTimeout(() => setFlash(false), 2000);
      }
      return res;
    },
    initial
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold">새 연락처 추가</span>
        <span className="flex items-center gap-3 text-sm text-zinc-500">
          {flash && <span className="text-emerald-600 dark:text-emerald-400">저장되었습니다</span>}
          <span aria-hidden className={`inline-block transition-transform ${open ? "rotate-45" : ""}`}>
            +
          </span>
        </span>
      </button>

      {open && (
        <form
          key={state.version}
          action={action}
          className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800"
        >
          <ContactFields groups={groups} idPrefix="new" />
          {state.error && (
            <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              닫기
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {pending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
