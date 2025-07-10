# README

## 概要

主要なツールの環境構築を行なった Turborepo テンプレートです。すぐに開発に着手できます。

- Next.js, shadcn/ui（全コンポーネント）
- データベース: [Supabase](https://supabase.com/docs/guides/local-development?queryGroups=package-manager&package-manager=pnpm)
- 認証: [better-auth](https://www.better-auth.com/docs/introduction)
- ORM: [Drizzle](https://orm.drizzle.team/docs/get-started/supabase-new)

## インストール

```sh
pnpx create-turbo@latest --example https://github.com/dninomiya/nino-template -m pnpm
```

## 初期設定

1. [package.json](./package.json) のパッケージ名を変更
2. [.env.example](./packages/db/.env.example) と [.env.local.example](./apps/web/.env.local.example) を複製して `.example` なしバージョンを作成し、変数をセットする
3. Supabase のローカルコンテナ名を設定: [config.toml](./tooling/supabase/config.toml)

## 開発

```sh
pnpm dev
```

## アップデート

```sh
# pnpm のアップデート
corepack use pnpm

# next.js のアップデート
pnpm up --recursive typescript@latest
```
