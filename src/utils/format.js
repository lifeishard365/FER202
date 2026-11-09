export const formatPrice = (value) =>
  `${Number(value).toLocaleString("vi-VN")} ₫`;

export const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("vi-VN") : "";