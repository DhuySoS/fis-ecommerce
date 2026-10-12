import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>Admin Sidebar</aside>
      <header>Admin Header</header>
      <main>{children}</main>
    </div>
  );
}
