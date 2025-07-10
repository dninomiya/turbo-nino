import "server-only";

import { secretSupabase } from "@/secret";

/**
 * 画像をSupabaseストレージにアップロードし、タイムスタンプ付きの公開URLを返却する関数
 * @param file - アップロードする画像ファイル（File または Blob）
 * @param bucket - ストレージバケット名（デフォルト: 'images'）
 * @param path - ファイルパス（オプション、指定しない場合はUUIDを生成）
 * @returns Promise<{ url: string, path: string }> - タイムスタンプ付き公開URLとファイルパス
 */
export async function uploadImage(
  file: File | Blob,
  bucket: string = "images",
  path?: string
): Promise<{ url: string; path: string }> {
  // ファイルの拡張子を取得
  const fileExt =
    file instanceof File && file.name
      ? file.name.split(".").pop()?.toLowerCase()
      : "jpg";

  // パスが指定されていない場合、UUIDを生成
  const fileName = path || `${crypto.randomUUID()}.${fileExt}`;

  // ファイルをSupabaseストレージにアップロード
  const { data, error } = await secretSupabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "300", // 5分の短いキャッシュ
      upsert: false,
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
 * base64文字列から画像をSupabaseストレージにアップロードし、タイムスタンプ付きの公開URLを返却する関数
 * @param base64String - base64エンコードされた画像文字列（data:image/jpeg;base64,... 形式またはbase64のみ）
 * @param bucket - ストレージバケット名（デフォルト: 'images'）
 * @param path - ファイルパス（オプション、指定しない場合はUUIDを生成）
 * @param fileName - ファイル名（オプション、拡張子の推定に使用）
 * @returns Promise<{ url: string, path: string }> - タイムスタンプ付き公開URLとファイルパス
 */
export async function uploadImageFromBase64(
  base64String: string,
  bucket: string = "images",
  path?: string,
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

  // パスが指定されていない場合、UUIDを生成
  const filePath = path || `${crypto.randomUUID()}.${fileExt}`;

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
    return await uploadImage(blob, bucket, filePath);
  } catch (error) {
    throw new Error(
      `base64文字列の変換に失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * 画像を削除する関数
 * @param path - 削除するファイルのパス
 * @param bucket - ストレージバケット名（デフォルト: 'images'）
 * @returns Promise<void>
 */
export async function deleteImage(
  path: string,
  bucket: string = "images"
): Promise<void> {
  const { error } = await secretSupabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`画像の削除に失敗しました: ${error.message}`);
  }
}

/**
 * 既存の画像を新しい画像で置き換える関数（クエリパラメータでキャッシュバスティング）
 * @param file - 新しい画像ファイル（File または Blob）
 * @param existingPath - 既存のファイルパス
 * @param bucket - ストレージバケット名（デフォルト: 'images'）
 * @returns Promise<{ url: string, path: string }> - タイムスタンプ付き公開URLとファイルパス
 */
export async function replaceImage(
  file: File | Blob,
  existingPath: string,
  bucket: string = "images"
): Promise<{ url: string; path: string }> {
  // 既存のファイルを新しいファイルで上書き
  const { data, error } = await secretSupabase.storage
    .from(bucket)
    .update(existingPath, file, {
      cacheControl: "no-cache", // キャッシュを無効化
      upsert: true,
    });

  if (error) {
    throw new Error(`画像の置き換えに失敗しました: ${error.message}`);
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
 * アバター画像専用のアップロード関数（クエリパラメータでキャッシュバスティング）
 * @param file - アップロードする画像ファイル（File または Blob）
 * @param userId - ユーザーID（ファイル名に使用）
 * @param bucket - ストレージバケット名（デフォルト: 'avatars'）
 * @param oldAvatarPath - 削除する古いアバターのパス（オプション）
 * @returns Promise<{ url: string, path: string }> - タイムスタンプ付き公開URLとファイルパス
 */
export async function uploadAvatar(
  file: File | Blob,
  userId: string,
  bucket: string = "avatars",
  oldAvatarPath?: string
): Promise<{ url: string; path: string }> {
  // ファイルの拡張子を取得
  const fileExt =
    file instanceof File && file.name
      ? file.name.split(".").pop()?.toLowerCase()
      : "jpg";

  // 固定ファイル名（ユーザーごとに1つのアバター）
  const fileName = `${userId}.${fileExt}`;

  // 古いアバターを削除（エラーは無視）
  if (oldAvatarPath) {
    try {
      await deleteImage(oldAvatarPath, bucket);
    } catch (error) {
      console.warn("古いアバターの削除に失敗:", error);
    }
  }

  // 新しいアバターをアップロード（上書き）
  const { data, error } = await secretSupabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "no-cache", // キャッシュを無効化
      upsert: true, // 上書きを許可
    });

  if (error) {
    throw new Error(`アバターのアップロードに失敗しました: ${error.message}`);
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
 * base64文字列からアバター画像をアップロードする関数（クエリパラメータでキャッシュバスティング）
 * @param base64String - base64エンコードされた画像文字列
 * @param userId - ユーザーID（ファイル名に使用）
 * @param bucket - ストレージバケット名（デフォルト: 'avatars'）
 * @param oldAvatarPath - 削除する古いアバターのパス（オプション）
 * @returns Promise<{ url: string, path: string }> - タイムスタンプ付き公開URLとファイルパス
 */
export async function uploadAvatarFromBase64(
  base64String: string,
  userId: string,
  bucket: string = "avatars",
  oldAvatarPath?: string
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

  try {
    // base64をBlobに変換
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // アバター専用アップロード関数を使用
    return await uploadAvatar(blob, userId, bucket, oldAvatarPath);
  } catch (error) {
    throw new Error(
      `base64アバターの変換に失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`
    );
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

/*
使用例（全ての関数でクエリパラメータによるキャッシュバスティングを使用）:

// 1. 基本的な画像アップロード（File/Blob）
const result = await uploadImage(imageFile);
console.log('タイムスタンプ付きURL:', result.url); // https://...image.jpg?t=1672531200000
console.log('ファイルパス:', result.path);

// 2. base64文字列からの画像アップロード
const base64String = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...';
const result2 = await uploadImageFromBase64(base64String);
console.log('base64からのタイムスタンプ付きURL:', result2.url);

// 3. base64文字列のみ（data:プレフィックスなし）
const pureBase64 = '/9j/4AAQSkZJRgABAQAAAQABAAD...';
const result3 = await uploadImageFromBase64(pureBase64, 'images', undefined, 'photo.jpg');

// 4. カスタムバケットとパスを指定
const result4 = await uploadImage(
  imageFile, 
  'my-custom-bucket', 
  'profile-pictures/user-123.jpg'
);

// 5. 既存画像の置き換え（即座に反映）
const newResult = await replaceImage(newImageFile, 'existing-file-path.jpg');
console.log('置換後のタイムスタンプ付きURL:', newResult.url);

// 6. アバター画像のアップロード（ユーザーごとに固定ファイル名）
const avatarResult = await uploadAvatar(imageFile, 'user-123', 'avatars');
console.log('アバターのタイムスタンプ付きURL:', avatarResult.url); // user-123.jpg?t=1672531200000

// 7. base64からアバター画像のアップロード
const avatarFromBase64 = await uploadAvatarFromBase64(base64String, 'user-123', 'avatars');

// 8. 画像の削除
await deleteImage('uploaded-file-path.jpg');

// 9. 既存URLにタイムスタンプを後から追加
const cachedUrl = 'https://example.supabase.co/storage/v1/object/public/images/photo.jpg';
const freshUrl = addCacheBustingToUrl(cachedUrl);
console.log('キャッシュバスティング済みURL:', freshUrl); // photo.jpg?t=1672531200000

// 10. Next.js API Route でのbase64使用例
// export async function POST(request: Request) {
//   try {
//     const { base64Image } = await request.json();
//     
//     if (!base64Image) {
//       return NextResponse.json({ error: 'base64画像が見つかりません' }, { status: 400 });
//     }
//     
//     const result = await uploadImageFromBase64(base64Image);
//     return NextResponse.json({ url: result.url, path: result.path });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// 11. フロントエンドでcanvasをbase64に変換してアップロード
// const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
// const base64Data = canvas.toDataURL('image/png');
// const result = await uploadImageFromBase64(base64Data);
// console.log('Canvasからのタイムスタンプ付きURL:', result.url);
*/
