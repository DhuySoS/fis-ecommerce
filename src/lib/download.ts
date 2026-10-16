/**
 * Kích hoạt tải file từ Blob dữ liệu xuống trình duyệt với tên file tương ứng
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  if (typeof window === "undefined") return;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName || "report");
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}
