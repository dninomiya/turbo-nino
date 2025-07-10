"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  type SearchParamsInput,
  type UpdateSearchParamsOptions,
} from "./search-params";

/**
 * useUpdateSearchParams フックのオプション
 */
export interface UseUpdateSearchParamsOptions
  extends Omit<UpdateSearchParamsOptions, "currentUrl"> {
  /** scrollを無効にするかどうか（デフォルト: true） */
  scroll?: boolean;
  /**
   * URLの更新方法
   * - 'replace': window.history.replaceState (デフォルト)
   * - 'push': window.history.pushState
   * - 'router': router.push
   */
  type?: "replace" | "push" | "router";
}

/**
 * useUpdateSearchParams フックの戻り値
 */
export interface UseUpdateSearchParamsReturn {
  /** SearchParamsを更新する関数 */
  updateParams: (
    params: SearchParamsInput,
    options?: UseUpdateSearchParamsOptions
  ) => void;
  /** 現在のSearchParams */
  searchParams: URLSearchParams;
  /** 現在のパス名 */
  pathname: string;
  /** 特定のキーを削除する関数 */
  removeParams: (
    keys: string[],
    options?: Pick<UseUpdateSearchParamsOptions, "scroll">
  ) => void;
  /** 全てのパラメータをクリアする関数 */
  clearParams: (options?: Pick<UseUpdateSearchParamsOptions, "scroll">) => void;
}

/**
 * Next.js App Router用のSearchParams更新フック
 *
 * @param defaultOptions - デフォルトオプション
 * @returns SearchParams操作用の関数とデータ
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useUpdateSearchParams } from '@workspace/utils/use-update-search-params';
 *
 * function MyComponent() {
 *   const { updateParams, searchParams, removeParams } = useUpdateSearchParams();
 *
 *   const handlePageChange = (page: number) => {
 *     // shallow navigation（デフォルト）
 *     updateParams({ page });
 *   };
 *
 *   const handleFilterChange = (filter: string) => {
 *     // router.pushを使用
 *     updateParams({ filter }, { shallow: false });
 *   };
 *
 *   const handleRemoveFilter = () => {
 *     removeParams(['filter']);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => handlePageChange(2)}>Page 2</button>
 *       <button onClick={() => handleFilterChange('active')}>Filter Active</button>
 *       <button onClick={handleRemoveFilter}>Remove Filter</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUpdateSearchParams(
  defaultOptions: UseUpdateSearchParamsOptions = {}
): UseUpdateSearchParamsReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateParams = useCallback(
    (params: SearchParamsInput, options: UseUpdateSearchParamsOptions = {}) => {
      const { scroll = true, type = "replace" } = options;

      // 既存のsearchParams生成ロジックを利用
      const currentParams = new URLSearchParams(searchParams.toString());
      // 削除キーを反映
      const removeKeys = options.removeKeys ?? [];
      removeKeys.forEach((key) => currentParams.delete(key));
      // paramsをセット
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, String(value));
        }
      });
      const newSearch = currentParams.toString();
      const newUrl = pathname + (newSearch ? `?${newSearch}` : "");

      if (type === "replace") {
        // window.history.replaceState
        const url = new URL(newUrl, window.location.origin);
        window.history.replaceState({ ...window.history.state }, "", url.href);
      } else if (type === "push") {
        // window.history.pushState
        const url = new URL(newUrl, window.location.origin);
        window.history.pushState({ ...window.history.state }, "", url.href);
      } else if (type === "router") {
        // router.push
        router.push(newUrl, { scroll });
      }
    },
    [pathname, router, searchParams]
  );

  const removeParams = useCallback(
    (
      keys: string[],
      options: Pick<UseUpdateSearchParamsOptions, "scroll"> = {}
    ) => {
      updateParams({}, { ...options, removeKeys: keys });
    },
    [updateParams]
  );

  const clearParams = useCallback(
    (options: Pick<UseUpdateSearchParamsOptions, "scroll"> = {}) => {
      updateParams({}, { ...options, removeKeys: undefined });
    },
    [updateParams]
  );

  return {
    updateParams,
    searchParams,
    pathname,
    removeParams,
    clearParams,
  };
}

/**
 * SearchParamsの値を取得する便利フック
 *
 * @param key - 取得するパラメータのキー
 * @param defaultValue - デフォルト値
 * @returns パラメータの値
 *
 * @example
 * ```typescript
 * const page = useSearchParam('page', '1');
 * const filter = useSearchParam('filter');
 * ```
 */
export function useSearchParam(
  key: string,
  defaultValue?: string
): string | null {
  const searchParams = useSearchParams();
  const value = searchParams.get(key);
  return value ?? defaultValue ?? null;
}

/**
 * SearchParamsの値を数値として取得する便利フック
 *
 * @param key - 取得するパラメータのキー
 * @param defaultValue - デフォルト値
 * @returns パラメータの数値またはNaN
 *
 * @example
 * ```typescript
 * const page = useSearchParamNumber('page', 1);
 * const limit = useSearchParamNumber('limit', 10);
 * ```
 */
export function useSearchParamNumber(
  key: string,
  defaultValue?: number
): number {
  const value = useSearchParam(key);
  if (value === null) {
    return defaultValue ?? NaN;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? (defaultValue ?? NaN) : parsed;
}

/**
 * SearchParamsの値をboolean として取得する便利フック
 *
 * @param key - 取得するパラメータのキー
 * @param defaultValue - デフォルト値
 * @returns パラメータのboolean値
 *
 * @example
 * ```typescript
 * const isActive = useSearchParamBoolean('active', false);
 * const debug = useSearchParamBoolean('debug');
 * ```
 */
export function useSearchParamBoolean(
  key: string,
  defaultValue?: boolean
): boolean {
  const value = useSearchParam(key);
  if (value === null) {
    return defaultValue ?? false;
  }
  return value === "true" || value === "1";
}
