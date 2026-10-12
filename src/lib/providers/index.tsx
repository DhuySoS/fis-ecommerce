"use client";

import React from "react";
import { AntdConfigProvider } from "./AntdConfigProvider";
import { ReactQueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </ReactQueryProvider>
  );
}
