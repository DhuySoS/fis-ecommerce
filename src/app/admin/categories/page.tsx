import React from "react";
import type { Metadata } from "next";
import { CategoryManagement } from "@/features/categories";

export const metadata: Metadata = {
  title: "Quản lý danh mục | Admin",
};

export default function AdminCategoriesPage() {
  return <CategoryManagement />;
}
