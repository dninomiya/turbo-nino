import { describe, it, expect } from "vitest";
import {
  updateSearchParams,
  createUrlWithParams,
  getRouterParams,
  removeSearchParams,
  searchParamsToObject,
} from "./search-params";

describe("updateSearchParams", () => {
  it("マージ: 既存のパラメータに新しい値を追加", () => {
    const params = updateSearchParams(
      { baz: "new" },
      { currentUrl: "https://example.com/page?foo=1&bar=2" }
    );
    expect(params.toString()).toBe("foo=1&bar=2&baz=new");
  });

  it("差し替え: replaceオプションで全て置き換え", () => {
    const params = updateSearchParams(
      { baz: "new" },
      { replace: true, currentUrl: "https://example.com/page?foo=1&bar=2" }
    );
    expect(params.toString()).toBe("baz=new");
  });

  it("削除: removeKeysで指定キーを削除", () => {
    const params = updateSearchParams(
      { baz: "new" },
      {
        removeKeys: ["foo"],
        currentUrl: "https://example.com/page?foo=1&bar=2",
      }
    );
    expect(params.toString()).toBe("bar=2&baz=new");
  });

  it("null/undefined値は削除される", () => {
    const params = updateSearchParams(
      { foo: null, bar: undefined, baz: "" },
      { currentUrl: "https://example.com/page?existing=1" }
    );
    expect(params.toString()).toBe("existing=1");
  });

  it("ブラウザ環境では現在のURLを使用", () => {
    // window.locationのモック
    Object.defineProperty(window, "location", {
      value: { search: "?foo=1&bar=2" },
      writable: true,
    });

    const params = updateSearchParams({ baz: "new" });
    expect(params.toString()).toBe("foo=1&bar=2&baz=new");
  });
});

describe("createUrlWithParams", () => {
  it("完全なURLを生成", () => {
    const url = createUrlWithParams(
      { foo: "bar", baz: 123 },
      { currentUrl: "https://example.com/page" }
    );
    expect(url).toBe("https://example.com/page?foo=bar&baz=123");
  });

  it("パラメータなしの場合はベースURLのみ", () => {
    const url = createUrlWithParams(
      {},
      { currentUrl: "https://example.com/page" }
    );
    expect(url).toBe("https://example.com/page");
  });

  it("既存のパラメータを含むURLに追加", () => {
    const url = createUrlWithParams(
      { foo: "bar" },
      { currentUrl: "https://example.com/page?existing=1" }
    );
    expect(url).toBe("https://example.com/page?existing=1&foo=bar");
  });
});

describe("getRouterParams", () => {
  it("pathname と search を取得", () => {
    const result = getRouterParams(
      { foo: "bar", page: 2 },
      { currentUrl: "https://example.com/current-page" }
    );
    expect(result).toEqual({
      pathname: "/current-page",
      search: "?foo=bar&page=2",
    });
  });

  it("パラメータなしの場合", () => {
    const result = getRouterParams(
      {},
      { currentUrl: "https://example.com/current-page" }
    );
    expect(result).toEqual({
      pathname: "/current-page",
      search: "",
    });
  });
});

describe("removeSearchParams", () => {
  it("指定されたキーを削除", () => {
    const params = removeSearchParams(
      ["foo", "baz"],
      "https://example.com/page?foo=1&bar=2&baz=3"
    );
    expect(params.toString()).toBe("bar=2");
  });

  it("存在しないキーを指定しても問題なし", () => {
    const params = removeSearchParams(
      ["nonexistent"],
      "https://example.com/page?foo=1&bar=2"
    );
    expect(params.toString()).toBe("foo=1&bar=2");
  });
});

describe("searchParamsToObject", () => {
  it("URLSearchParamsをオブジェクトに変換", () => {
    const params = new URLSearchParams("foo=1&bar=hello&baz=true");
    const obj = searchParamsToObject(params);
    expect(obj).toEqual({
      foo: "1",
      bar: "hello",
      baz: "true",
    });
  });

  it("空のパラメータの場合", () => {
    const params = new URLSearchParams();
    const obj = searchParamsToObject(params);
    expect(obj).toEqual({});
  });

  it("同じキーの複数値は最後の値を使用", () => {
    const params = new URLSearchParams("foo=1&foo=2&bar=hello");
    const obj = searchParamsToObject(params);
    expect(obj).toEqual({
      foo: "2",
      bar: "hello",
    });
  });

  it("文字列からの変換", () => {
    const obj = searchParamsToObject("foo=1&bar=hello");
    expect(obj).toEqual({
      foo: "1",
      bar: "hello",
    });
  });
});
