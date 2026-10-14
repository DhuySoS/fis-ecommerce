import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

export const appTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 6,
    controlHeight: 36,
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    colorBgLayout: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Menu: {
      fontSize: 16,
      itemSelectedBg: "#e0e0e0",
      itemSelectedColor: "#000000",
      itemActiveBg: "#e0e0e0",
      itemBorderRadius: 6,
      itemMarginInline: 12,
      itemMarginBlock: 16,
      itemHeight: 44,
    },
    Table: {
      headerBg: "#f5f5f5",
      headerColor: "#262626",
      headerBorderRadius: 8,
      borderColor: "#f0f0f0",
      rowHoverBg: "#fbfbfb",
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
      cellFontSize: 14,
      headerSplitColor: "transparent",
    },
    Pagination: {
      itemSizeSM: 28,
    },
  },
};
