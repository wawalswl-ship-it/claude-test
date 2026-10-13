"use client";

import { useActionState, useState, useTransition } from "react";
import { deleteContact, toggleFavorite, updateContact } from "@/app/actions";
import { formatPhone } from "@/lib/phone";
import type { ActionState, Contact } from "@/lib/types";
import ContactFields from "./ContactFields";

const initial: ActionState = { ok: false, version: 0 };

export default function ContactCard({ contact, groups }: { contact: Contact; groups: string[] }) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const [state, action, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const res = await updateContact(contact.id, prev, formData);
      if (res.ok) setEditing(false);
      return res;
    },
    initial
  );

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(formatPhone(contact.phone));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 클립보드 미지원 환경은 무시 */
    }
  }

  function onDelete() {
    if (!confirm(`"${contact.name}" 연락처를 삭제할까요?`)) return;
    setDeleteError(null);
    startTransition(async () => {
      const res = await deleteContact(contact.id);
      if (!res.ok) setDeleteError(res.error ?? "삭제 실패");
    });
  }

  function onToggleFavorite() {
    startTransition(() => toggleFavorite(contact.id, !contact.favorite));
  }

  const initialChar = contact.name.trim().charAt(0).toUpperCase() || "?";

  if (editing) {
    return (
      <form
        action={action}
        className="rounded-2xl border border-zinc-300 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        <ContactFields contact={contact} groups={groups} idPrefix={`edit-${contact.id}`} />
        {state.error && (
          <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            취소
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
    );
  }

  const border = contact.favorite
    ? "border-amber-300 dark:border-amber-700"
    : "border-zinc-200 dark:border-zinc-800";

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-opacity dark:bg-zinc-900 ${border} ${
        busy ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          {initialChar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="truncate font-semibold">{contact.name}</h2>
            {contact.group_name && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {contact.group_name}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <a
              href={`tel:${contact.phone}`}
              className="font-mono tabular-nums text-zinc-800 underline-offset-2 hover:underline dark:text-zinc-200"
            >
              {formatPhone(contact.phone)}
            </a>
            <button
              type="button"
              onClick={copyPhone}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              {copied ? "복사됨" : "복사"}
            </button>
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="truncate text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
              >
                {contact.email}
              </a>
            )}
          </div>

          {contact.memo && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
              {contact.memo}
            </p>
          )}

          {deleteError && (
            <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
              {deleteError}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onToggleFavorite}
            disabled={busy}
            aria-label={contact.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            aria-pressed={contact.favorite}
            className={`rounded-lg p-2 text-lg leading-none ${
              contact.favorite ? "text-amber-500" : "text-zinc-300 hover:text-amber-400 dark:text-zinc-600"
            }`}
          >
            {contact.favorite ? "★" : "☆"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={busy}
            className="rounded-lg px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
