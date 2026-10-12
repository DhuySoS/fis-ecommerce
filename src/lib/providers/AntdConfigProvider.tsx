"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme as antdTheme } from "antd";
import viVN from "antd/locale/vi_VN";

export function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={viVN}
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 6,
            colorSuccess: "#52c41a",
            colorWarning: "#faad14",
            colorError: "#ff4d4f",
            colorInfo: "#1677ff",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
