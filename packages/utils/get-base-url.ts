/**
 * ベース URL取得する
 *
 * - 末尾にスラッシュはつかない
 * - Vercel ホスティング、カスタムドメインに対応
 *
 * @param options.useCommitURL - Vercel のコミットURLを使用するかどうか
 *
 * @example
 * 'http://localhost:3000'
 * 'https://my-site.vercel.app' // useCommitURL: true
 * 'https://my-site-git-improve-about-page.vercel.app' // useCommitURL: false
 * 'https://my-site.com'
 */
export const getBaseURL = (options?: { useCommitURL?: boolean }) => {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
  const url = isProd
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : options?.useCommitURL
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;

  return url
    ? `https://${url}`
    : `http://localhost:${process.env.PORT || 3000}`;
};
