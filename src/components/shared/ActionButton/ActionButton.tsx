"use client";

import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import styles from "./ActionButton.module.scss";

export type ActionButtonProps = ButtonProps;

export default function ActionButton({
  children,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      {...props}
      className={`${styles.actionBtn} ${className || ""}`.trim()}
    >
      {children}
    </Button>
  );
}
