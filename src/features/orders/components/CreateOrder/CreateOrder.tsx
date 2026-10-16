"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Alert, App, Input, Select, Skeleton } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import { useAuthStore, useMe } from "@/features/auth";
import { useCustomers } from "@/features/customers/hooks";
import { useProducts } from "@/features/products/hooks";
import { useCreateOrder } from "@/features/orders/hooks";
import { formatCurrency } from "@/lib/format";
import OrderItemsTable from "./OrderItemsTable";
import ProductSelectionList from "./ProductSelectionList";
import OrderProductPicker from "./OrderProductPicker";
import type { SelectedOrderItem, ProductOptionItem } from "./types";
import styles from "./CreateOrder.module.scss";

const emptySubscribe = () => () => {};

export default function CreateOrder() {
  const router = useRouter();
  const { message } = App.useApp();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isCustomer = role === "CUSTOMER";
  const isProductOwner = role === "PRODUCT_OWNER";

  // Admin mới cần tải danh sách toàn bộ khách hàng
  const { data: customerData, isLoading: isLoadingCustomers } = useCustomers(
    undefined,
    { enabled: isClient && isAdmin },
  );

  // Customer tự động lấy thông tin của chính mình
  const { data: userProfile, isLoading: isLoadingProfile } = useMe({
    enabled: isClient && isCustomer,
  });

  const { data: productData, isLoading: isLoadingProducts } = useProducts({
    pageSize: 100,
  });

  const createOrderMutation = useCreateOrder();

  // Form State: Dành cho Admin chọn khách hàng
  const [adminSelectedCustomerId, setAdminSelectedCustomerId] = useState<
    number | undefined
  >(undefined);
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<SelectedOrderItem[]>([]);

  // Customer ID: Tự động lấy từ profile khi là Customer, hoặc lấy từ ô chọn khi là Admin
  const effectiveCustomerId = isCustomer
    ? userProfile?.customerId || user?.customerId
    : adminSelectedCustomerId;

  // Danh sách khách hàng dạng [Tên] · [Email] (dành cho Admin)
  const customerOptions = useMemo(() => {
    if (!customerData?.items) return [];
    return customerData.items.map((c) => ({
      value: c.id,
      label: `${c.name} · ${c.email}`,
      searchKey: `${c.name} ${c.email}`.toLowerCase(),
    }));
  }, [customerData]);

  // Danh sách sản phẩm với thông tin tồn kho / ngừng bán
  const productOptions = useMemo<ProductOptionItem[]>(() => {
    if (!productData?.items) return [];
    return productData.items.map((p) => {
      const isInactive = p.status === "INACTIVE";
      const isOutOfStock = p.stock <= 0;
      const isDisabled = isInactive || isOutOfStock;

      let subLabel = `Còn ${p.stock}`;
      if (isInactive) {
        subLabel = "Ngừng bán";
      } else if (isOutOfStock) {
        subLabel = "Hết hàng";
      }

      return {
        value: p.id,
        label: p.name,
        name: p.name,
        price: p.price,
        stock: p.stock,
        subLabel,
        disabled: isDisabled,
        searchKey: p.name.toLowerCase(),
      };
    });
  }, [productData]);

  // Xử lý thêm sản phẩm vào bảng
  const handleAddItem = () => {
    if (!selectedProductId) {
      message.warning("Vui lòng chọn sản phẩm cần thêm!");
      return;
    }

    const product = productData?.items.find((p) => p.id === selectedProductId);
    if (!product) return;

    if (quantity < 1 || quantity > 99) {
      message.warning("Số lượng sản phẩm phải từ 1 đến 99!");
      return;
    }

    setOrderItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id,
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > 99) {
          message.warning(
            "Tổng số lượng cho sản phẩm này không được vượt quá 99!",
          );
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: quantity,
          stock: product.stock,
        },
      ];
    });

    // Reset picker sau khi thêm thành công
    setSelectedProductId(undefined);
    setQuantity(1);
  };

  // Xử lý xóa dòng sản phẩm
  const handleDeleteItem = (productId: number) => {
    setOrderItems((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  // Tính tổng tiền tạm tính
  const totalAmount = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
  }, [orderItems]);

  // Xử lý submit tạo đơn hàng
  const handleCreateOrder = () => {
    if (isAdmin && !adminSelectedCustomerId) {
      message.error("Vui lòng chọn khách hàng!");
      return;
    }

    if (orderItems.length === 0) {
      message.error("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng!");
      return;
    }

    createOrderMutation.mutate(
      {
        customerId: effectiveCustomerId,
        items: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (res: unknown) => {
          const resObj = res as
            | { message?: string; data?: { id?: number }; id?: number }
            | undefined;
          message.success(resObj?.message || "Tạo đơn hàng thành công!");
          const orderId = resObj?.data?.id || resObj?.id;
          if (orderId) {
            if (isCustomer) {
              router.push(`/orders/${orderId}`);
            } else {
              router.push(`/admin/orders/${orderId}`);
            }
          } else {
            if (isCustomer) {
              router.push("/orders/new");
            } else {
              router.push("/admin/orders");
            }
          }
        },
        onError: (err: unknown) => {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Không thể tạo đơn hàng, vui lòng thử lại!";
          message.error(errorMsg);
        },
      },
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardContainer}>
        <AdminPageContainer title="Tạo đơn hàng">
          <div className={styles.createOrderCard}>
            {/* Bố cục 2 phần: Bên trái (Form & Bảng) - Bên phải (Danh sách chọn) */}
            <div className={styles.mainSplitLayout}>
              {/* Cột trái */}
              <div className={styles.leftCol}>
                <div className={styles.formGrid}>
                  {/* Chọn khách hàng (nằm ở cột 1, bằng chiều rộng ô Sản phẩm) */}
                  <div className={styles.customerRow}>
                    <label className={styles.label}>
                      Khách hàng <span className={styles.required}>*</span>
                    </label>
                    {isCustomer ? (
                      <Input
                        className={styles.customerInput}
                        value={
                          userProfile?.name
                            ? `${userProfile.name} · ${userProfile.email || user?.username}`
                            : isLoadingProfile
                              ? "Đang tải thông tin khách hàng..."
                              : user?.username || "Khách hàng hiện tại"
                        }
                        disabled
                      />
                    ) : (
                      <Select
                        className={styles.customerSelect}
                        placeholder="Chọn khách hàng"
                        suffixIcon={<CaretDownOutlined />}
                        value={adminSelectedCustomerId}
                        onChange={(val) => setAdminSelectedCustomerId(val)}
                        options={customerOptions}
                        loading={isLoadingCustomers}
                      />
                    )}
                  </div>

                  {/* Component chọn sản phẩm, số lượng và nút Thêm dòng */}
                  <OrderProductPicker
                    products={productOptions}
                    selectedProductId={selectedProductId}
                    quantity={quantity}
                    isLoading={isLoadingProducts}
                    onProductChange={(id) => setSelectedProductId(id)}
                    onQuantityChange={(qty) => setQuantity(qty)}
                    onAddItem={handleAddItem}
                  />
                </div>

                {/* Component Bảng sản phẩm trong đơn */}
                <OrderItemsTable
                  items={orderItems}
                  onDeleteItem={handleDeleteItem}
                />
              </div>

              {/* Component Danh sách chọn sản phẩm bên phải (hiển thị thông tin sản phẩm và tình trạng kho) */}
              <ProductSelectionList products={productOptions} />
            </div>

            {/* Chân trang: Tạm tính & Tạo đơn */}
            <div className={styles.footerBar}>
              <div className={styles.totalAmountText}>
                Tạm tính: {formatCurrency(totalAmount)}
              </div>
              <ActionButton
                type="primary"
                className={styles.submitBtn}
                onClick={handleCreateOrder}
                loading={createOrderMutation.isPending}
                disabled={
                  (isAdmin && !adminSelectedCustomerId) ||
                  orderItems.length === 0
                }
              >
                Tạo đơn
              </ActionButton>
            </div>
          </div>
        </AdminPageContainer>
      </div>
    </div>
  );
}
