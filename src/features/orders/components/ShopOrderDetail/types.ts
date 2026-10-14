export interface EditableOrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  stock?: number;
}

export interface StockAlertInfo {
  productName: string;
  availableStock: number;
  requestedQty: number;
}
