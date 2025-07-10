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

  it("null/undefinedでキーを削除", () => {
    const params = updateSearchParams(
      { foo: null, bar: undefined },
      { currentUrl: "https://example.com/page?foo=1&bar=2" }
    );
    expect(params.toString()).toBe("");
  });
});

describe("createUrlWithParams", () => {
  it("URLを生成（マージ）", () => {
    const url = createUrlWithParams(
      { baz: "new" },
      { currentUrl: "https://example.com/page?foo=1&bar=2" }
    );
    expect(url).toBe("https://example.com/page?foo=1&bar=2&baz=new");
  });
  it("URLを生成（差し替え）", () => {
    const url = createUrlWithParams(
      { baz: "new" },
      { replace: true, currentUrl: "https://example.com/page?foo=1&bar=2" }
    );
    expect(url).toBe("https://example.com/page?baz=new");
  });
});

describe("getRouterParams", () => {
  it("pathnameとsearchを返す", () => {
    const result = getRouterParams(
      { baz: "new" },
      { currentUrl: "https://example.com/page?foo=1&bar=2" }
    );
    expect(result).toEqual({
      pathname: "/page",
      search: "?foo=1&bar=2&baz=new",
    });
  });
});

describe("removeSearchParams", () => {
  it("指定キーを削除", () => {
    const params = removeSearchParams(
      ["foo"],
      "https://example.com/page?foo=1&bar=2"
    );
    expect(params.toString()).toBe("bar=2");
  });
});

describe("searchParamsToObject", () => {
  it("URLSearchParamsからオブジェクトへ変換", () => {
    const params = new URLSearchParams("foo=1&bar=2");
    expect(searchParamsToObject(params)).toEqual({ foo: "1", bar: "2" });
  });
  it("検索文字列からオブジェクトへ変換", () => {
    expect(searchParamsToObject("foo=1&bar=2")).toEqual({ foo: "1", bar: "2" });
  });
});
