# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコードを操作する際のガイダンスを提供します。

## プロダクト概要

## 開発コマンド

これは pnpm をパッケージマネージャーとして使用する Turborepo モノレポです。

**必須コマンド:**

- `pnpm dev` - 開発サーバーを起動（Next.js with Turbopack）
- `pnpm build` - 全パッケージとアプリをビルド
- `pnpm lint` - 全パッケージで ESLint を実行
- `pnpm test` - テストを実行（Vitest）
- `pnpm test:watch` - ウォッチモードでテストを実行
- `pnpm format` - Prettier でコードをフォーマット

**Webアプリ固有（apps/web/内）:**

- `pnpm typecheck` - TypeScript 型チェック
- `pnpm lint:fix` - lint エラーを自動修正

**E2Eテスト:**

- Playwright テストは `tooling/playwright-web/` にあります
- turbo の `e2e` タスクで実行

## アーキテクチャ概要

### モノレポ構造

- **apps/web/** - React 19 を使用したメイン Next.js 15 アプリケーション
- **packages/** - 共有パッケージ:
  - `auth` - better-auth を使用した認証
  - `db` - Drizzle ORM を使用したデータベース層
  - `ui` - shadcn/ui コンポーネントライブラリ
  - `utils` - 共有ユーティリティ
  - `supabase-utilities` - Supabase クライアントユーティリティ
  - `transactional` - メールテンプレート
- **tooling/** - 開発ツール（Playwright、Supabase設定）

### 主要技術

- **フレームワーク:** Next.js 15 with App Router and Turbopack
- **UI:** shadcn/ui コンポーネント、Tailwind CSS
- **データベース:** Drizzle ORM with Supabase
- **認証:** better-auth ライブラリ
- **AI:** Vercel AI SDK with OpenAI integration
- **状態管理:** データ取得とグローバル状態に SWR
- **テスト:** ユニットテストに Vitest、E2E に Playwright

### チャットアプリケーションアーキテクチャ

メインアプリケーションは AI 統合を備えたチャットインターフェースです:

- **チャットフロー:** 登録 → アバター選択 → 通常チャット
- **コンポーネント:**
  - `ChatInterface` - 登録フローを含むメインチャットコンポーネント
  - `AvatarSelectionCard` - アバターカスタマイズ
  - `FloatingChatToolbar` - チャット入力ツールバー
- **状態管理:** `hooks/use-chat-logic.ts` のカスタム SWR フック
- **API:** OpenAI 統合による `/api/chat` チャット API ルート

## 開発パターン

### UI コンポーネント

- `packages/ui` の shadcn/ui コンポーネントをカスタマイズなしで使用
- コンポーネントの装飾は最小限に
- 既存のコンポーネントパターンに従う

### 状態管理

- グローバル状態には SWR フックを使用（Context/Provider は使わない）
- グローバル状態のパターン:

```tsx
import useSWRImmutable from 'swr/immutable';

export const useGlobalState = (initialValue: string) => {
  const { data, mutate } = useSWRImmutable('key', null, {
    fallbackData: initialValue,
  });
  return { data, mutate };
};
```

### データ操作

- **取得:** `/app/api/` に API ルートを作成し、`/swr/` に SWR フックを作成
- **更新:** 適切な認証チェックを含む `/actions/` のサーバーアクション
- **データベース:** Drizzle ORM で `@workspace/database` を使用
- **楽観的更新:** SWR の楽観的データパターンを使用

## AIチャット

- Vercel AI SDK OpenAI 統合を使用
- [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) のドキュメントに準拠
- 開発環境では最も安いモデルを使用し、プロダクションでは メジャーなモデルを使用

### ファイル構成

- コンポーネントは `components/`
- カスタムフックは `hooks/`
- サーバーアクションは `actions/`
- API ルートは `app/api/`
- SWR フックは `swr/`
- 型定義は `types/`
- データベーススキーマは `packages/db/schemas/`

## メモリ

- 日本語でのコミュニケーションを優先する
- Conventional Commits形式でコミットメッセージを作成する
