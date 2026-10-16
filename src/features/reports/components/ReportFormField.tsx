import React from "react";
import dayjs from "dayjs";
import { DatePicker, Input, InputNumber, Select } from "antd";
import { getParamLabel } from "../mapper";
import type { ReportParamResponse } from "../types";
import styles from "./ReportFormField.module.scss";

export interface ReportFormFieldProps {
  param: ReportParamResponse;
  value: unknown;
  error?: string;
  customerOptions?: Array<{ value: string; label: string }>;
  isLoadingCustomers?: boolean;
  onChange: (value: unknown) => void;
}

export default function ReportFormField({
  param,
  value,
  error,
  customerOptions = [],
  isLoadingCustomers = false,
  onChange,
}: ReportFormFieldProps) {
  const isError = Boolean(error);
  const status = isError ? "error" : undefined;
  const isCustomerRef =
    param.name === "customerId" ||
    Boolean(param.validationRules && param.validationRules.includes("customers"));

  const renderControl = () => {
    if (param.dataType === "DATE") {
      return (
        <DatePicker
          format="DD/MM/YYYY"
          placeholder="Chọn ngày"
          value={value ? dayjs(String(value)) : null}
          onChange={(date) => {
            onChange(date ? date.format("YYYY-MM-DD") : "");
          }}
          status={status}
          className={styles.control}
        />
      );
    }

    if (isCustomerRef) {
      return (
        <Select
          placeholder="Tất cả"
          value={value ? String(value) : "all"}
          onChange={(selectedValue) => {
            onChange(selectedValue === "all" ? undefined : selectedValue);
          }}
          options={customerOptions}
          loading={isLoadingCustomers}
          status={status}
          className={styles.control}
        />
      );
    }

    if (param.dataType === "LONG" || param.dataType === "INTEGER") {
      return (
        <InputNumber
          placeholder={`Nhập ${getParamLabel(param).toLowerCase()}`}
          value={typeof value === "number" ? value : undefined}
          onChange={(num) => onChange(num)}
          status={status}
          step={1}
          precision={0}
          className={styles.control}
        />
      );
    }

    if (param.dataType === "DECIMAL") {
      return (
        <InputNumber
          placeholder={`Nhập ${getParamLabel(param).toLowerCase()}`}
          value={typeof value === "number" ? value : undefined}
          onChange={(num) => onChange(num)}
          status={status}
          step={1000}
          className={styles.control}
        />
      );
    }

    return (
      <Input
        placeholder={`Nhập ${getParamLabel(param).toLowerCase()}`}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        status={status}
        className={styles.control}
      />
    );
  };

  return (
    <div className={styles.formField}>
      <label className={styles.label}>
        {getParamLabel(param)}
        {param.required && <span className={styles.required}>*</span>}
      </label>
      {renderControl()}
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}
