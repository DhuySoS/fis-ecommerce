export interface TopProductDto {
  productId: number;
  name: string;
  quantitySold: number;
}

export interface LowStockProductDto {
  productId: number;
  name: string;
  stock: number;
}

export interface DashboardResponse {
  date: string;
  revenueToday: number | null;
  orderCountByStatus: Record<string, number> | null;
  top5Products: TopProductDto[] | null;
  lowStockProducts: LowStockProductDto[] | null;
  partial: boolean;
  failedParts: string[];
  elapsedMs: number;
}

export interface DashboardQueryParams {
  date?: string;
  mode?: "parallel" | "sequential";
}
