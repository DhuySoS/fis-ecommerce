"use client";

import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import styles from "./ActionButton.module.scss";

export interface ActionButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "cancel";
}

export default function ActionButton({
  children,
  className,
  variant = "primary",
  ...props
}: ActionButtonProps) {
  const variantClass =
    variant === "cancel" ? styles.actionCancelBtn : styles.actionBtn;

  return (
    <Button
      {...props}
      className={`${variantClass} ${className || ""}`.trim()}
    >
      {children}
    </Button>
  );
}
