-- Canonical backend schema for Aqbobek.
-- This schema matches the FastAPI domain models and the current frontend use-cases.

create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('student', 'teacher', 'parent', 'admin')),
  avatar_url text,
  class_name text,
  grade_level integer check (grade_level between 1 and 12),
  linked_student_ids uuid[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.grades (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.users(id) on delete cascade,
  teacher_id uuid not null references public.users(id) on delete restrict,
  subject text not null,
  score numeric(6, 2) not null check (score >= 0),
  max_score numeric(6, 2) not null check (max_score > 0),
  quarter integer not null check (quarter between 1 and 4),
  comment text,
  date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null check (category in ('academic', 'sports', 'arts', 'leadership', 'community', 'other')),
  points integer not null default 0 check (points >= 0),
  awarded_by uuid not null references public.users(id) on delete restrict,
  date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null check (category in ('announcement', 'exam', 'holiday', 'sports', 'cultural', 'meeting')),
  start_date date not null,
  end_date date,
  location text,
  is_featured boolean not null default false,
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_grades_student_id on public.grades(student_id);
create index if not exists idx_grades_teacher_id on public.grades(teacher_id);
create index if not exists idx_grades_date on public.grades(date desc);
create index if not exists idx_achievements_student_id on public.achievements(student_id);
create index if not exists idx_achievements_date on public.achievements(date desc);
create index if not exists idx_events_start_date on public.events(start_date asc);
create index if not exists idx_events_featured on public.events(is_featured);

alter table public.users enable row level security;
alter table public.grades enable row level security;
alter table public.achievements enable row level security;
alter table public.events enable row level security;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_users_touch_updated_at on public.users;
create trigger trg_users_touch_updated_at
before update on public.users
for each row execute function public.touch_updated_at();

drop trigger if exists trg_grades_touch_updated_at on public.grades;
create trigger trg_grades_touch_updated_at
before update on public.grades
for each row execute function public.touch_updated_at();

drop trigger if exists trg_achievements_touch_updated_at on public.achievements;
create trigger trg_achievements_touch_updated_at
before update on public.achievements
for each row execute function public.touch_updated_at();

drop trigger if exists trg_events_touch_updated_at on public.events;
create trigger trg_events_touch_updated_at
before update on public.events
for each row execute function public.touch_updated_at();

drop policy if exists "users_select_self_or_admin" on public.users;
create policy "users_select_self_or_admin" on public.users
for select using (auth.uid() = id or public.current_user_role() = 'admin');

drop policy if exists "users_update_self_or_admin" on public.users;
create policy "users_update_self_or_admin" on public.users
for update using (auth.uid() = id or public.current_user_role() = 'admin');

drop policy if exists "grades_select_by_role" on public.grades;
create policy "grades_select_by_role" on public.grades
for select using (
  auth.uid() = student_id
  or teacher_id = auth.uid()
  or public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'parent'
    and student_id = any(
      coalesce((select linked_student_ids from public.users where id = auth.uid()), '{}')
    )
  )
);

drop policy if exists "grades_insert_teacher_admin" on public.grades;
create policy "grades_insert_teacher_admin" on public.grades
for insert with check (public.current_user_role() in ('teacher', 'admin'));

drop policy if exists "grades_update_teacher_admin" on public.grades;
create policy "grades_update_teacher_admin" on public.grades
for update using (teacher_id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists "achievements_select_by_role" on public.achievements;
create policy "achievements_select_by_role" on public.achievements
for select using (
  auth.uid() = student_id
  or public.current_user_role() in ('teacher', 'admin')
  or (
    public.current_user_role() = 'parent'
    and student_id = any(
      coalesce((select linked_student_ids from public.users where id = auth.uid()), '{}')
    )
  )
);

drop policy if exists "achievements_insert_teacher_admin" on public.achievements;
create policy "achievements_insert_teacher_admin" on public.achievements
for insert with check (public.current_user_role() in ('teacher', 'admin'));

drop policy if exists "events_select_authenticated" on public.events;
create policy "events_select_authenticated" on public.events
for select using (auth.uid() is not null);

drop policy if exists "events_insert_admin" on public.events;
create policy "events_insert_admin" on public.events
for insert with check (public.current_user_role() = 'admin');

drop policy if exists "events_update_admin" on public.events;
create policy "events_update_admin" on public.events
for update using (public.current_user_role() = 'admin');
