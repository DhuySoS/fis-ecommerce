export type OrderStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderStatusConfig {
  label: string;
  color: "gold" | "orange" | "green" | "blue" | "cyan" | "red";
  description: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: {
    label: "PENDING",
    color: "gold",
    description: "Mới tạo, đang sửa được",
  },
  AWAITING_PAYMENT: {
    label: "AWAITING_PAYMENT",
    color: "orange",
    description: "Đã checkout, chờ thanh toán",
  },
  PAID: {
    label: "PAID",
    color: "green",
    description: "Đã thanh toán",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    color: "blue",
    description: "Admin đã xác nhận",
  },
  COMPLETED: {
    label: "COMPLETED",
    color: "cyan",
    description: "Hoàn thành",
  },
  CANCELLED: {
    label: "CANCELLED",
    color: "red",
    description: "Đã huỷ",
  },
};

/**
 * Danh sách các chuyển đổi trạng thái hợp lệ trong toàn bộ hệ thống
 */
export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["AWAITING_PAYMENT", "CANCELLED"],
  AWAITING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["CONFIRMED"],
  CONFIRMED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Kiểm tra xem bước chuyển trạng thái có hợp lệ hay không
 */
export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Lấy các hành động khả dụng cho Admin trên từng trạng thái
 */
export function getAdminAvailableTransitions(currentStatus: OrderStatus): {
  targetStatus: OrderStatus;
  label: string;
  type?: "primary" | "danger" | "default";
}[] {
  switch (currentStatus) {
    case "PENDING":
      return [
        {
          targetStatus: "CANCELLED",
          label: "Huỷ đơn hàng",
          type: "danger",
        },
      ];
    case "PAID":
      return [
        {
          targetStatus: "CONFIRMED",
          label: "Xác nhận đơn (CONFIRMED)",
          type: "primary",
        },
      ];
    case "CONFIRMED":
      return [
        {
          targetStatus: "COMPLETED",
          label: "Hoàn thành đơn (COMPLETED)",
          type: "primary",
        },
      ];
    default:
      return [];
  }
}
