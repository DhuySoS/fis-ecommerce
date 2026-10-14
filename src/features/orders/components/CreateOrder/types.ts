export interface SelectedOrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}

export interface ProductOptionItem {
  value: number;
  label: string;
  name: string;
  price: number;
  stock: number;
  subLabel: string;
  disabled: boolean;
  searchKey: string;
}
