import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * Định dạng tiền tệ: 45.980.000 ₫
 * Dấu chấm ngăn hàng nghìn, không có phần thập phân
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 ₫";
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} ₫`;
}

/**
 * Định dạng thời gian: dd/MM/yyyy HH:mm
 * Luôn theo giờ Việt Nam (UTC+7)
 */
export function formatDateTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined
): string {
  if (!date) return "-";
  return dayjs(date).tz(VIETNAM_TIMEZONE).format("DD/MM/YYYY HH:mm");
}

/**
 * Định dạng ngày: DD/MM/YYYY
 */
export function formatDate(
  date: string | number | Date | dayjs.Dayjs | null | undefined
): string {
  if (!date) return "-";
  return dayjs(date).tz(VIETNAM_TIMEZONE).format("DD/MM/YYYY");
}
