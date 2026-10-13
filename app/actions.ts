"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import type { ActionState } from "@/lib/types";

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parseContact(formData: FormData) {
  const name = str(formData, "name");
  const phoneRaw = str(formData, "phone");
  const email = str(formData, "email");
  const group_name = str(formData, "group_name");
  const memo = str(formData, "memo");

  if (!name) return { error: "이름을 입력하세요." } as const;
  if (name.length > 100) return { error: "이름은 100자 이하여야 합니다." } as const;
  if (!phoneRaw) return { error: "전화번호를 입력하세요." } as const;

  const phone = normalizePhone(phoneRaw);
  if (!isValidPhone(phone)) {
    return { error: "전화번호 형식이 올바르지 않습니다. (숫자 7~15자리)" } as const;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "이메일 형식이 올바르지 않습니다." } as const;
  }

  return {
    data: {
      name,
      phone,
      email: email || null,
      group_name: group_name || null,
      memo: memo || null,
    },
  } as const;
}

export async function createContact(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseContact(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error, version: prev.version };

  const supabase = createServerSupabase();
  const { error } = await supabase.from("contacts").insert(parsed.data);
  if (error) return { ok: false, error: `저장 실패: ${error.message}`, version: prev.version };

  revalidatePath("/");
  return { ok: true, version: prev.version + 1 };
}

export async function updateContact(
  id: string,
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseContact(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error, version: prev.version };

  const supabase = createServerSupabase();
  const { error } = await supabase.from("contacts").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: `수정 실패: ${error.message}`, version: prev.version };

  revalidatePath("/");
  return { ok: true, version: prev.version + 1 };
}

export async function deleteContact(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return { ok: false, error: `삭제 실패: ${error.message}` };

  revalidatePath("/");
  return { ok: true };
}

export async function toggleFavorite(id: string, favorite: boolean) {
  const supabase = createServerSupabase();
  await supabase.from("contacts").update({ favorite }).eq("id", id);
  revalidatePath("/");
}
