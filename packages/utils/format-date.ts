import {
  format,
  formatDistanceToNow,
  differenceInDays,
  isThisYear,
} from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 動的な日付フォーマット関数
 *
 * @param date - フォーマットする日付
 * @param threshold - 相対表示の閾値（日数、デフォルト1日）
 * @returns フォーマットされた日付文字列
 *
 * ルール:
 * - 閾値未満: "N秒前", "N分前", "N時間前" など相対的表示
 * - 年内: "X月X日"
 * - 1年以上前: "XXXX年X月X日"
 *
 * @example
 * ```typescript
 * import { formatDate } from '@workspace/utils/format-date';
 *
 * const now = new Date();
 * const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
 * const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
 * const lastYear = new Date(now.getFullYear() - 1, 5, 15);
 *
 * console.log(formatDate(fiveMinutesAgo)); // "5分前"
 * console.log(formatDate(threeDaysAgo));   // "12月15日"
 * console.log(formatDate(lastYear));       // "2023年6月15日"
 * ```
 */
export function formatDate(
  date: Date | string | number,
  threshold: number = 1
): string {
  const targetDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const daysDifference = differenceInDays(now, targetDate);

  // 閾値未満の場合は相対的な表示
  if (daysDifference < threshold) {
    return formatDistanceToNow(targetDate, {
      addSuffix: true,
      locale: ja,
    });
  }

  // 年内の場合は「X月X日」
  if (isThisYear(targetDate)) {
    return format(targetDate, "M月d日", { locale: ja });
  }

  // 1年以上前の場合は「XXXX年X月X日」
  return format(targetDate, "yyyy年M月d日", { locale: ja });
}

/**
 * より詳細な制御が可能な日付フォーマット関数
 *
 * @param date - フォーマットする日付
 * @param options - フォーマットオプション
 * @returns フォーマットされた日付文字列
 */
export function formatDateWithOptions(
  date: Date | string | number,
  options?: {
    /** 相対表示の閾値（日数） */
    relativeThreshold?: number;
    /** 時間を含むかどうか */
    includeTime?: boolean;
    /** カスタムフォーマット */
    customFormat?: {
      thisYear?: string;
      otherYear?: string;
    };
  }
): string {
  const {
    relativeThreshold = 1,
    includeTime = false,
    customFormat,
  } = options || {};

  const targetDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const daysDifference = differenceInDays(now, targetDate);

  // 閾値未満の場合は相対的な表示
  if (daysDifference < relativeThreshold) {
    return formatDistanceToNow(targetDate, {
      addSuffix: true,
      locale: ja,
    });
  }

  // カスタムフォーマットが指定されている場合
  if (customFormat) {
    if (isThisYear(targetDate) && customFormat.thisYear) {
      return format(targetDate, customFormat.thisYear, { locale: ja });
    }
    if (!isThisYear(targetDate) && customFormat.otherYear) {
      return format(targetDate, customFormat.otherYear, { locale: ja });
    }
  }

  // デフォルトのフォーマット
  const timeFormat = includeTime ? " HH:mm" : "";

  if (isThisYear(targetDate)) {
    return format(targetDate, `M月d日${timeFormat}`, { locale: ja });
  }

  return format(targetDate, `yyyy年M月d日${timeFormat}`, { locale: ja });
}
