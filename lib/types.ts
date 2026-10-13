export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  group_name: string | null;
  memo: string | null;
  favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type ActionState = {
  ok: boolean;
  error?: string;
  /** 성공 시 폼 초기화를 위해 증가하는 값 */
  version: number;
};
