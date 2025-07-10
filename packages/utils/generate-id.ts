import { nanoid } from "nanoid";

/**
 * nanoid を使用してランダムなIDを生成する
 * @param length - 生成するIDの長さ（デフォルト: 10）
 * @returns ランダムなID
 */
export const generateId = (length = 10) => nanoid(length);
