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


# 画像保存機能 実装ガイド

## 📦 必要なパッケージのインストール

```bash
npm install html2canvas
# または
pnpm add html2canvas
# または
yarn add html2canvas
```

## 📁 追加ファイル一覧

### 型定義
- `src/types/imageExport.ts` - 画像エクスポート関連の型定義

### Atoms
- `src/components/atoms/SaveImageButton.tsx` - 画像保存ボタン

### Organisms
- `src/components/organisms/SaveImageModal.tsx` - 画像保存設定モーダル

### Hooks
- `src/hooks/useImageExport.ts` - 画像エクスポート処理のカスタムフック

### 更新ファイル
- `src/components/molecules/PrintControlBar.tsx` - 画像保存ボタンを追加
- `src/components/templates/TrifoldPrintLayout.tsx` - 画像保存機能を統合

## 🎨 機能概要

### 保存オプション
1. **両面（表面・裏面）**: 2枚の画像として保存
2. **表面のみ**: 表紙とスケジュール部分のみ
3. **裏面のみ**: メモと予算サマリー部分のみ

### 画像品質
- **解像度**: Retina対応（2倍スケール）
- **フォーマット**: PNG
- **圧縮**: 品質92%で自動最適化
- **ファイルサイズ**: 通常 500KB - 2MB程度

### ファイル名
- **デフォルト**: `旅のしおり_[タイトル]_[日付].png`
- **カスタマイズ**: ユーザーが任意で変更可能
- **自動サフィックス**: 
  - 両面の場合: `_表面.png`, `_裏面.png`
  - 片面の場合: `_表面.png` または `_裏面.png`

## 🚀 使い方

### 基本的な使用フロー

1. 印刷ページ (`/print/[id]`) で「画像で保存」ボタンをクリック
2. 保存設定モーダルが表示される
3. 保存範囲を選択（両面 / 表面 / 裏面）
4. ファイル名を確認・編集
5. 「保存する」ボタンで画像をダウンロード

### コード例

```typescript
import { useImageExport } from '@/hooks/useImageExport';

const MyComponent = () => {
  const { exportPrintPages } = useImageExport();

  const handleSave = async () => {
    await exportPrintPages('both', '旅のしおり_京都旅行_2025-12-01');
  };

  return <button onClick={handleSave}>保存</button>;
};
```

## 🔧 技術詳細

### html2canvas の動作

```typescript
const canvas = await html2canvas(element, {
  scale: 2,           // Retina対応（高解像度）
  useCORS: true,      // 外部画像の読み込み許可
  logging: false,     // コンソールログ無効化
  backgroundColor: '#ffffff', // 背景色
});
```

### 画像圧縮

```typescript
canvas.toBlob(
  (blob) => resolve(blob),
  'image/png',
  0.92  // 品質: 0.0 - 1.0（0.92で高品質かつ適度に圧縮）
);
```

### ダウンロード実装

```typescript
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.download = `${fileName}.png`;
link.href = url;
link.click();
URL.revokeObjectURL(url); // メモリ解放
```

## 📱 レスポンシブ対応

- デスクトップ: 通常のボタン表示
- モバイル: ボタンサイズ最適化
- タブレット: 問題なく動作

## ⚠️ 注意事項

### ブラウザ互換性
- Chrome: ✅ 完全対応
- Safari: ✅ 完全対応
- Firefox: ✅ 完全対応
- Edge: ✅ 完全対応

### 制限事項
1. **外部画像**: CORS設定が必要（現在の実装では外部画像なし）
2. **カスタムフォント**: Web Fontが読み込まれていることを確認
3. **処理時間**: 大きなコンテンツの場合、数秒かかることがある
4. **連続ダウンロード**: 両面保存時、300ms の遅延を挿入（ブラウザ制限対策）

### パフォーマンス

```typescript
// 最適化のポイント
const exportOptions = {
  scale: 2,      // 3倍だとファイルサイズが大きくなりすぎる
  quality: 0.92, // 0.8-0.95が推奨（品質とサイズのバランス）
};
```

## 🎯 ユーザー体験の工夫

### ローディング状態
- 処理中はボタンを無効化
- スピナーアイコンで進行状況を表示
- 「処理中...」のテキスト表示

### エラーハンドリング
- 失敗時はアラートで通知
- コンソールにエラーログ出力
- モーダルは開いたまま（再試行可能）

### ファイル名プレビュー
- 選択したオプションに応じてファイル名を動的表示
- 例: `旅のしおり_京都旅行_2025-12-01_表面.png`

## 🔄 カスタマイズ方法

### 画質の調整

```typescript
// src/hooks/useImageExport.ts
const exportOptions = {
  scale: 3,      // より高解像度に
  quality: 0.95, // より高品質に（ファイルサイズ増加）
};
```

### ファイル形式の変更

```typescript
// PNGからJPEGに変更
canvas.toBlob(
  (blob) => resolve(blob),
  'image/jpeg',  // PNG → JPEG
  0.92
);

// ファイル名も変更
link.download = `${fileName}.jpg`;
```

### 保存範囲のカスタマイズ

```typescript
// 特定の要素のみを保存
const customElement = document.getElementById('custom-area');
await exportElementAsImage(customElement, 'カスタム画像');
```

## 🐛 トラブルシューティング

### 画像が保存されない
- ブラウザのダウンロード設定を確認
- ポップアップブロックを無効化
- コンソールのエラーログを確認

### 画像が切れる
- `overflow: hidden` を確認
- 要素のサイズを明示的に設定
- `scale` を下げてみる

### ファイルサイズが大きい
- `quality` を下げる（0.85程度）
- `scale` を下げる（1.5倍）
- JPEG形式を検討

### フォントが正しく表示されない
- Google Fonts等が完全に読み込まれているか確認
- `@font-face` の設定を確認

## 📊 期待される効果

### ユーザーメリット
- スマホで気軽に旅のしおりを確認
- SNSで簡単にシェア可能
- オフラインでも閲覧可能
- 印刷不要で環境に優しい

### 技術的メリット
- 既存の印刷ビューを再利用
- 追加のデザイン作業不要
- 高品質な出力
- クロスブラウザ対応

## 🚀 今後の拡張案

- [ ] 画像サイズの選択機能（SNS用、印刷用など）
- [ ] 透かし（ウォーターマーク）の追加
- [ ] 複数形式のエクスポート（PNG, JPEG, WebP）
- [ ] 画像編集機能（テキスト追加、フィルターなど）
- [ ] クラウドへの直接アップロード
- [ ] 画像の一括ダウンロード（ZIP形式）