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
 * Định dạng số cho ô InputNumber (dấu chấm ngăn hàng nghìn)
 * Ví dụ: 22990000 -> "22.990.000"
 */
export function formatNumberInput(
  value: number | string | undefined | null
): string {
  if (value === null || value === undefined || value === "") return "";
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Parse chuỗi hiển thị trong ô InputNumber về lại dạng số nguyên dương
 * Tự động loại bỏ mọi ký tự không phải số (dấu âm, dấu chấm, dấu phẩy...)
 * Ví dụ: "22.990.000" -> 22990000
 */
export function parseNumberInput(value: string | undefined | null): number {
  if (!value) return 0;
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
}

/**
 * Chặn nhập ký tự không phải số (dấu âm, dấu chấm, dấu phẩy, chữ e...)
 * Chỉ cho phép nhập chữ số 0-9 và các phím điều hướng/phím chức năng.
 */
export function preventNonNumericInput(
  e: React.KeyboardEvent<HTMLInputElement>
): void {
  if (
    !/^\d$/.test(e.key) &&
    !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Enter"].includes(
      e.key
    ) &&
    !(e.ctrlKey || e.metaKey)
  ) {
    e.preventDefault();
  }
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
