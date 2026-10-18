-- Ejecuta esto en Supabase > SQL Editor
create table if not exists public.guiones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  modo text not null check (modo in ('crear', 'arreglar')),
  entrada jsonb not null,
  guion jsonb not null
);

create index if not exists guiones_created_at_idx on public.guiones (created_at desc);

-- Solo el servidor (service role) accede a la tabla.
alter table public.guiones enable row level security;
