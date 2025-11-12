# TripBook (旅行しおりアプリ)

複数人旅行の計画を、URL・画像・印刷（三つ折り）で並行共有できるWebアプリです。幹事が行程を素早く整理し、同行者がスマホ / PC / 紙のどれでも迷わず閲覧できる状態を目指します。

## 🎯 目的とゴール

- 作成 → 編集 → 共有 → 印刷までの最小フロー（MVP）を動かす  
- 旅行ごとのURL共有、短縮リンク、画像保存を提供  
- ログイン後はマイページ、地図ビュー、カレンダー連携などへ拡張できる構造を維持

## ⚙️ 技術スタック（要約）

| 区分 | 技術 / ツール | 補足 |
| --- | --- | --- |
| フロント | Next.js (App Router) + TypeScript | Atomic Design構成、Vercel配備 |
| UI | Chakra UI + Framer Motion | レスポンシブ・アニメーション |
| 状態/データ | TanStack Query, React Hook Form, Zod | キャッシュ・バリデーション |
| BaaS | Supabase (Postgres, Auth, Storage, Edge Functions) | RLS徹底、短縮リンク生成 |
| ローカル保存 | Dexie (IndexedDB) | 未ログイン時の下書き保存 |
| 日付/地図/出力 | Luxon, react-simple-maps, html-to-image | JST⇄UTC 変換、地図色分け、印刷 |
| DnD | dnd-kit | タイムライン並び替え |
| テスト | Vitest, Testing Library, MSW, Playwright | Unit〜E2E |
| CI/CD | GitHub Actions + Vercel + Supabase | lint / typecheck / test / deploy |

## 🧰 セットアップ

1. **必須ツール**：Node.js 20.x、npm 10.x（推奨：pnpm 9.x 以上）  
2. **依存インストール**：`pnpm install`  
3. **環境変数**：`cp .env.local.example .env.local` などで作成し、下記を設定  
4. **開発サーバー**：`pnpm dev` で http://localhost:3000  
5. **Supabase**：新規プロジェクトを作成し、Postgresを初期化。Edge Functions からのみ Service Role を使用します。

## 🔐 環境変数

| 変数 | 説明 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key（RLS有効） |
| `NEXT_PUBLIC_SITE_URL` | アプリの公開URL。OGPや短縮リンクで参照 |

## 📁 ディレクトリ構成（初期案）

```text
src/
  app/
    (csr)/edit/...
    (ssr)/share/[id]/...
    mypage/
    map/
  components/
    atoms/
    molecules/
    organisms/
  hooks/
  lib/
  types/
  styles/
  tests/
public/
```

## 🔧 開発ルール

- **フロー**：Git Flow を採用。`main` は常にデプロイ可能、`develop` が日常開発ライン。新機能は `feature/<issue>-短い説明`、不具合は `fix/...`、雑務は `chore/...`。作業前に `develop` を `git fetch && git checkout develop && git pull` で最新化し、`git checkout -b feature/...` でブランチを切る。作業中も `git pull origin develop` で追従してからコミットすると履歴がきれいに保てる。  
- **Issue / タスク管理**：新しい作業は必ず Issue またはチケットを作成してから開始し、PR タイトルは `[#123] 機能名` のように紐づける。背景・完了条件をチケット内に明記。  
- **命名規則**：ファイルは `kebab-case`（例：`trip-card.tsx`）、コンポーネント/クラスは `PascalCase`、変数・関数は `camelCase`。Supabase テーブルは `snake_case`。  
- **コミットメッセージ**：日本語で簡潔に。「feat: 旅程カードを追加」のように用途が伝わればOK（英語ルールは不要）。  
- **レビュー運用**：1 機能 = 1 PR。自分で差分を読み、背景・テスト結果を PR 説明に書く。  
- **Lint / Format**：`pnpm lint` を必ず通してから PR。エラーが出たらその場で修正。  
- **テスト**：ユニットは `pnpm vitest run`、E2E は `pnpm playwright test`。UI 変更はスクリーンショット添付。重い場合はチームと合意し、スキップ理由を PR に明記。  
- **セキュリティ**：Supabase RLS を常に有効にし、Edge Functions では Zod で全入力を検証。Service Role key はサーバー側のみで扱う。

## ⚙️ CI / 自動チェック

- GitHub Actions で `pnpm lint`, `pnpm test`, `pnpm playwright test` を pull request ごとに実行する。  
- main / develop への push で Vercel Preview を自動発行し、Supabase Edge Functions のデプロイも連動させる。  
- 失敗した場合は修正コミットを追加し、CI が緑になったのを確認してからレビュー依頼。

## 🧱 Atomic Design 運用

- **Atoms**：ボタン、ラベル、色付きタグなど単機能コンポーネント。Props はスタイルとアクセシビリティに必要なものだけ。  
- **Molecules**：Atoms を 2〜3 個ほど組み合わせた UI（例：アイコン付きボタン、タイトル+説明+CTA）。状態は親から受け取る。  
- **Organisms**：フォーム、タイムラインカード、ヘッダーなど意味のあるブロック。内部で複数の Molecules を利用し、API 連携や内部状態を持てる。  
- **Templates / Pages**：`app/` の route コンポーネントで組み合わせる。ページ固有のロジックやデータ取得はここで行い、Organism へ流す。  
- **分岐基準**：コンポーネント内の JSX が「読みづらい or 再利用したい」と感じたら Molecule に切り出し、画面またぎで再利用するものは Organism 化。props が増えすぎる場合はコンテキスト / hooks へ退避。  
- **スタイル**：基本は Chakra UI の props で完結させ、複雑なレスポンシブ制御のみ `styles/` の theme 拡張で賄う。

## 🗺️ レンダリング方針（参考）

| 画面 | 方式 | 理由 |
| --- | --- | --- |
| 編集画面 | CSR | 入力や並び替えの反応速度重視 |
| 共有ビュー | SSR | OGP / 印刷レイアウトの安定化 |
| マイページ / 地図 | SSG（ISR可） | 認証後一覧の高速化 |

## 📅 6週間ロードマップ（概要）

| フェーズ | 期間 | 内容 |
| --- | --- | --- |
| Week 1-2 | MVP構築 | 行程作成〜共有の最小フロー |
| Week 3-4 | 機能拡張 | マイページ、印刷、地図、カレンダー連携 |
| Week 5-6 | 品質保証 | テスト、パフォーマンス、ドキュメント整備 |

このREADMEをベースに「環境整備 → README作成 → Week1実装」まで自走できる状態にしておきます。追加のドキュメント化が必要になったら追記していく方針です。
