"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { appTheme } from "@/lib/theme";

export function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider locale={viVN} theme={appTheme}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
