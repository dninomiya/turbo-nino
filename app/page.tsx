"use client";

import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const installCommand =
    "pnpx create-turbo@latest --example https://github.com/dninomiya/nino-template -m pnpm";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <h1 className="text-xl font-bold text-gray-900">Turbonino</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                機能
              </a>
              <a
                href="#setup"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                初期設定
              </a>
              <a
                href="#development"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                開発
              </a>
              <a
                href="https://github.com/dninomiya/nino-template"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              すぐに開発に
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                着手
              </span>
              できる
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              主要なツールの環境構築を行ったTurborepoテンプレートです。
              <br />
              Next.js、Supabase、better-auth、Drizzleが完全に統合済み。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-gray-900 text-white px-8 py-4 rounded-lg font-mono text-sm">
                {installCommand}
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold relative"
              >
                {copied ? "✅ コピーしました！" : "今すぐ始める"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              初期化済みの機能
            </h2>
            <p className="text-gray-600">
              すべて設定済み。すぐに本格的な開発を始められます。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Next.js */}
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-6 rounded-xl border hover:border-gray-300 transition-colors block"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">N</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Next.js</h3>
              <p className="text-gray-600 text-sm">App Router</p>
            </a>

            {/* shadcn/ui */}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors block"
            >
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">UI</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">shadcn/ui</h3>
              <p className="text-gray-600 text-sm">全コンポーネント導入済み</p>
            </a>

            {/* Supabase */}
            <a
              href="https://supabase.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-50 p-6 rounded-xl border border-green-200 hover:border-green-300 transition-colors block"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">S</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Supabase</h3>
              <p className="text-gray-600 text-sm">
                データベース・認証・ストレージ
              </p>
            </a>

            {/* Better Auth */}
            <a
              href="https://www.better-auth.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-50 p-6 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors block"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">🔐</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">better-auth</h3>
              <p className="text-gray-600 text-sm">モダンな認証システム</p>
            </a>

            {/* Drizzle */}
            <a
              href="https://orm.drizzle.team/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-50 p-6 rounded-xl border border-purple-200 hover:border-purple-300 transition-colors block"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">🐉</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Drizzle ORM</h3>
              <p className="text-gray-600 text-sm">TypeScript-first ORM</p>
            </a>

            {/* SWR */}
            <a
              href="https://swr.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-50 p-6 rounded-xl border border-orange-200 hover:border-orange-300 transition-colors block"
            >
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">SWR</h3>
              <p className="text-gray-600 text-sm">
                データフェッチング・キャッシュ
              </p>
            </a>

            {/* Cursor Rules */}
            <a
              href="https://cursor.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-colors block"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">⚙️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cursor Rules</h3>
              <p className="text-gray-600 text-sm">AI開発支援設定済み</p>
            </a>
          </div>
        </div>
      </section>

      {/* Utilities Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              便利ユーティリティ
            </h2>
            <p className="text-gray-600">
              開発で頻出する機能を独自にユーティリティとして含めています
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Supabase Helpers */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Supabaseヘルパー
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 画像アップロード・削除関数</li>
                <li>• base64から画像アップロード対応</li>
              </ul>
            </div>

            {/* Helper Functions */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ヘルパー関数
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 動的な日付フォーマット</li>
                <li>• Base URL取得関数</li>
                <li>• Search Paramsマージ</li>
              </ul>
            </div>

            {/* UI Components */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                UIコンポーネント
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 画像アップロード用クロッパー</li>
                <li>• シンプルで使いやすい設計</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Section */}
      <section id="setup" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                簡単セットアップ
              </h2>
              <p className="text-gray-600">3つのステップで開発環境を構築</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    プロジェクト作成
                  </h3>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    {installCommand}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">環境変数設定</h3>
                  <p className="text-gray-600">
                    .env.example ファイルを複製して環境変数を設定
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">開発開始</h3>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    pnpm dev
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Section */}
      <section
        id="development"
        className="py-20 bg-gradient-to-r from-gray-50 to-slate-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              開発コマンド
            </h2>
            <p className="text-gray-600">よく使用するコマンド一覧</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">
                Next.js開発サーバー
              </h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                pnpm dev
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Supabase起動</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                pnpm start
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">データベース更新</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                pnpm gm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">今すぐ開発を始めよう</h2>
            <p className="text-gray-300 mb-8">
              面倒な設定は全て完了済み。あとはあなたのアイデアを形にするだけです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/dninomiya/nino-template"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-center"
              >
                GitHubで詳細を見る
              </a>
              <a
                href="https://github.com/dninomiya/nino-template#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                ドキュメントを読む
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <a
                href="https://x.com/d151005"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <div className="text-gray-600">
              <p>&copy; 2024 Turbonino. すべての開発者のために.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
