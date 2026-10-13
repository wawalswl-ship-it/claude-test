-- 전화번호 관리 테이블
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  group_name  text,
  memo        text,
  favorite    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists contacts_name_idx  on public.contacts (name);
create index if not exists contacts_phone_idx on public.contacts (phone);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

-- RLS 활성화. anon/authenticated 정책을 만들지 않으므로
-- 브라우저에서 직접 접근은 차단되고, 서버(service_role)만 읽고 쓸 수 있습니다.
alter table public.contacts enable row level security;
