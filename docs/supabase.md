# Supabase セットアップメモ

Week1 で最低限の「作成 → 編集 → 共有」フローを実装するための Supabase 初期設定メモです。`sql` タブで実行する DDL と RLS サンプルをまとめています。

## 1. プロジェクト作成

1. Dashboard から新規プロジェクトを作成（Region: Tokyo 推奨）。  
2. Password / anon key / service role key を安全な場所に保管。  
3. `Database > Backups` で自動バックアップを有効化。  
4. Edge Functions を使うので `CLI` の初期化 (`supabase init`) も事前にやっておく。

## 2. テーブル定義（DDL）

```sql
create table public.users (
  id uuid primary key default auth.uid(),
  name text,
  email text unique not null,
  created_at timestamptz default now()
);

create table public.itineraries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pref_code text,
  start_date date not null,
  end_date date not null,
  owner_user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.day_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid references public.itineraries(id) on delete cascade,
  time timestamptz,
  category text,
  title text not null,
  memo text,
  cost integer,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid references public.itineraries(id) on delete cascade,
  transport integer default 0,
  food integer default 0,
  hotel integer default 0,
  other integer default 0,
  memo text,
  created_at timestamptz default now()
);

create table public.shares (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null,
  expires_at timestamptz not null,
  owner_user_id uuid references public.users(id) on delete cascade,
  rev_token text unique not null,
  created_at timestamptz default now()
);
```

## 3. RLS ポリシー

```sql
alter table public.users enable row level security;
alter table public.itineraries enable row level security;
alter table public.day_items enable row level security;
alter table public.expenses enable row level security;
alter table public.shares enable row level security;

create policy "Users can see themselves" on public.users
  for select using (auth.uid() = id);

create policy "Owner read/write itineraries" on public.itineraries
  using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

create policy "Owner read/write day items" on public.day_items
  using (
    auth.uid() = (
      select owner_user_id from public.itineraries where id = itinerary_id
    )
  ) with check (true);

create policy "Owner read/write expenses" on public.expenses
  using (
    auth.uid() = (
      select owner_user_id from public.itineraries where id = itinerary_id
    )
  ) with check (true);

create policy "Owner read/write shares" on public.shares
  using (auth.uid() = owner_user_id) with check (true);
```

共有リンクは Edge Functions 経由で生成し、`expires_at` をチェックして期限切れなら 410 を返すようにする。匿名アクセスは禁止なので Service Role key は Edge Functions のみで利用。

## 4. cron / TTL

```sql
select cron.schedule(
  'cleanup_short_links',
  '0 3 * * *',
  $$
    delete from public.shares
    where expires_at < now();
  $$
);
```

## 5. ローカル接続情報

- Supabase CLI で `supabase start` を実行すると `localhost:54322` で Postgres が立ち上がる。  
- `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres` を `.env.local` に入れておくと drizzle 等にも使い回せる。  
- ただし本番データは Edge Functions 経由でのみ書き換える。
