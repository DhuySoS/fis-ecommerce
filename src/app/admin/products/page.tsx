import React from "react";
import type { Metadata } from "next";
import ProductManagement from "@/features/products/components/ProductManagement";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm | Admin",
};

export default function AdminProductsPage() {
  return <ProductManagement />;
}
