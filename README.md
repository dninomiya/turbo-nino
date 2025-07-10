# README

## 概要

主要なツールの環境構築を行なった Turborepo テンプレートです。すぐに開発に着手できます。

### 初期化済みの機能

- Next.js, shadcn/ui（全コンポーネント）
- データベース: [Supabase](https://supabase.com/docs/guides/local-development?queryGroups=package-manager&package-manager=pnpm)
- 認証: [better-auth](https://www.better-auth.com/docs/introduction)
- ORM: [Drizzle](https://orm.drizzle.team/docs/get-started/supabase-new)

### 便利ユーティリティ

開発で頻出する機能は独自にユーティリティとして含めています

- Supabase ヘルパー関数
  - 画像アップロード、削除関数: base64 から画像アップロードが可能
- ヘルパー関数
  - 動的な日付フォーマット: 直近であれば相対表示（3分前など）し、そうでなければ日付を表示
  - Vercel の独自ドメインを加味した Base URL 取得関数
  - Search Params をマージできる関数
- UI
  - 画像アップロード用のシンプルクロッパー

## インストール

```sh
pnpx create-turbo@latest --example https://github.com/dninomiya/nino-template -m pnpm
```

## 初期設定

1. [package.json](./package.json) のパッケージ名を変更
2. [.env.example](./packages/db/.env.example) と [.env.local.example](./apps/web/.env.local.example) を複製して `.example` なしバージョンを作成し、変数をセットする
3. Supabase のローカルコンテナ名を設定: [config.toml](./tooling/supabase/config.toml)

## 開発

### Next.js ローカルサーバー起動

ルートディレクトリで実行

```sh
pnpm dev
```

### Supabase ローカル環境起動

tools/supabase で実行。

```sh
pnpm stop # 別プロジェクトのローカル Supabaseを起動している場合先に停止が必要
pnpm start
```

### 認証関係のスキーマファイル生成

packages/auth で実行。better-auth の機能を編集した場合スキーマの作成が必要です。

```sh
pnpm generate
```

### データベースのマイグレーション

packages/db で実行

```sh
pnpm gm # generate & migrate を一括で実行

pnpm push # push のみ
pnpm generate
pnpm migrate
```

### テスト

ルートで実行

```sh
pnpm test
```

## アップデート

定期的に実行することをお勧めします。

```sh
# pnpm のアップデート
corepack use pnpm

# 全パッケージの next.js を一括でアップデート
pnpm up --recursive typescript@latest
```
