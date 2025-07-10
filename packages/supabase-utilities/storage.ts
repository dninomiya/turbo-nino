import "server-only";

import { secretSupabase } from "@/secret";

/**
 * 画像をSupabaseストレージにアップロードし（新規・上書き両対応）、タイムスタンプ付きの公開URLを返却する関数
 * @param file - アップロードする画像ファイル（File または Blob）
 * @param bucket - ストレージバケット名（必須）
 * @param path - ファイルパス（必須）
 * @returns Promise<{ url: string, path: string }> - タイムスタンプ付き公開URLとファイルパス
 */
export async function uploadImage(
  file: File | Blob,
  bucket: string,
  path: string
): Promise<{ url: string; path: string }> {
  // ファイルの拡張子を取得
  const fileExt =
    file instanceof File && file.name
      ? file.name.split(".").pop()?.toLowerCase()
      : "jpg";

  // パスが必須
  if (!path) {
    throw new Error("ファイルパス（path）は必須です");
  }

  // ファイルをSupabaseストレージにアップロード（上書きも許可）
  const { data, error } = await secretSupabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "no-cache", // キャッシュを無効化
      upsert: true, // 上書きを許可
    });

  if (error) {
    throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
  }

  // 公開URLを取得してタイムスタンプを追加
  const { data: publicUrlData } = secretSupabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  const timestamp = Date.now();
  const urlWithTimestamp = `${publicUrlData.publicUrl}?t=${timestamp}`;

  return {
    url: urlWithTimestamp,
    path: data.path,
  };
}

/**
 * base64文字列から画像をSupabaseストレージにアップロードし（新規・上書き両対応）、タイムスタンプ付きの公開URLを返却する関数
 * @param base64String - base64エンコードされた画像文字列（data:image/jpeg;base64,... 形式またはbase64のみ）
 * @param bucket - ストレージバケット名（必須）
 * @param path - ファイルパス（必須）
 * @param fileName - ファイル名（オプション、拡張子の推定に使用）
 * @returns Promise<{ url: string, path: string }> - タイムスタンプ付き公開URLとファイルパス
 */
export async function uploadImageFromBase64(
  base64String: string,
  bucket: string,
  path: string,
  fileName?: string
): Promise<{ url: string; path: string }> {
  // base64文字列からMIMEタイプとデータを分離
  let mimeType = "image/jpeg"; // デフォルト
  let base64Data = base64String;

  if (base64String.includes("data:")) {
    const parts = base64String.split(",");
    if (parts.length >= 2) {
      const header = parts[0];
      const data = parts[1];
      if (header && data) {
        base64Data = data;
        const mimeMatch = header.match(/data:([^;]+)/);
        if (mimeMatch && mimeMatch[1]) {
          mimeType = mimeMatch[1];
        }
      }
    }
  }

  // MIMEタイプから拡張子を推定
  const getExtensionFromMimeType = (mime: string): string => {
    switch (mime) {
      case "image/jpeg":
      case "image/jpg":
        return "jpg";
      case "image/png":
        return "png";
      case "image/gif":
        return "gif";
      case "image/webp":
        return "webp";
      case "image/svg+xml":
        return "svg";
      default:
        return "jpg";
    }
  };

  // ファイル名から拡張子を取得、なければMIMEタイプから推定
  let fileExt = "jpg";
  if (fileName && fileName.includes(".")) {
    fileExt = fileName.split(".").pop()?.toLowerCase() || "jpg";
  } else {
    fileExt = getExtensionFromMimeType(mimeType);
  }

  // パスが必須
  if (!path) {
    throw new Error("ファイルパス（path）は必須です");
  }

  try {
    // base64をBlobに変換
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // 変換されたBlobを使って既存のuploadImage関数を呼び出し
    return await uploadImage(blob, bucket, path);
  } catch (error) {
    throw new Error(
      `base64文字列の変換に失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * 画像を削除する関数
 * @param path - 削除するファイルのパス（必須）
 * @param bucket - ストレージバケット名（必須）
 * @returns Promise<void>
 */
export async function deleteImage(path: string, bucket: string): Promise<void> {
  const { error } = await secretSupabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`画像の削除に失敗しました: ${error.message}`);
  }
}

/**
 * 既存の公開URLにタイムスタンプを追加してキャッシュバスティングする関数
 * @param publicUrl - 既存の公開URL
 * @returns string - タイムスタンプ付きURL
 */
export function addCacheBustingToUrl(publicUrl: string): string {
  const timestamp = Date.now();
  const separator = publicUrl.includes("?") ? "&" : "?";
  return `${publicUrl}${separator}t=${timestamp}`;
}
