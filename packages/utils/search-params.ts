/**
 * SearchParams更新のオプション
 */
export interface UpdateSearchParamsOptions {
  /** マージではなく差し替えするかどうか */
  replace?: boolean;
  /** 削除するキーの配列 */
  removeKeys?: string[];
  /** 現在のURL（ブラウザ環境以外で使用） */
  currentUrl?: string;
}

/**
 * SearchParamsを更新するための値の型
 */
export type SearchParamsValue = string | number | boolean | null | undefined;

/**
 * SearchParamsを更新するためのパラメータ
 */
export type SearchParamsInput = Record<string, SearchParamsValue>;

/**
 * SearchParamsを更新する関数
 *
 * @param params - 追加・更新するパラメータのオブジェクト
 * @param options - 更新オプション
 * @returns 更新されたURLSearchParams
 *
 * @example
 * ```typescript
 * // 現在のURL: /page?foo=1&bar=2
 *
 * // マージモード（デフォルト）
 * const merged = updateSearchParams({ baz: 'new' });
 * // 結果: foo=1&bar=2&baz=new
 *
 * // 差し替えモード
 * const replaced = updateSearchParams({ baz: 'new' }, { replace: true });
 * // 結果: baz=new
 *
 * // 削除と追加を同時に
 * const updated = updateSearchParams(
 *   { newParam: 'value' },
 *   { removeKeys: ['foo'] }
 * );
 * // 結果: bar=2&newParam=value
 * ```
 */
export function updateSearchParams(
  params: SearchParamsInput,
  options: UpdateSearchParamsOptions = {}
): URLSearchParams {
  const { replace = false, removeKeys = [], currentUrl } = options;

  // 現在のSearchParamsを取得
  let currentParams: URLSearchParams;

  if (currentUrl) {
    // URLが直接指定された場合
    currentParams = new URLSearchParams(new URL(currentUrl).search);
  } else if (typeof window !== "undefined") {
    // ブラウザ環境の場合
    currentParams = new URLSearchParams(window.location.search);
  } else {
    // サーバー環境などの場合は空から開始
    currentParams = new URLSearchParams();
  }

  // 新しいURLSearchParamsを作成
  const newParams = replace
    ? new URLSearchParams()
    : new URLSearchParams(currentParams);

  // 指定されたキーを削除
  removeKeys.forEach((key) => {
    newParams.delete(key);
  });

  // 新しいパラメータを追加・更新
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      // null、undefined、または空文字列の場合は削除
      newParams.delete(key);
    } else {
      // 値を文字列に変換して設定
      newParams.set(key, String(value));
    }
  });

  return newParams;
}

/**
 * SearchParamsを更新してURLを生成する関数
 *
 * @param params - 追加・更新するパラメータのオブジェクト
 * @param options - 更新オプション
 * @returns 更新されたURL文字列
 *
 * @example
 * ```typescript
 * // 現在のURL: /page?foo=1&bar=2
 *
 * const newUrl = createUrlWithParams({ baz: 'new' });
 * // 結果: "/page?foo=1&bar=2&baz=new"
 *
 * const replacedUrl = createUrlWithParams(
 *   { baz: 'new' },
 *   { replace: true }
 * );
 * // 結果: "/page?baz=new"
 * ```
 */
export function createUrlWithParams(
  params: SearchParamsInput,
  options: UpdateSearchParamsOptions = {}
): string {
  const { currentUrl } = options;

  // ベースURLを取得
  let baseUrl: string;
  let pathname: string;

  if (currentUrl) {
    const url = new URL(currentUrl);
    baseUrl = url.origin;
    pathname = url.pathname;
  } else if (typeof window !== "undefined") {
    baseUrl = window.location.origin;
    pathname = window.location.pathname;
  } else {
    // サーバー環境の場合はパスのみ
    baseUrl = "";
    pathname = "/";
  }

  const newParams = updateSearchParams(params, options);
  const searchString = newParams.toString();

  if (baseUrl) {
    return `${baseUrl}${pathname}${searchString ? `?${searchString}` : ""}`;
  } else {
    return `${pathname}${searchString ? `?${searchString}` : ""}`;
  }
}

/**
 * Next.js useRouter や React Router navigate用のヘルパー関数
 *
 * @param params - 追加・更新するパラメータのオブジェクト
 * @param options - 更新オプション
 * @returns パスとサーチパラメータのオブジェクト
 *
 * @example
 * ```typescript
 * import { useRouter } from 'next/router';
 *
 * const router = useRouter();
 * const { pathname, search } = getRouterParams({ page: 2 });
 *
 * router.push({ pathname, search });
 * ```
 */
export function getRouterParams(
  params: SearchParamsInput,
  options: UpdateSearchParamsOptions = {}
): { pathname: string; search: string } {
  const { currentUrl } = options;

  let pathname: string;

  if (currentUrl) {
    pathname = new URL(currentUrl).pathname;
  } else if (typeof window !== "undefined") {
    pathname = window.location.pathname;
  } else {
    pathname = "/";
  }

  const newParams = updateSearchParams(params, options);
  const search = newParams.toString();

  return {
    pathname,
    search: search ? `?${search}` : "",
  };
}

/**
 * URLSearchParamsから特定のキーを削除する関数
 *
 * @param keys - 削除するキーの配列
 * @param currentUrl - 現在のURL（オプション）
 * @returns 更新されたURLSearchParams
 */
export function removeSearchParams(
  keys: string[],
  currentUrl?: string
): URLSearchParams {
  return updateSearchParams({}, { removeKeys: keys, currentUrl });
}

/**
 * URLSearchParamsをオブジェクトに変換する関数
 *
 * @param searchParams - URLSearchParamsまたは検索文字列
 * @returns パラメータのオブジェクト
 */
export function searchParamsToObject(
  searchParams: URLSearchParams | string
): Record<string, string> {
  const params =
    typeof searchParams === "string"
      ? new URLSearchParams(searchParams)
      : searchParams;

  const result: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}
