import type { Contact } from "@/lib/types";
import { formatPhone } from "@/lib/phone";

const input =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-400 dark:focus:ring-zinc-800";
const label = "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

/** 추가/수정 폼이 공유하는 입력 필드 */
export default function ContactFields({
  contact,
  groups,
  idPrefix,
}: {
  contact?: Contact;
  groups: string[];
  idPrefix: string;
}) {
  const listId = `${idPrefix}-groups`;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-name`} className={label}>
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          required
          maxLength={100}
          defaultValue={contact?.name ?? ""}
          placeholder="홍길동"
          className={`mt-1 ${input}`}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-phone`} className={label}>
          전화번호 <span className="text-red-500">*</span>
        </label>
        <input
          id={`${idPrefix}-phone`}
          name="phone"
          required
          type="tel"
          inputMode="tel"
          defaultValue={contact ? formatPhone(contact.phone) : ""}
          placeholder="010-1234-5678"
          className={`mt-1 ${input}`}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-email`} className={label}>
          이메일
        </label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          defaultValue={contact?.email ?? ""}
          placeholder="name@example.com"
          className={`mt-1 ${input}`}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-group`} className={label}>
          그룹
        </label>
        <input
          id={`${idPrefix}-group`}
          name="group_name"
          list={listId}
          maxLength={50}
          defaultValue={contact?.group_name ?? ""}
          placeholder="가족, 회사, 친구 ..."
          className={`mt-1 ${input}`}
          autoComplete="off"
        />
        <datalist id={listId}>
          {groups.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-memo`} className={label}>
          메모
        </label>
        <textarea
          id={`${idPrefix}-memo`}
          name="memo"
          rows={2}
          maxLength={500}
          defaultValue={contact?.memo ?? ""}
          placeholder="추가 정보"
          className={`mt-1 ${input} resize-y`}
        />
      </div>
    </div>
  );
}
