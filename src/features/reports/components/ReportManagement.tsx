"use client";

import React, { useMemo, useState } from "react";
import { App, Radio, Skeleton } from "antd";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import { useCustomers } from "@/features/customers/hooks";
import { useReportDefinition, useExportReport } from "../hooks";
import {
  validateReportForm,
  buildReportExportPayload,
  mapReportParamErrors,
} from "../mapper";
import ReportFormField from "./ReportFormField";
import { AppApiError } from "@/lib/api-client";
import { downloadBlob } from "@/lib/download";
import styles from "./ReportManagement.module.scss";

export default function ReportManagement() {
  const { message } = App.useApp();

  const { data: reportDef, isLoading: isLoadingDef } =
    useReportDefinition("RPT_REVENUE_DAILY");
  const { data: customerData, isLoading: isLoadingCustomers } = useCustomers();
  const exportMutation = useExportReport();

  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [format, setFormat] = useState<"PDF" | "XLSX">("PDF");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const customerOptions = useMemo(() => {
    const list = [{ value: "all", label: "Tất cả" }];
    if (customerData?.items) {
      customerData.items.forEach((c) => {
        list.push({
          value: String(c.id),
          label: `${c.name} (${c.email})`,
        });
      });
    }
    return list;
  }, [customerData]);

  const handleFieldChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if ((name === "fromDate" || name === "toDate") && errors["toDate"]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next["toDate"];
        return next;
      });
    }
  };

  const handleExport = () => {
    const paramsList = reportDef?.params || [];
    const newErrors = validateReportForm(paramsList, formValues);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payloadParams = buildReportExportPayload(paramsList, formValues);

    exportMutation.mutate(
      {
        reportCode: reportDef?.code || "RPT_REVENUE_DAILY",
        format,
        params: payloadParams,
      },
      {
        onSuccess: (res) => {
          downloadBlob(res.blob, res.fileName);
          message.success("Xuất báo cáo thành công!");
        },
        onError: (err: unknown) => {
          if (err instanceof AppApiError) {
            if (err.errors && err.errors.length > 0) {
              const beErrors = mapReportParamErrors(err.errors);
              setErrors((prev) => ({
                ...prev,
                ...beErrors,
              }));
            }
            message.error(
              err.message ||
                "Xuất báo cáo thất bại, vui lòng kiểm tra tham số!",
            );
          } else {
            message.error("Xuất báo cáo thất bại, vui lòng thử lại!");
          }
        },
      },
    );
  };

  const renderDynamicForm = () => {
    const params = reportDef?.params || [];
    const fromParam = params.find((p) => p.name === "fromDate");
    const toParam = params.find((p) => p.name === "toDate");
    const hasFromAndToDate = Boolean(fromParam && toParam);
    const otherParams = hasFromAndToDate
      ? params.filter((p) => p.name !== "fromDate" && p.name !== "toDate")
      : params;

    return (
      <div className={styles.formBody}>
        {hasFromAndToDate && fromParam && toParam && (
          <div className={styles.dateRangeRow}>
            <ReportFormField
              param={fromParam}
              value={formValues.fromDate}
              error={errors.fromDate}
              onChange={(val) => handleFieldChange("fromDate", val)}
            />
            <ReportFormField
              param={toParam}
              value={formValues.toDate}
              error={errors.toDate}
              onChange={(val) => handleFieldChange("toDate", val)}
            />
          </div>
        )}

        {otherParams.map((param) => (
          <ReportFormField
            key={param.name}
            param={param}
            value={formValues[param.name]}
            error={errors[param.name]}
            customerOptions={customerOptions}
            isLoadingCustomers={isLoadingCustomers}
            onChange={(val) => handleFieldChange(param.name, val)}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminPageContainer title="Báo cáo doanh thu theo ngày">
      <div className={styles.pageWrapper}>
        <div className={styles.reportCard}>
          {isLoadingDef ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <>
              {renderDynamicForm()}

              <div className={styles.formatField}>
                <label className={styles.label}>Định dạng</label>
                <Radio.Group
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={styles.radioGroup}
                >
                  <Radio value="PDF">PDF</Radio>
                  <Radio value="XLSX">XLSX</Radio>
                </Radio.Group>
              </div>

              <div className={styles.buttonRow}>
                <ActionButton
                  onClick={handleExport}
                  loading={exportMutation.isPending}
                  className={styles.exportBtn}
                >
                  Xuất báo cáo
                </ActionButton>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminPageContainer>
  );
}
