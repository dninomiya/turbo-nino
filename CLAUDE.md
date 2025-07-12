# CLAUDE.md

このファイルは、このリポジトリでコードを作業する際にClaude Code (claude.ai/code) に指針を提供します。

## メモリ

- 日本語でのコミュニケーションを優先する
- Conventional Commits形式でコミットメッセージを作成する

## 開発コマンド

### メインコマンド（プロジェクトルートから実行）
- `pnpm dev` - TurbopackでNext.js開発サーバーを起動
- `pnpm build` - Turboを使用して全パッケージとアプリをビルド
- `pnpm lint` - Turboを使用して全パッケージをリント
- `pnpm test` - 全パッケージでテストを実行
- `pnpm test:watch` - ウォッチモードでテストを実行
- `pnpm format` - TypeScript、TSX、Markdownファイルをフォーマット

### データベース操作（packages/db）
- `pnpm db:gm` - スキーマ生成とマイグレーション（最も一般的）
- `pnpm db:push` - スキーマ変更をデータベースにプッシュ
- `pnpm db:generate` - マイグレーションファイルを生成
- `pnpm db:migrate` - マイグレーションを適用
- `pnpm db:studio` - Drizzle Studioを開く
- `pnpm db:seed` - テストデータでデータベースをシード

### 認証（packages/auth）
- `pnpm generate` - better-authスキーマファイルを生成（認証設定変更後に必要）

### Supabaseローカル開発（tooling/supabase）
- `pnpm start` - ローカルSupabaseコンテナを起動
- `pnpm stop` - ローカルSupabaseコンテナを停止
- `pnpm status` - Supabaseコンテナのステータスを確認
- `pnpm db:studio` - Supabase Studio UIを開く

### Webアプリ固有（apps/web）
- `pnpm typecheck` - TypeScript型チェック
- `pnpm lint:fix` - リントエラーを自動修正

## アーキテクチャ概要

### モノレポ構造
pnpmワークスペースを使用したTurborepoモノレポで、3つの主要なワークスペースカテゴリがあります：
- `apps/*` - アプリケーションコード（現在はNext.js webアプリのみ）
- `packages/*` - 共有パッケージとユーティリティ
- `tooling/*` - 開発ツール（Supabase、Playwright）

### 技術スタック
- **フロントエンド**: Next.js 15 with React 19、shadcn/uiコンポーネント
- **バックエンド**: Next.js APIルートとServer Actions
- **データベース**: Drizzle ORMを使用したSupabase
- **認証**: better-auth
- **スタイリング**: shadcn/ui経由のTailwind CSS
- **状態管理**: データ取得にSWR
- **テスト**: ユニットテストにVitest、E2EにPlaywright

### 主要パッケージアーキテクチャ

**@workspace/db**: Drizzle ORMを使用したデータベース層
- `schemas/`内にすべてのスキーマ定義を含む
- Supabase経由でPostgreSQLを使用
- better-auth設定から認証スキーマが自動生成

**@workspace/auth**: better-authを使用した認証
- 認証設定、ルートハンドラー、セッションユーティリティをエクスポート
- 認証スキーマは`../db/schemas/auth.ts`に生成

**@workspace/ui**: 完全なshadcn/uiコンポーネントライブラリ
- すべてのshadcn/uiコンポーネントがプリインストール
- クロッパー機能付きの`input-image`などのカスタムコンポーネント

**@workspace/utils**: 共有ユーティリティ
- `constants.ts` - アプリ全体の定数（APP_NAMEはここで更新）
- 相対表示付きの日付フォーマット
- 画像アップロード/削除のSupabaseヘルパー
- 検索パラメータユーティリティ
- Vercelデプロイメント用のベースURLヘルパー

**@workspace/supabase-utilities**: Supabaseクライアントとヘルパー
- base64をサポートする画像アップロード/削除機能
- ストレージユーティリティ

### データフローパターン

**データ取得**: 
1. `/app/api/`にAPIルートを作成
2. 適切な認証チェックを追加
3. `/swr/`ディレクトリにSWRフックを作成
4. `@workspace/utils/fetcher`からfetcherを使用

**データ変更**:
1. `/actions/`にServer Actionを作成（"use server"付き）
2. 認証チェックを含める
3. 楽観的更新でSWRのmutateを使用
4. `populateCache: false`と`rollbackOnError: true`を設定

### .cursor/rulesからの開発ルール

**UI開発**:
- 可能な限り`packages/ui`のshadcn/uiコンポーネントを使用
- shadcn/uiコンポーネントの直接カスタマイズを避ける
- UIコンポーネントの装飾は最小限に

**データベース操作**:
- 常に`@workspace/db`からdbをインポート
- すべてのデータベースインタラクションでDrizzle ORMを使用
- すべてのルートとアクションで適切な権限チェックを実装

**ファイル組織**:
- APIルート: `/app/api/`
- Server Actions: `/actions/`
- SWRフック: `/swr/`
- コンポーネント: `/components/`

### 設定ファイル
- `packages/utils/constants.ts`でアプリ名を更新
- 環境設定: `.env.example`ファイルをコピーして設定
- Supabaseコンテナ名: `tooling/supabase/config.toml`

### パッケージマネージャー
- ワークスペースプロトコル（`workspace:*`）でpnpmを使用
- Node.js >= 20が必要
- packageManagerフィールドで特定のpnpmバージョンがロック