import { OrderStatus } from "@/lib/order-state-machine";

export interface DashboardRevenue {
  date: string;
  totalRevenue: number;
}

export interface DashboardOrderStatusCount {
  status: OrderStatus;
  count: number;
}

export interface DashboardTopProduct {
  productId: number;
  productName: string;
  soldQuantity: number;
}

export interface DashboardLowStockProduct {
  productId: number;
  productName: string;
  stock: number;
}
