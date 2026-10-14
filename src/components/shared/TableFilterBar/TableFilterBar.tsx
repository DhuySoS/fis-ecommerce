"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input, Select } from "antd";
import type { InputProps } from "antd";
import type { SelectProps } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import styles from "./TableFilterBar.module.scss";

export interface TableFilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function TableFilterBar({ children, className }: TableFilterBarProps) {
  return (
    <div className={`${styles.filterBar} ${className || ""}`.trim()}>
      {children}
    </div>
  );
}

export interface DebouncedSearchInputProps
  extends Omit<InputProps, "onChange" | "value"> {
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function DebouncedSearchInput({
  value: controlledValue = "",
  onChange,
  debounceMs = 300,
  placeholder = "Tìm kiếm...",
  allowClear = true,
  className,
  ...props
}: DebouncedSearchInputProps) {
  const [innerValue, setInnerValue] = useState(controlledValue);
  const [prevControlledValue, setPrevControlledValue] = useState(controlledValue);

  if (controlledValue !== prevControlledValue) {
    setPrevControlledValue(controlledValue);
    setInnerValue(controlledValue);
  }

  const debouncedOnChange = useMemo(
    () =>
      debounce((val: string) => {
        onChange(val);
      }, debounceMs),
    [onChange, debounceMs]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInnerValue(val);
    debouncedOnChange(val);
  };

  return (
    <Input
      {...props}
      placeholder={placeholder}
      value={innerValue}
      onChange={handleChange}
      allowClear={allowClear}
      className={`${styles.searchInput} ${className || ""}`.trim()}
    />
  );
}

export interface FilterSelectProps extends SelectProps {
  prefixLabel?: string;
}

export function FilterSelect({
  prefixLabel,
  className,
  suffixIcon = <CaretDownOutlined />,
  ...props
}: FilterSelectProps) {
  return (
    <Select
      {...props}
      suffixIcon={suffixIcon}
      prefix={
        prefixLabel ? (
          <span className={styles.prefixLabel}>{prefixLabel}</span>
        ) : undefined
      }
      className={`${styles.filterSelect} ${className || ""}`.trim()}
    />
  );
}

export default TableFilterBar;
