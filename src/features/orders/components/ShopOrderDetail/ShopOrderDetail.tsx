"use client";

import React, { useMemo, useState } from "react";
import { App, Spin } from "antd";
import StatusTag from "@/components/shared/StatusTag";
import { formatCurrency } from "@/lib/format";
import {
  useOrder,
  useUpdateOrderItems,
  useCheckoutOrder,
} from "@/features/orders/hooks";
import { useProducts } from "@/features/products/hooks";
import type { Product } from "@/features/products/types";
import OrderItemsEditor from "./OrderItemsEditor";
import AddItemBar, { type ProductSelectOption } from "./AddItemBar";
import StockAlert from "./StockAlert";
import PaymentCard from "./PaymentCard";
import type { EditableOrderItem, StockAlertInfo } from "./types";
import styles from "./ShopOrderDetail.module.scss";

export interface ShopOrderDetailProps {
  orderId: string | number;
}

export default function ShopOrderDetail({ orderId }: ShopOrderDetailProps) {
  const numericOrderId = Number(orderId);
  const { message } = App.useApp();

  const {
    data: order,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useOrder(numericOrderId);

  const { data: productData, isLoading: isLoadingProducts } = useProducts({
    pageSize: 100,
  });

  const updateOrderItemsMutation = useUpdateOrderItems();
  const checkoutOrderMutation = useCheckoutOrder();

  // State
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >(undefined);
  const [addQuantity, setAddQuantity] = useState<number>(1);
  const [stockAlert, setStockAlert] = useState<StockAlertInfo | null>(null);

  // Derived items từ order data
  const orderItems = order?.items;
  const items = useMemo<EditableOrderItem[]>(() => {
    if (!orderItems) return [];
    return orderItems.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      totalPrice: i.totalPrice,
    }));
  }, [orderItems]);

  // Map danh sách sản phẩm cho dropdown
  const productOptions = useMemo<ProductSelectOption[]>(() => {
    if (!productData?.items) return [];
    return productData.items.map((p) => ({
      value: p.id,
      label: `${p.name} (${formatCurrency(p.price)})`,
      name: p.name,
      price: p.price,
      stock: p.stock,
      disabled: p.status === "INACTIVE" || p.stock <= 0,
    }));
  }, [productData]);

  // Helper map id sản phẩm sang thông tin sản phẩm
  const productMap = useMemo(() => {
    const map = new Map<number, Product>();
    if (productData?.items) {
      productData.items.forEach((p) => map.set(p.id, p));
    }
    return map;
  }, [productData]);

  // Kiểm tra đơn hàng có được phép chỉnh sửa không (chỉ PENDING mới được sửa)
  const isPending = order?.status === "PENDING";

  // Đồng bộ danh sách items lên backend
  const syncItemsToServer = (updatedItems: EditableOrderItem[]) => {
    updateOrderItemsMutation.mutate(
      {
        id: numericOrderId,
        data: {
          items: updatedItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
      },
      {
        onError: (err: unknown) => {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Không thể cập nhật giỏ hàng!";
          message.error(errorMsg);
        },
      },
    );
  };

  // 1. Xử lý tăng/giảm số lượng
  const handleQuantityChange = (productId: number, newQty: number) => {
    if (!isPending) return;

    const prodInfo = productMap.get(productId);
    const availableStock = prodInfo?.stock ?? 999;
    const productName =
      items.find((i) => i.productId === productId)?.productName ||
      prodInfo?.name ||
      "Sản phẩm";

    // Kiểm tra tồn kho khi tăng số lượng
    if (newQty > availableStock) {
      setStockAlert({
        productName,
        availableStock,
        requestedQty: newQty,
      });
      return;
    }

    // Nếu đủ hàng, xoá cảnh báo lỗi
    setStockAlert(null);

    const updated = items.map((i) =>
      i.productId === productId
        ? {
            ...i,
            quantity: newQty,
            totalPrice: i.unitPrice * newQty,
          }
        : i,
    );

    syncItemsToServer(updated);
  };

  // 2. Xử lý xoá dòng
  const handleDeleteItem = (productId: number) => {
    if (!isPending) return;

    // Xoá cảnh báo nếu đang báo sản phẩm này
    const deletedItem = items.find((i) => i.productId === productId);
    if (stockAlert && deletedItem?.productName === stockAlert.productName) {
      setStockAlert(null);
    }

    const updated = items.filter((i) => i.productId !== productId);
    syncItemsToServer(updated);
  };

  // 3. Xử lý thêm sản phẩm
  const handleAddItem = () => {
    if (!isPending) return;

    if (!selectedProductId) {
      message.warning("Vui lòng chọn sản phẩm cần thêm!");
      return;
    }

    const prod = productMap.get(selectedProductId);
    if (!prod) return;

    const existingItem = items.find((i) => i.productId === selectedProductId);
    const currentQtyInOrder = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQtyInOrder + addQuantity;

    // Kiểm tra tồn kho
    if (totalRequested > prod.stock) {
      setStockAlert({
        productName: prod.name,
        availableStock: prod.stock,
        requestedQty: totalRequested,
      });
      return;
    }

    // Đủ hàng
    setStockAlert(null);

    let updated: EditableOrderItem[];
    if (existingItem) {
      updated = items.map((i) =>
        i.productId === selectedProductId
          ? {
              ...i,
              quantity: totalRequested,
              totalPrice: i.unitPrice * totalRequested,
            }
          : i,
      );
    } else {
      updated = [
        ...items,
        {
          productId: prod.id,
          productName: prod.name,
          unitPrice: prod.price,
          quantity: addQuantity,
          totalPrice: prod.price * addQuantity,
          stock: prod.stock,
        },
      ];
    }

    // Reset picker
    setSelectedProductId(undefined);
    setAddQuantity(1);

    syncItemsToServer(updated);
  };

  // Tính tổng tiền
  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  // Xử lý thanh toán
  const handleCheckout = () => {
    checkoutOrderMutation.mutate(numericOrderId, {
      onSuccess: (res: any) => {
        message.success(res?.message || "Khởi tạo thanh toán thành công!");
        if (res?.paymentUrl) {
          window.location.href = res.paymentUrl;
        }
      },
      onError: (err: unknown) => {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Không thể thực hiện thanh toán, vui lòng thử lại!";
        message.error(errorMsg);
      },
    });
  };

  if (isLoadingOrder) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" description="Đang tải thông tin đơn hàng..." />
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.mainCard}>
          <div className={styles.orderTitle}>
            Không tìm thấy đơn hàng #{numericOrderId}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainCard}>
        {/* Header: Đơn hàng #100 + StatusTag + Khách hàng */}
        <div className={styles.headerSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.orderTitle}>Đơn hàng #{order.id}</h1>
            <StatusTag status={order.status} />
          </div>
          <p className={styles.customerInfo}>
            Khách hàng: <strong>{order.customerName}</strong>
          </p>
        </div>

        {/* Bố cục 2 cột theo wireframe */}
        <div className={styles.contentSplitLayout}>
          {/* Cột trái: Bảng, Thêm sản phẩm, Cảnh báo tồn kho, Tổng tiền */}
          <div className={styles.leftColumn}>
            <OrderItemsEditor
              items={items}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleDeleteItem}
              disabled={!isPending || updateOrderItemsMutation.isPending}
            />

            {/* Dòng Thêm sản phẩm */}
            {isPending && (
              <AddItemBar
                products={productOptions}
                selectedProductId={selectedProductId}
                quantity={addQuantity}
                isLoading={isLoadingProducts}
                disabled={updateOrderItemsMutation.isPending}
                onProductChange={(id) => setSelectedProductId(id)}
                onQuantityChange={(qty) => setAddQuantity(qty)}
                onAddItem={handleAddItem}
              />
            )}

            {/* Cảnh báo không đủ hàng */}
            <StockAlert alert={stockAlert} />

            {/* Tổng tiền */}
            <div className={styles.totalRow}>
              <div className={styles.totalText}>
                Tổng tiền: <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Card Thanh toán (Đã lược bỏ phần ghi chú theo yêu cầu) */}
          <PaymentCard
            totalAmount={totalAmount}
            onCheckout={handleCheckout}
            isLoading={checkoutOrderMutation.isPending}
            disabled={!isPending || items.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
